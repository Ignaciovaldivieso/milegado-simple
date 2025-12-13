'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase, Testamento } from '../lib/supabase';
import { FileText, Plus, LogOut, Trash2, Download } from 'lucide-react';
import jsPDF from 'jspdf';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [testamentos, setTestamentos] = useState<Testamento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
    loadTestamentos();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push('/login');
      return;
    }
    
    setUser(user);
  };

  const loadTestamentos = async () => {
    try {
      const { data, error } = await supabase
        .from('testamentos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setTestamentos(data || []);
    } catch (error) {
      console.error('Error cargando testamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este testamento?')) return;

    try {
      const { error } = await supabase
        .from('testamentos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTestamentos(testamentos.filter(t => t.id !== id));
      alert('Testamento eliminado');
    } catch (error) {
      console.error('Error eliminando:', error);
      alert('Error al eliminar');
    }
  };

  const handleDownload = (testamento: Testamento) => {
    // Generar PDF completo con formato legal
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'letter',
    });

    const fechaActual = new Date().toLocaleDateString('es-CL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const fechaNacimiento = new Date(testamento.fecha_nacimiento).toLocaleDateString('es-CL');

    // Configuración
    const margin = 20;
    const pageWidth = 215.9;
    const maxWidth = pageWidth - (margin * 2);
    let y = margin;

    const addText = (text: string, fontSize: number = 11, isBold: boolean = false, align: 'left' | 'center' = 'left') => {
      doc.setFontSize(fontSize);
      doc.setFont('times', isBold ? 'bold' : 'normal');

      if (align === 'center') {
        const lines = doc.splitTextToSize(text, maxWidth);
        lines.forEach((line: string) => {
          doc.text(line, pageWidth / 2, y, { align: 'center' });
          y += fontSize * 0.6;
        });
      } else {
        const lines = doc.splitTextToSize(text, maxWidth);
        doc.text(lines, margin, y, { align: 'left', maxWidth: maxWidth });
        y += lines.length * fontSize * 0.6;
      }
    };

    const addSpace = (space: number = 6) => {
      y += space;
    };

    const checkNewPage = () => {
      if (y > 250) {
        doc.addPage();
        y = margin;
      }
    };

    // ========== ENCABEZADO ==========
    addText('TESTAMENTO ABIERTO', 16, true, 'center');
    addSpace(4);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    addSpace(10);

    addText(`Otorgado por ${testamento.nombre} ${testamento.apellido}`, 12, false, 'center');
    addText(`RUT: ${testamento.rut}`, 11, false, 'center');
    addSpace(15);

    // ========== I. IDENTIFICACIÓN ==========
    addText('I. IDENTIFICACIÓN DEL TESTADOR', 13, true);
    addSpace(7);

    addText(
      `En ${testamento.ciudad}, a ${fechaActual}, comparece don(ña) ${testamento.nombre} ${testamento.apellido}, ` +
      `cédula nacional de identidad número ${testamento.rut}, de estado civil ${testamento.estado_civil}, ` +
      `nacido(a) el ${fechaNacimiento}, con domicilio en ${testamento.direccion}, ${testamento.ciudad}, ` +
      `quien declara encontrarse en pleno uso de sus facultades mentales y actuar libre de coacción, ` +
      `otorgando el presente testamento conforme a las disposiciones del Código Civil de Chile.`
    );
    addSpace(12);
    checkNewPage();

    // ========== II. REVOCACIÓN ==========
    addText('II. REVOCACIÓN DE TESTAMENTOS ANTERIORES', 13, true);
    addSpace(7);

    addText('PRIMERO: ', 11, true);
    y -= 2;
    addText(
      `Por el presente acto, revoco expresamente cualquier testamento, codicilo o disposición testamentaria ` +
      `que hubiere otorgado con anterioridad a la fecha del presente instrumento.`
    );
    addSpace(12);
    checkNewPage();

    // ========== III. BIENES ==========
    addText('III. DECLARACIÓN DE BIENES', 13, true);
    addSpace(7);

    addText('SEGUNDO: ', 11, true);
    y -= 2;
    addText(`Declaro que al momento de otorgar este testamento, mi patrimonio se compone de los siguientes bienes:`);
    addSpace(6);

    const bienesList = testamento.bienes.split('\n').filter(b => b.trim());
    bienesList.forEach(bien => {
      doc.setFontSize(11);
      doc.setFont('times', 'normal');
      const lines = doc.splitTextToSize(bien.trim(), maxWidth - 15);
      doc.text(lines, margin + 15, y);
      y += lines.length * 11 * 0.6 + 3;
      checkNewPage();
    });
    addSpace(12);

    // ========== IV. HEREDEROS ==========
    addText('IV. DESIGNACIÓN DE HEREDEROS Y LEGATARIOS', 13, true);
    addSpace(7);

    addText('TERCERO: ', 11, true);
    y -= 2;
    addText(`Es mi voluntad que mis bienes sean distribuidos de la siguiente manera:`);
    addSpace(6);

    const beneficiariosList = testamento.beneficiarios.split('\n').filter(b => b.trim());
    beneficiariosList.forEach(beneficiario => {
      doc.setFontSize(11);
      doc.setFont('times', 'normal');
      const lines = doc.splitTextToSize(beneficiario.trim(), maxWidth - 15);
      doc.text(lines, margin + 15, y);
      y += lines.length * 11 * 0.6 + 3;
      checkNewPage();
    });
    addSpace(12);

    // ========== V. INSTRUCCIONES ESPECIALES ==========
    if (testamento.instrucciones_especiales && testamento.instrucciones_especiales.trim()) {
      addText('V. INSTRUCCIONES ESPECIALES', 13, true);
      addSpace(7);

      addText('CUARTO: ', 11, true);
      y -= 2;
      addText(`Es mi voluntad expresar las siguientes instrucciones especiales:`);
      addSpace(6);

      const instruccionesList = testamento.instrucciones_especiales.split('\n').filter(i => i.trim());
      instruccionesList.forEach(instruccion => {
        doc.setFontSize(11);
        doc.setFont('times', 'normal');
        const lines = doc.splitTextToSize(instruccion.trim(), maxWidth - 15);
        doc.text(lines, margin + 15, y);
        y += lines.length * 11 * 0.6 + 3;
        checkNewPage();
      });
      addSpace(12);
    }

    // ========== DISPOSICIONES GENERALES ==========
    const seccionNum = testamento.instrucciones_especiales ? 'VI' : 'V';
    addText(`${seccionNum}. DISPOSICIONES GENERALES`, 13, true);
    addSpace(7);

    addText(
      `Declaro que este testamento refleja fielmente mi voluntad y ha sido otorgado en pleno uso de ` +
      `mis facultades mentales, sin presión ni coacción de ninguna naturaleza.`
    );
    addSpace(18);

    // ========== FIRMA ==========
    checkNewPage();
    addText(`Así lo otorgo y firmo en ${testamento.ciudad}, a ${fechaActual}.`, 11, false, 'center');
    addSpace(30);

    doc.setLineWidth(0.3);
    const firmaX = pageWidth / 2 - 40;
    doc.line(firmaX, y, firmaX + 80, y);
    addSpace(6);

    doc.setFontSize(10);
    doc.setFont('times', 'bold');
    doc.text(`${testamento.nombre} ${testamento.apellido}`, pageWidth / 2, y, { align: 'center' });
    addSpace(5);

    doc.setFont('times', 'normal');
    doc.text(`RUT: ${testamento.rut}`, pageWidth / 2, y, { align: 'center' });
    addSpace(5);
    doc.text('Firma del Testador', pageWidth / 2, y, { align: 'center' });

    // ========== FOOTER ==========
    if (y < 220) {
      y = 220;
    } else {
      doc.addPage();
      y = 220;
    }

    doc.setLineWidth(0.2);
    doc.line(margin, y, pageWidth - margin, y);
    addSpace(5);

    doc.setFontSize(9);
    doc.setFont('times', 'bold');
    doc.text('IMPORTANTE:', pageWidth / 2, y, { align: 'center' });
    addSpace(4);

    doc.setFont('times', 'normal');
    doc.setFontSize(8);
    const disclaimer = doc.splitTextToSize(
      'Este documento es un borrador de testamento generado por MiLegado. Para que tenga validez legal, ' +
      'debe ser otorgado ante notario público conforme al Código Civil de Chile. ' +
      'Se recomienda consultar con un abogado especialista.',
      maxWidth
    );
    doc.text(disclaimer, pageWidth / 2, y, { align: 'center' });

    // Descargar
    doc.save(`testamento-${testamento.nombre}-${testamento.apellido}.pdf`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">MiLegado</h1>
              <p className="text-sm text-gray-600">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <LogOut className="w-5 h-5" />
            Salir
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Actions */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Mis Testamentos</h2>
            <p className="text-gray-600 mt-1">
              {testamentos.length} testamento{testamentos.length !== 1 ? 's' : ''} guardado{testamentos.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Link
            href="/formulario"
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="w-5 h-5" />
            Nuevo Testamento
          </Link>
        </div>

        {/* List */}
        {testamentos.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No tienes testamentos guardados
            </h3>
            <p className="text-gray-600 mb-6">
              Crea tu primer testamento y guárdalo de forma segura
            </p>
            <Link
              href="/formulario"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              <Plus className="w-5 h-5" />
              Crear Testamento
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testamentos.map((testamento) => (
              <div key={testamento.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {testamento.nombre} {testamento.apellido}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(testamento.created_at).toLocaleDateString('es-CL')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-sm text-gray-600 mb-4">
                  <p><strong>RUT:</strong> {testamento.rut}</p>
                  <p><strong>Ciudad:</strong> {testamento.ciudad}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownload(testamento)}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
                  >
                    <Download className="w-4 h-4" />
                    Descargar
                  </button>
                  <button
                    onClick={() => handleDelete(testamento.id)}
                    className="flex items-center justify-center bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
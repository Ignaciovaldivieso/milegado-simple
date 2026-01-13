'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase, Testamento } from '../lib/supabase';
import { FileText, Plus, LogOut, Trash2, Download, Calendar, User, Home, Users, Clock, CheckCircle2 } from 'lucide-react';
import jsPDF from 'jspdf';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [testamentos, setTestamentos] = useState<Testamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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
    if (!confirm('¿Estás seguro de eliminar este testamento? Esta acción no se puede deshacer.')) return;

    setDeletingId(id);
    try {
      const { error } = await supabase
        .from('testamentos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTestamentos(testamentos.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error eliminando:', error);
      alert('Error al eliminar el testamento');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownload = (testamento: Testamento) => {
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

    addText('TESTAMENTO ABIERTO', 16, true, 'center');
    addSpace(4);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    addSpace(10);

    addText(`Otorgado por ${testamento.nombre} ${testamento.apellido}`, 12, false, 'center');
    addText(`RUT: ${testamento.rut}`, 11, false, 'center');
    addSpace(15);

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

    const seccionNum = testamento.instrucciones_especiales ? 'VI' : 'V';
    addText(`${seccionNum}. DISPOSICIONES GENERALES`, 13, true);
    addSpace(7);

    addText(
      `Declaro que este testamento refleja fielmente mi voluntad y ha sido otorgado en pleno uso de ` +
      `mis facultades mentales, sin presión ni coacción de ninguna naturaleza.`
    );
    addSpace(18);

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

    doc.save(`testamento-${testamento.nombre}-${testamento.apellido}.pdf`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Cargando tus testamentos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50">
      {/* Header Mejorado */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Mi Dashboard</h1>
                <p className="text-blue-100 text-sm flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {user?.email}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-5 py-2.5 rounded-xl hover:bg-white/20 transition border border-white/20"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-semibold">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <FileText className="w-8 h-8 opacity-80" />
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="text-3xl font-bold mb-1">{testamentos.length}</div>
            <div className="text-blue-100 text-sm">Testamento{testamentos.length !== 1 ? 's' : ''} Creado{testamentos.length !== 1 ? 's' : ''}</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 opacity-80" />
              <span className="text-2xl">⚡</span>
            </div>
            <div className="text-3xl font-bold mb-1">~15min</div>
            <div className="text-green-100 text-sm">Tiempo Promedio</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <Download className="w-8 h-8 opacity-80" />
              <span className="text-2xl">✓</span>
            </div>
            <div className="text-3xl font-bold mb-1">100%</div>
            <div className="text-purple-100 text-sm">Disponibilidad</div>
          </div>
        </div>

        {/* Actions Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Mis Testamentos</h2>
            <p className="text-gray-600">
              {testamentos.length === 0 
                ? 'Aún no has creado ningún testamento' 
                : `Tienes ${testamentos.length} testamento${testamentos.length !== 1 ? 's' : ''} guardado${testamentos.length !== 1 ? 's' : ''}`
              }
            </p>
          </div>
          <Link
            href="/formulario"
            className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3.5 rounded-xl hover:from-blue-700 hover:to-blue-800 transition shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
          >
            <Plus className="w-5 h-5" />
            Nuevo Testamento
          </Link>
        </div>

        {/* List */}
        {testamentos.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              No tienes testamentos guardados
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Crea tu primer testamento y guárdalo de forma segura en la nube. Solo toma 15 minutos.
            </p>
            <Link
              href="/formulario"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
            >
              <Plus className="w-6 h-6" />
              Crear Mi Primer Testamento
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testamentos.map((testamento, index) => (
              <div 
                key={testamento.id} 
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-blue-200 transform hover:scale-[1.02]"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Header con gradiente */}
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
                      <CheckCircle2 className="w-3 h-3" />
                      Activo
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-1">
                    {testamento.nombre} {testamento.apellido}
                  </h3>
                  <p className="text-blue-100 text-sm flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(testamento.created_at).toLocaleDateString('es-CL', { 
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>

                {/* Body */}
                <div className="p-6">
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <div className="text-gray-500 text-xs">RUT</div>
                        <div className="font-semibold text-gray-900">{testamento.rut}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Home className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <div className="text-gray-500 text-xs">Ciudad</div>
                        <div className="font-semibold text-gray-900">{testamento.ciudad}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Users className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <div className="text-gray-500 text-xs">Estado Civil</div>
                        <div className="font-semibold text-gray-900 capitalize">{testamento.estado_civil}</div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/formulario?edit=${testamento.id}`)}
                      className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      <FileText className="w-4 h-4" />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDownload(testamento)}
                      className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      <Download className="w-4 h-4" />
                      Descargar
                    </button>
                    <button
                      onClick={() => handleDelete(testamento.id)}
                      disabled={deletingId === testamento.id}
                      className="flex items-center justify-center bg-red-50 text-red-600 px-4 py-3 rounded-xl hover:bg-red-100 transition border-2 border-red-200 hover:border-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deletingId === testamento.id ? (
                        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
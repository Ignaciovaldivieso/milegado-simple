'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FileText, User, Home, Users, FileCheck, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import Tooltip from '../components/Tooltip';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';

// Schema simplificado para el formulario
const testamentoSchema = z.object({
  // Datos Personales
  nombre: z.string().min(2, 'Mínimo 2 caracteres'),
  apellido: z.string().min(2, 'Mínimo 2 caracteres'),
  rut: z.string().min(8, 'RUT inválido'),
  fechaNacimiento: z.string(),
  estadoCivil: z.enum(['soltero', 'casado', 'viudo', 'divorciado']),
  direccion: z.string().min(5, 'Dirección muy corta'),
  ciudad: z.string().min(2, 'Ciudad inválida'),
  
  // Bienes (simplificado)
  bienes: z.string().min(10, 'Describe tus bienes principales'),
  
  // Beneficiarios (simplificado)
  beneficiarios: z.string().min(10, 'Describe quiénes recibirán tu herencia'),
  
  // Instrucciones especiales
  instruccionesEspeciales: z.string().optional(),
});

type FormData = z.infer<typeof testamentoSchema>;

export default function FormularioPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(testamentoSchema),
  });

  const onSubmit = async (data: FormData) => {
    console.log('🔵 Iniciando generación de PDF...', data);
    setIsGenerating(true);
    
    try {
      // Guardar en base de datos si el usuario está logueado
      if (user) {
        console.log('💾 Guardando en base de datos...');
        
        const { data: testamento, error } = await supabase
          .from('testamentos')
          .insert([
            {
              user_id: user.id,
              nombre: data.nombre,
              apellido: data.apellido,
              rut: data.rut,
              fecha_nacimiento: data.fechaNacimiento,
              estado_civil: data.estadoCivil,
              direccion: data.direccion,
              ciudad: data.ciudad,
              bienes: data.bienes,
              beneficiarios: data.beneficiarios,
              instrucciones_especiales: data.instruccionesEspeciales || null,
            }
          ])
          .select();

        if (error) {
          console.error('❌ Error guardando en DB:', error);
          throw error;
        }

        console.log('✅ Testamento guardado en base de datos');
      }

      console.log('🔵 Generando PDF con jsPDF...');
      
      // Generar el PDF
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

      const fechaNacimiento = new Date(data.fechaNacimiento).toLocaleDateString('es-CL');

      // Configuración
      const margin = 20; // Reducido de 25 a 20 para más espacio
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
            y += fontSize * 0.6; // Mejor espaciado entre líneas
          });
        } else {
          const lines = doc.splitTextToSize(text, maxWidth);
          doc.text(lines, margin, y, { align: 'left', maxWidth: maxWidth });
          y += lines.length * fontSize * 0.6; // Mejor espaciado entre líneas
        }
      };

      const addSpace = (space: number = 6) => { // Reducido de 8 a 6
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

      addText(`Otorgado por ${data.nombre} ${data.apellido}`, 12, false, 'center');
      addText(`RUT: ${data.rut}`, 11, false, 'center');
      addSpace(15);

      // ========== I. IDENTIFICACIÓN ==========
      addText('I. IDENTIFICACIÓN DEL TESTADOR', 13, true);
      addSpace(7);

      addText(
        `En ${data.ciudad}, a ${fechaActual}, comparece don(ña) ${data.nombre} ${data.apellido}, ` +
        `cédula nacional de identidad número ${data.rut}, de estado civil ${data.estadoCivil}, ` +
        `nacido(a) el ${fechaNacimiento}, con domicilio en ${data.direccion}, ${data.ciudad}, ` +
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

      const bienesList = data.bienes.split('\n').filter(b => b.trim());
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

      const beneficiariosList = data.beneficiarios.split('\n').filter(b => b.trim());
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
      if (data.instruccionesEspeciales && data.instruccionesEspeciales.trim()) {
        addText('V. INSTRUCCIONES ESPECIALES', 13, true);
        addSpace(7);

        addText('CUARTO: ', 11, true);
        y -= 2;
        addText(`Es mi voluntad expresar las siguientes instrucciones especiales:`);
        addSpace(6);

        const instruccionesList = data.instruccionesEspeciales.split('\n').filter(i => i.trim());
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
      const seccionNum = data.instruccionesEspeciales ? 'VI' : 'V';
      addText(`${seccionNum}. DISPOSICIONES GENERALES`, 13, true);
      addSpace(7);

      addText(
        `Declaro que este testamento refleja fielmente mi voluntad y ha sido otorgado en pleno uso de ` +
        `mis facultades mentales, sin presión ni coacción de ninguna naturaleza.`
      );
      addSpace(18);

      // ========== FIRMA ==========
      checkNewPage();
      addText(`Así lo otorgo y firmo en ${data.ciudad}, a ${fechaActual}.`, 11, false, 'center');
      addSpace(30);

      doc.setLineWidth(0.3);
      const firmaX = pageWidth / 2 - 40;
      doc.line(firmaX, y, firmaX + 80, y);
      addSpace(6);

      doc.setFontSize(10);
      doc.setFont('times', 'bold');
      doc.text(`${data.nombre} ${data.apellido}`, pageWidth / 2, y, { align: 'center' });
      addSpace(5);

      doc.setFont('times', 'normal');
      doc.text(`RUT: ${data.rut}`, pageWidth / 2, y, { align: 'center' });
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

      console.log('🔵 PDF generado, iniciando descarga...');
      
      // Descargar el PDF
      doc.save(`testamento-${data.nombre}-${data.apellido}.pdf`);
      
      console.log('✅ PDF descargado exitosamente');
      
      if (user) {
        alert('¡Testamento generado y guardado! Puedes verlo en tu dashboard.');
        router.push('/dashboard');
      } else {
        alert('¡Testamento generado exitosamente! Revisa tu carpeta de descargas.\n\n💡 Tip: Regístrate para guardar tus testamentos en la nube.');
      }
      
    } catch (error) {
      console.error('❌ Error completo:', error);
      alert('Hubo un error al generar el testamento. Revisa la consola (F12).');
    } finally {
      setIsGenerating(false);
    }
  };

  const formData = watch();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Crear Mi Testamento
          </h1>
          <p className="text-gray-600">
            Completa la información solicitada para generar tu testamento
          </p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between">
            <StepIndicator number={1} active={step === 1} completed={step > 1} label="Datos Personales" />
            <div className="flex-1 h-1 bg-gray-200 mx-4"></div>
            <StepIndicator number={2} active={step === 2} completed={step > 2} label="Bienes" />
            <div className="flex-1 h-1 bg-gray-200 mx-4"></div>
            <StepIndicator number={3} active={step === 3} completed={step > 3} label="Beneficiarios" />
            <div className="flex-1 h-1 bg-gray-200 mx-4"></div>
            <StepIndicator number={4} active={step === 4} completed={step > 4} label="Revisión" />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white rounded-lg shadow-md p-8">
            
            {/* Step 1: Datos Personales */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <User className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl font-bold">Datos Personales</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      Nombre
                      <Tooltip content="Ingresa tu nombre completo tal como aparece en tu cédula de identidad" />
                    </label>
                    <input {...register('nombre')} type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Juan" />
                    {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      Apellido
                      <Tooltip content="Apellido paterno y materno completos" />
                    </label>
                    <input {...register('apellido')} type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Pérez González" />
                    {errors.apellido && <p className="text-red-500 text-sm mt-1">{errors.apellido.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      RUT
                      <Tooltip content="Formato: 12.345.678-9 (con puntos y guión). Debe ser tu RUT real y vigente." />
                    </label>
                    <input {...register('rut')} type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="12.345.678-9" />
                    {errors.rut && <p className="text-red-500 text-sm mt-1">{errors.rut.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      Fecha de Nacimiento
                      <Tooltip content="Debes ser mayor de 18 años para otorgar un testamento válido" />
                    </label>
                    <input {...register('fechaNacimiento')} type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    {errors.fechaNacimiento && <p className="text-red-500 text-sm mt-1">{errors.fechaNacimiento.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      Estado Civil
                      <Tooltip content="Si estás casado/a, tu cónyuge tiene derecho automático a la mitad de la legítima" />
                    </label>
                    <select {...register('estadoCivil')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">Seleccionar...</option>
                      <option value="soltero">Soltero/a</option>
                      <option value="casado">Casado/a</option>
                      <option value="viudo">Viudo/a</option>
                      <option value="divorciado">Divorciado/a</option>
                    </select>
                    {errors.estadoCivil && <p className="text-red-500 text-sm mt-1">{errors.estadoCivil.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ciudad</label>
                    <input {...register('ciudad')} type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Santiago" />
                    {errors.ciudad && <p className="text-red-500 text-sm mt-1">{errors.ciudad.message}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      Dirección
                      <Tooltip content="Dirección completa de tu domicilio actual (calle, número, departamento, comuna)" />
                    </label>
                    <input {...register('direccion')} type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Av. Libertador 123, Depto 45, Providencia" />
                    {errors.direccion && <p className="text-red-500 text-sm mt-1">{errors.direccion.message}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Bienes */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Home className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl font-bold">Bienes y Patrimonio</h2>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    Describe tus bienes principales
                    <Tooltip content="Lista tus bienes más importantes: propiedades, vehículos, cuentas bancarias, inversiones. No necesitas valores exactos, solo descripción general." />
                  </label>
                  <textarea {...register('bienes')} rows={8} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Ejemplo:&#10;- Casa en Santiago, Av. Providencia 1234&#10;- Departamento en Viña del Mar&#10;- Cuenta de ahorro Banco Estado&#10;- Acciones en empresas&#10;- Vehículo marca Toyota, año 2020" />
                  {errors.bienes && <p className="text-red-500 text-sm mt-1">{errors.bienes.message}</p>}
                  <p className="text-gray-500 text-sm mt-2">
                    💡 No es necesario incluir valores exactos, solo una descripción general
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Beneficiarios */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Users className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl font-bold">Beneficiarios</h2>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-blue-800">
                    <strong>⚖️ Importante:</strong> En Chile, los hijos y el cónyuge son herederos forzosos y tienen derecho 
                    a la "legítima" (al menos 50% de la herencia). El otro 50% puedes distribuirlo libremente.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    ¿Quiénes recibirán tu herencia?
                    <Tooltip content="Incluye nombre completo, RUT y porcentaje o monto. Recuerda que los porcentajes deben sumar 100%. Si tienes hijos o cónyuge, ellos tienen derecho a legítima por ley." />
                  </label>
                  <textarea {...register('beneficiarios')} rows={8} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Ejemplo:&#10;- Mi hijo Juan Pérez López, RUT 12.345.678-9 (50%)&#10;- Mi hija María Pérez López, RUT 98.765.432-1 (50%)&#10;&#10;O también:&#10;- Mi hermano Pedro Pérez, RUT 11.222.333-4 (legado de $5.000.000)" />
                  {errors.beneficiarios && <p className="text-red-500 text-sm mt-1">{errors.beneficiarios.message}</p>}
                  <p className="text-gray-500 text-sm mt-2">
                    💡 Incluye nombre completo, RUT y porcentaje o monto aproximado
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    Instrucciones Especiales (Opcional)
                    <Tooltip content="Aquí puedes agregar condiciones especiales, como 'no vender la casa familiar hasta que mi hijo menor cumpla 18 años' o designar un albacea (ejecutor del testamento)." />
                  </label>
                  <textarea {...register('instruccionesEspeciales')} rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Ej: Deseo que mi casa familiar no sea vendida hasta que mi hijo menor cumpla 18 años" />
                </div>
              </div>
            )}

            {/* Step 4: Revisión */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <FileCheck className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl font-bold">Revisión Final</h2>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Datos Personales</h3>
                    <p className="text-gray-700">{formData.nombre} {formData.apellido} - RUT: {formData.rut}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Bienes</h3>
                    <p className="text-gray-700 whitespace-pre-line">{formData.bienes}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Beneficiarios</h3>
                    <p className="text-gray-700 whitespace-pre-line">{formData.beneficiarios}</p>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Importante:</strong> Este documento debe ser firmado ante notario para tener validez legal.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              {step > 1 && (
                <button type="button" onClick={() => setStep(step - 1)} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">← Anterior</button>
              )}
              
              {step < 4 ? (
                <button type="button" onClick={() => setStep(step + 1)} className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Siguiente →</button>
              ) : (
                <button type="submit" disabled={isGenerating} className="ml-auto px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 flex items-center gap-2">
                  {isGenerating ? 'Generando...' : <><Download className="w-5 h-5" />Generar y Guardar</>}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function StepIndicator({ number, active, completed, label }: { number: number; active: boolean; completed: boolean; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${completed ? 'bg-green-500 text-white' : active ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
        {completed ? '✓' : number}
      </div>
      <span className="text-xs mt-1 text-gray-600">{label}</span>
    </div>
  );
}
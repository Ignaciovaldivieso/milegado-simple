'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FileText, User, Home, Users, FileCheck, Download, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import jsPDF from 'jspdf';
import Tooltip from '../components/Tooltip';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';

// Schema simplificado para el formulario
const testamentoSchema = z.object({
  nombre: z.string().min(2, 'Mínimo 2 caracteres'),
  apellido: z.string().min(2, 'Mínimo 2 caracteres'),
  rut: z.string().min(8, 'RUT inválido'),
  fechaNacimiento: z.string(),
  estadoCivil: z.enum(['soltero', 'casado', 'viudo', 'divorciado']),
  direccion: z.string().min(5, 'Dirección muy corta'),
  ciudad: z.string().min(2, 'Ciudad inválida'),
  bienes: z.string().min(10, 'Describe tus bienes principales'),
  beneficiarios: z.string().min(10, 'Describe quiénes recibirán tu herencia'),
  instruccionesEspeciales: z.string().optional(),
});

type FormData = z.infer<typeof testamentoSchema>;

const steps = [
  { number: 1, title: 'Datos Personales', icon: User, description: 'Tu información básica' },
  { number: 2, title: 'Bienes', icon: Home, description: 'Tu patrimonio' },
  { number: 3, title: 'Beneficiarios', icon: Users, description: 'Quiénes heredarán' },
  { number: 4, title: 'Revisión', icon: FileCheck, description: 'Confirma todo' },
];

export default function FormularioPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  
  useEffect(() => {
    checkUser();
    loadEditData();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const loadEditData = async () => {
    // Obtener ID del testamento a editar desde URL
    const params = new URLSearchParams(window.location.search);
    const editId = params.get('edit');
    
    if (editId) {
      setEditingId(editId);
      setIsLoadingData(true);
      
      try {
        const { data, error } = await supabase
          .from('testamentos')
          .select('*')
          .eq('id', editId)
          .single();

        if (error) throw error;

        if (data) {
          // Pre-llenar el formulario
          setValue('nombre', data.nombre);
          setValue('apellido', data.apellido);
          setValue('rut', data.rut);
          setValue('fechaNacimiento', data.fecha_nacimiento);
          setValue('estadoCivil', data.estado_civil as any);
          setValue('direccion', data.direccion);
          setValue('ciudad', data.ciudad);
          setValue('bienes', data.bienes);
          setValue('beneficiarios', data.beneficiarios);
          setValue('instruccionesEspeciales', data.instrucciones_especiales || '');
        }
      } catch (error) {
        console.error('Error cargando testamento:', error);
        alert('Error al cargar el testamento');
      } finally {
        setIsLoadingData(false);
      }
    }
  };
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(testamentoSchema),
    mode: 'onChange',
  });

  const nextStep = async () => {
    let fieldsToValidate: any[] = [];
    
    if (step === 1) {
      fieldsToValidate = ['nombre', 'apellido', 'rut', 'fechaNacimiento', 'estadoCivil', 'direccion', 'ciudad'];
    } else if (step === 2) {
      fieldsToValidate = ['bienes'];
    } else if (step === 3) {
      fieldsToValidate = ['beneficiarios'];
    }
    
    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onSubmit = async (data: FormData) => {
    console.log('🔵 Iniciando generación de PDF...', data);
    setIsGenerating(true);
    
    try {
      if (user) {
        if (editingId) {
          // ACTUALIZAR testamento existente
          console.log('💾 Actualizando testamento existente...');
          
          const { error } = await supabase
            .from('testamentos')
            .update({
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
              updated_at: new Date().toISOString(),
            })
            .eq('id', editingId);

          if (error) {
            console.error('❌ Error actualizando:', error);
            throw error;
          }

          console.log('✅ Testamento actualizado');
        } else {
          // CREAR nuevo testamento
          console.log('💾 Guardando nuevo testamento...');
          
          const { error } = await supabase
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
            ]);

          if (error) {
            console.error('❌ Error guardando:', error);
            throw error;
          }

          console.log('✅ Testamento guardado');
        }
      }

      console.log('🔵 Generando PDF con jsPDF...');
      
      // Generar el PDF (código completo del PDF aquí - usar el mismo que antes)
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

      addText(`Otorgado por ${data.nombre} ${data.apellido}`, 12, false, 'center');
      addText(`RUT: ${data.rut}`, 11, false, 'center');
      addSpace(15);

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

      const seccionNum = data.instruccionesEspeciales ? 'VI' : 'V';
      addText(`${seccionNum}. DISPOSICIONES GENERALES`, 13, true);
      addSpace(7);

      addText(
        `Declaro que este testamento refleja fielmente mi voluntad y ha sido otorgado en pleno uso de ` +
        `mis facultades mentales, sin presión ni coacción de ninguna naturaleza.`
      );
      addSpace(18);

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
      
      doc.save(`testamento-${data.nombre}-${data.apellido}.pdf`);
      
      console.log('✅ PDF descargado exitosamente');
      
      if (user) {
        if (editingId) {
          alert('¡Testamento actualizado exitosamente! Puedes verlo en tu dashboard.');
        } else {
          alert('¡Testamento generado y guardado! Puedes verlo en tu dashboard.');
        }
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
  const progress = (step / 4) * 100;

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Cargando tu testamento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header con animación */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <FileText className="w-4 h-4" />
            {editingId ? 'Edición de Testamento' : 'Creación de Testamento'}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            {editingId ? 'Editar Mi Testamento' : 'Crear Mi Testamento'}
          </h1>
          <p className="text-gray-600 text-lg">
            {editingId ? 'Actualiza la información que necesites cambiar' : 'Completa la información paso a paso'}
          </p>
        </div>

        {/* Progress Bar Mejorado */}
        <div className="mb-12">
          <div className="relative">
            {/* Barra de fondo */}
            <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 rounded-full"></div>
            {/* Barra de progreso */}
            <div 
              className="absolute top-5 left-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>

            {/* Steps */}
            <div className="relative flex justify-between">
              {steps.map((s) => {
                const Icon = s.icon;
                const isActive = step === s.number;
                const isCompleted = step > s.number;

                return (
                  <div key={s.number} className="flex flex-col items-center">
                    <div 
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isCompleted 
                          ? 'bg-green-500 text-white shadow-lg scale-110' 
                          : isActive 
                          ? 'bg-blue-600 text-white shadow-xl scale-110 ring-4 ring-blue-200' 
                          : 'bg-white text-gray-400 border-2 border-gray-200'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>
                    <div className="mt-3 text-center">
                      <div className={`text-sm font-semibold ${isActive ? 'text-blue-600' : 'text-gray-600'}`}>
                        {s.title}
                      </div>
                      <div className="text-xs text-gray-500 hidden sm:block">
                        {s.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Form Card con animación */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 transition-all duration-300 hover:shadow-2xl">
            
            {/* Step 1: Datos Personales */}
            {step === 1 && (
              <div className="space-y-6 animate-slide-in">
                <div className="flex items-center gap-3 mb-8 pb-4 border-b-2 border-blue-100">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Datos Personales</h2>
                    <p className="text-gray-600">Información básica del testador</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      Nombre
                      <Tooltip content="Ingresa tu nombre completo tal como aparece en tu cédula de identidad" />
                    </label>
                    <input {...register('nombre')} type="text" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" placeholder="Juan" />
                    {errors.nombre && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">⚠️ {errors.nombre.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      Apellido
                      <Tooltip content="Apellido paterno y materno completos" />
                    </label>
                    <input {...register('apellido')} type="text" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" placeholder="Pérez González" />
                    {errors.apellido && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">⚠️ {errors.apellido.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      RUT
                      <Tooltip content="Formato: 12.345.678-9 (con puntos y guión). Debe ser tu RUT real y vigente." />
                    </label>
                    <input {...register('rut')} type="text" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" placeholder="12.345.678-9" />
                    {errors.rut && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">⚠️ {errors.rut.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      Fecha de Nacimiento
                      <Tooltip content="Debes ser mayor de 18 años para otorgar un testamento válido" />
                    </label>
                    <input {...register('fechaNacimiento')} type="date" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
                    {errors.fechaNacimiento && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">⚠️ {errors.fechaNacimiento.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      Estado Civil
                      <Tooltip content="Si estás casado/a, tu cónyuge tiene derecho automático a la mitad de la legítima" />
                    </label>
                    <select {...register('estadoCivil')} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
                      <option value="">Seleccionar...</option>
                      <option value="soltero">Soltero/a</option>
                      <option value="casado">Casado/a</option>
                      <option value="viudo">Viudo/a</option>
                      <option value="divorciado">Divorciado/a</option>
                    </select>
                    {errors.estadoCivil && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">⚠️ {errors.estadoCivil.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Ciudad</label>
                    <input {...register('ciudad')} type="text" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" placeholder="Santiago" />
                    {errors.ciudad && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">⚠️ {errors.ciudad.message}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      Dirección
                      <Tooltip content="Dirección completa de tu domicilio actual (calle, número, departamento, comuna)" />
                    </label>
                    <input {...register('direccion')} type="text" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" placeholder="Av. Libertador 123, Depto 45, Providencia" />
                    {errors.direccion && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">⚠️ {errors.direccion.message}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Bienes */}
            {step === 2 && (
              <div className="space-y-6 animate-slide-in">
                <div className="flex items-center gap-3 mb-8 pb-4 border-b-2 border-green-100">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Home className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Bienes y Patrimonio</h2>
                    <p className="text-gray-600">Describe tus activos principales</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    Describe tus bienes principales
                    <Tooltip content="Lista tus bienes más importantes: propiedades, vehículos, cuentas bancarias, inversiones. No necesitas valores exactos, solo descripción general." />
                  </label>
                  <textarea {...register('bienes')} rows={10} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition font-mono text-sm" placeholder="Ejemplo:&#10;- Casa en Santiago, Av. Providencia 1234&#10;- Departamento en Viña del Mar&#10;- Cuenta de ahorro Banco Estado&#10;- Acciones en empresas&#10;- Vehículo marca Toyota, año 2020" />
                  {errors.bienes && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">⚠️ {errors.bienes.message}</p>}
                  <p className="text-gray-500 text-sm mt-2 flex items-center gap-2">
                    💡 <span>No es necesario incluir valores exactos, solo una descripción general</span>
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Beneficiarios */}
            {step === 3 && (
              <div className="space-y-6 animate-slide-in">
                <div className="flex items-center gap-3 mb-8 pb-4 border-b-2 border-purple-100">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Beneficiarios</h2>
                    <p className="text-gray-600">Quiénes recibirán tu herencia</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xl">⚖️</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-900 mb-1">Importante - Legislación Chilena</p>
                      <p className="text-sm text-blue-800">
                        En Chile, los hijos y el cónyuge son herederos forzosos y tienen derecho 
                        a la "legítima" (al menos 50% de la herencia). El otro 50% puedes distribuirlo libremente.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    ¿Quiénes recibirán tu herencia?
                    <Tooltip content="Incluye nombre completo, RUT y porcentaje o monto. Recuerda que los porcentajes deben sumar 100%. Si tienes hijos o cónyuge, ellos tienen derecho a legítima por ley." />
                  </label>
                  <textarea {...register('beneficiarios')} rows={10} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition font-mono text-sm" placeholder="Ejemplo:&#10;- Mi hijo Juan Pérez López, RUT 12.345.678-9 (50%)&#10;- Mi hija María Pérez López, RUT 98.765.432-1 (50%)&#10;&#10;O también:&#10;- Mi hermano Pedro Pérez, RUT 11.222.333-4 (legado de $5.000.000)" />
                  {errors.beneficiarios && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">⚠️ {errors.beneficiarios.message}</p>}
                  <p className="text-gray-500 text-sm mt-2 flex items-center gap-2">
                    💡 <span>Incluye nombre completo, RUT y porcentaje o monto aproximado</span>
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    Instrucciones Especiales (Opcional)
                    <Tooltip content="Aquí puedes agregar condiciones especiales, como 'no vender la casa familiar hasta que mi hijo menor cumpla 18 años' o designar un albacea (ejecutor del testamento)." />
                  </label>
                  <textarea {...register('instruccionesEspeciales')} rows={5} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition" placeholder="Ej: Deseo que mi casa familiar no sea vendida hasta que mi hijo menor cumpla 18 años" />
                </div>
              </div>
            )}

            {/* Step 4: Revisión */}
            {step === 4 && (
              <div className="space-y-6 animate-slide-in">
                <div className="flex items-center gap-3 mb-8 pb-4 border-b-2 border-orange-100">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <FileCheck className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Revisión Final</h2>
                    <p className="text-gray-600">Verifica que todo esté correcto</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Datos Personales */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200">
                    <h3 className="font-bold text-lg text-blue-900 mb-3 flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Datos Personales
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p className="text-blue-900"><strong>Nombre completo:</strong> {formData.nombre} {formData.apellido}</p>
                      <p className="text-blue-800"><strong>RUT:</strong> {formData.rut}</p>
                      <p className="text-blue-800"><strong>Estado civil:</strong> {formData.estadoCivil}</p>
                      <p className="text-blue-800"><strong>Dirección:</strong> {formData.direccion}, {formData.ciudad}</p>
                    </div>
                  </div>

                  {/* Bienes */}
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-200">
                    <h3 className="font-bold text-lg text-green-900 mb-3 flex items-center gap-2">
                      <Home className="w-5 h-5" />
                      Bienes y Patrimonio
                    </h3>
                    <div className="text-sm text-green-900 whitespace-pre-line bg-white/50 p-4 rounded-lg">
                      {formData.bienes}
                    </div>
                  </div>

                  {/* Beneficiarios */}
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border-2 border-purple-200">
                    <h3 className="font-bold text-lg text-purple-900 mb-3 flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Beneficiarios
                    </h3>
                    <div className="text-sm text-purple-900 whitespace-pre-line bg-white/50 p-4 rounded-lg">
                      {formData.beneficiarios}
                    </div>
                  </div>

                  {/* Instrucciones Especiales */}
                  {formData.instruccionesEspeciales && (
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border-2 border-orange-200">
                      <h3 className="font-bold text-lg text-orange-900 mb-3">Instrucciones Especiales</h3>
                      <div className="text-sm text-orange-900 whitespace-pre-line bg-white/50 p-4 rounded-lg">
                        {formData.instruccionesEspeciales}
                      </div>
                    </div>
                  )}
                </div>

                {/* Advertencia Legal */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-xl p-6">
                  <div className="flex gap-3">
                    <div className="text-3xl">⚠️</div>
                    <div>
                      <p className="font-bold text-yellow-900 mb-2">Importante - Validez Legal</p>
                      <p className="text-sm text-yellow-800">
                        Este documento es un <strong>borrador de testamento</strong>. Para que tenga validez legal en Chile, 
                        debes llevarlo a un <strong>notario público</strong> para firmarlo ante testigos conforme al 
                        artículo 1011 y siguientes del Código Civil.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons Mejorados */}
            <div className="flex justify-between mt-10 pt-8 border-t-2 border-gray-100">
              {step > 1 && (
                <button 
                  type="button" 
                  onClick={prevStep} 
                  className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition font-semibold text-gray-700 hover:border-gray-400"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Anterior
                </button>
              )}
              
              {step < 4 ? (
                <button 
                  type="button" 
                  onClick={nextStep} 
                  className="ml-auto flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Siguiente
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button 
                  type="submit" 
                  disabled={isGenerating} 
                  className="ml-auto flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition font-bold shadow-xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transform text-lg"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {editingId ? 'Actualizando...' : 'Generando...'}
                    </>
                  ) : (
                    <>
                      <Download className="w-6 h-6" />
                      {editingId ? 'Actualizar y Descargar' : 'Generar y Guardar'}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
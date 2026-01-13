// app/page.tsx
import Link from 'next/link';
import { Shield, Heart, BookOpen, CheckCircle2, FileText, Lock, Users, Award, ArrowRight, HelpCircle, Clock, Scale } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Enfoque en Acompañamiento */}
      <section className="relative bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 py-20 overflow-hidden">
        {/* Decoración de fondo */}
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:32px_32px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge de Confianza */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-8 border border-white/20">
              <Shield className="w-4 h-4" />
              Plataforma segura y validada legalmente
            </div>

            {/* Título Principal - Nuevo Enfoque */}
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Tu acompañante digital para{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-400">
                planificar tu legado
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-4 max-w-3xl mx-auto leading-relaxed">
              Te guiamos paso a paso para crear un testamento válido en Chile,
              <strong className="block mt-2 text-white">sin términos complicados, con total claridad y seguridad.</strong>
            </p>

            {/* Propuesta de valor clara */}
            <div className="flex flex-wrap justify-center gap-4 mb-10 text-blue-100 text-sm max-w-2xl mx-auto">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-300" />
                <span>Lenguaje claro y cercano</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-300" />
                <span>Validación legal en cada paso</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-300" />
                <span>100% seguro y privado</span>
              </div>
            </div>

            {/* CTAs menos agresivos */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/que-es-testamento"
                className="group inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/20 transition-all border-2 border-white/30 hover:border-white/50"
              >
                <BookOpen className="w-5 h-5" />
                Primero, ¿qué es un testamento?
              </Link>
              <Link 
                href="/formulario"
                className="group inline-flex items-center gap-3 bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-bold hover:bg-blue-50 transition-all shadow-2xl hover:shadow-white/20 hover:scale-105 transform"
              >
                Comenzar mi testamento
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Por qué es importante - Sección Educativa */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">¿Por qué necesitas un testamento?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              No se trata de edad o riqueza. Se trata de proteger a quienes amas y asegurar que tu voluntad sea respetada.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Razón 1 */}
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Protege a tu familia</h3>
              <p className="text-gray-700 leading-relaxed">
                Evita conflictos entre tus seres queridos y asegura que tu voluntad sea clara para todos.
              </p>
            </div>

            {/* Razón 2 */}
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200">
              <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Scale className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Tú decides</h3>
              <p className="text-gray-700 leading-relaxed">
                Sin testamento, la ley decide por ti. Con testamento, tú eliges cómo distribuir tu patrimonio.
              </p>
            </div>

            {/* Razón 3 */}
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200">
              <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Acelera procesos</h3>
              <p className="text-gray-700 leading-relaxed">
                Un testamento válido reduce el tiempo de tramitación de herencia de 18 meses a 6 meses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cómo funciona - Proceso claro */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Te acompañamos en cada paso</h2>
            <p className="text-xl text-gray-600">Un proceso simple, claro y seguro</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {/* Paso 1 */}
            <div className="flex gap-6 items-start bg-white p-8 rounded-2xl shadow-lg border-l-4 border-blue-600">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Aprende qué es un testamento</h3>
                <p className="text-gray-600 leading-relaxed mb-3">
                  Te explicamos en lenguaje simple qué es un testamento, para qué sirve y qué necesitas saber antes de crear el tuyo.
                </p>
                <div className="inline-flex items-center gap-2 text-blue-600 font-semibold text-sm">
                  <BookOpen className="w-4 h-4" />
                  Incluye guía educativa
                </div>
              </div>
            </div>

            {/* Paso 2 */}
            <div className="flex gap-6 items-start bg-white p-8 rounded-2xl shadow-lg border-l-4 border-green-600">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Completa el formulario guiado</h3>
                <p className="text-gray-600 leading-relaxed mb-3">
                  Respondemos tus dudas en cada campo. Te mostramos ejemplos reales y validamos que todo cumpla con la ley chilena.
                </p>
                <div className="flex flex-wrap gap-3">
                  <div className="inline-flex items-center gap-2 text-green-600 font-semibold text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    Ayudas contextuales
                  </div>
                  <div className="inline-flex items-center gap-2 text-green-600 font-semibold text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    Validación automática
                  </div>
                </div>
              </div>
            </div>

            {/* Paso 3 */}
            <div className="flex gap-6 items-start bg-white p-8 rounded-2xl shadow-lg border-l-4 border-purple-600">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Revisa y descarga tu documento</h3>
                <p className="text-gray-600 leading-relaxed mb-3">
                  Antes de generar el PDF, puedes revisar todo. El documento incluye explicaciones sobre los próximos pasos legales.
                </p>
                <div className="inline-flex items-center gap-2 text-purple-600 font-semibold text-sm">
                  <FileText className="w-4 h-4" />
                  Formato notarial válido
                </div>
              </div>
            </div>

            {/* Paso 4 */}
            <div className="flex gap-6 items-start bg-white p-8 rounded-2xl shadow-lg border-l-4 border-orange-600">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">4</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Firma ante notario (cuando quieras)</h3>
                <p className="text-gray-600 leading-relaxed mb-3">
                  Tu testamento queda guardado en tu cuenta. Puedes descargarlo y firmarlo cuando estés listo, o editarlo si cambia algo.
                </p>
                <div className="flex flex-wrap gap-3">
                  <div className="inline-flex items-center gap-2 text-orange-600 font-semibold text-sm">
                    <Lock className="w-4 h-4" />
                    Guardado seguro
                  </div>
                  <div className="inline-flex items-center gap-2 text-orange-600 font-semibold text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    Editable siempre
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Por qué confiar en MiLegado */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">¿Por qué confiar en MiLegado?</h2>
            <p className="text-xl text-gray-600">Seguridad, claridad y respaldo legal en cada paso</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Confianza 1 */}
            <div className="text-center p-6 rounded-xl hover:bg-gray-50 transition">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Cumple la ley chilena</h3>
              <p className="text-gray-600">Validado por abogados</p>
            </div>

            {/* Confianza 2 */}
            <div className="text-center p-6 rounded-xl hover:bg-gray-50 transition">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Lock className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Datos seguros</h3>
              <p className="text-gray-600">Solo tú accedes a tu información</p>
            </div>

            {/* Confianza 3 */}
            <div className="text-center p-6 rounded-xl hover:bg-gray-50 transition">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Lenguaje cercano</h3>
              <p className="text-gray-600">Sin términos legales complicados. Todo explicado paso a paso</p>
            </div>

            {/* Confianza 4 */}
            <div className="text-center p-6 rounded-xl hover:bg-gray-50 transition">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Award className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Siempre actualizable</h3>
              <p className="text-gray-600">Edita tu testamento cuando quieras.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Preguntas Frecuentes Preview */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">¿Tienes dudas?</h2>
            <p className="text-xl text-gray-600">Es normal. Aquí respondemos las más comunes</p>
          </div>

          <div className="space-y-4">
            <details className="bg-white rounded-xl p-6 shadow-md cursor-pointer group">
              <summary className="font-semibold text-lg text-gray-900 flex items-center gap-3 list-none">
                <HelpCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span>¿Esto reemplaza ir al notario?</span>
              </summary>
              <p className="mt-4 text-gray-600 pl-8">
                No. MiLegado te ayuda a <strong>crear el documento</strong>, pero para que tenga validez legal debes firmarlo ante notario. 
                Te explicamos exactamente cómo hacerlo.
              </p>
            </details>

            <details className="bg-white rounded-xl p-6 shadow-md cursor-pointer group">
              <summary className="font-semibold text-lg text-gray-900 flex items-center gap-3 list-none">
                <HelpCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span>¿Qué pasa si me equivoco?</span>
              </summary>
              <p className="mt-4 text-gray-600 pl-8">
                Puedes <strong>editar tu testamento</strong> todas las veces que quieras antes de firmarlo. 
                Incluso después de firmado, puedes crear una nueva versión actualizada.
              </p>
            </details>

            <details className="bg-white rounded-xl p-6 shadow-md cursor-pointer group">
              <summary className="font-semibold text-lg text-gray-900 flex items-center gap-3 list-none">
                <HelpCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span>¿Es seguro guardar mi testamento aquí?</span>
              </summary>
              <p className="mt-4 text-gray-600 pl-8">
                Sí, <strong>solo tú puedes acceder a tu información.</strong>
                Además, puedes descargarlo y guardarlo donde prefieras.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA Final - Menos agresivo */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Da el primer paso hoy
          </h2>
          <p className="text-xl text-blue-100 mb-10 leading-relaxed">
            Proteger a tu familia no tiene que ser complicado. Te acompañamos en cada paso del camino.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/que-es-testamento"
              className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/20 transition-all border-2 border-white/30"
            >
              <BookOpen className="w-5 h-5" />
              Aprende primero
            </Link>
            <Link 
              href="/formulario"
              className="inline-flex items-center gap-3 bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-bold hover:bg-blue-50 transition-all shadow-2xl"
            >
              Comenzar ahora
              <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
          <p className="text-blue-200 mt-8 text-sm">
            🔒 Seguro • 📖 Educativo • ✏️ Editable • ⚖️ Legal
          </p>
        </div>
      </section>
    </div>
  );
}
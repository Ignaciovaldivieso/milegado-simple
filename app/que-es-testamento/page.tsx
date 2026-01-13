// app/que-es-testamento/page.tsx
import Link from 'next/link';
import { BookOpen, CheckCircle2, AlertCircle, Users, Scale, FileText, Heart, Shield, ArrowRight, HelpCircle, Clock } from 'lucide-react';

export default function QueEsTestamentoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50">
      {/* Hero Educativo */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <Link href="/" className="text-blue-100 hover:text-white transition">
              ← Volver al inicio
            </Link>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            ¿Qué es un testamento?
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            Todo lo que necesitas saber antes de crear el tuyo, explicado en lenguaje simple.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Definición Simple */}
        <section className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border-l-4 border-blue-600">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">En palabras simples</h2>
                <p className="text-xl text-gray-700 leading-relaxed">
                  Un testamento es un <strong>documento legal</strong> donde dejas por escrito cómo quieres que se distribuyan 
                  tus bienes (casa, dinero, auto, etc.) después de tu fallecimiento.
                </p>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-100">
              <p className="text-gray-800 leading-relaxed">
                <strong>Piénsalo así:</strong> Es como escribir una carta donde le dices a tu familia "esto es lo que quiero 
                que pase con mis cosas cuando ya no esté". Esa carta tiene que cumplir ciertas reglas legales para que sea válida.
              </p>
            </div>
          </div>
        </section>

        {/* ¿Para qué sirve? */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">¿Para qué sirve un testamento?</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-green-100">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Tú decides</h3>
              <p className="text-gray-600 leading-relaxed">
                Sin testamento, la ley decide por ti cómo se reparten tus bienes. Con testamento, <strong>tú eliges </strong> 
                quién recibe qué (dentro de ciertos límites legales).
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-blue-100">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Evitas conflictos</h3>
              <p className="text-gray-600 leading-relaxed">
                Las peleas familiares por herencias son muy comunes. Un testamento claro <strong>reduce esos conflictos </strong> 
                porque tu voluntad queda por escrito.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-purple-100">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Acelera el proceso</h3>
              <p className="text-gray-600 leading-relaxed">
                Con testamento, el proceso de herencia puede tomar <strong>6 meses</strong> vs 18 meses sin testamento. 
                Tu familia recibe lo que les corresponde más rápido.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-orange-100">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Protege a quien amas</h3>
              <p className="text-gray-600 leading-relaxed">
                Puedes asegurarte de que personas específicas (pareja, hijos, padres) reciban lo que necesitan. 
                También puedes <strong>dejar a alguien fuera</strong> (dentro de lo legal).
              </p>
            </div>
          </div>
        </section>

        {/* Términos importantes */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Términos legales que debes conocer</h2>
          
          <div className="space-y-4">
            <details className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-100 cursor-pointer group">
              <summary className="font-bold text-lg text-gray-900 flex items-center gap-3 list-none">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <span>Herederos forzosos (o legitimarios)</span>
              </summary>
              <div className="mt-4 pl-11 text-gray-600 leading-relaxed">
                <p className="mb-3">
                  Son las personas que <strong>por ley SIEMPRE tienen derecho</strong> a recibir parte de tu herencia:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Tus hijos</strong> (incluso adoptados)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Tu cónyuge</strong> (si estás casado/a)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Tus padres</strong> (solo si no tienes hijos)</span>
                  </li>
                </ul>
                <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                  <p className="text-sm text-yellow-800">
                    <strong>Importante:</strong> No puedes dejarlos completamente fuera del testamento (salvo casos muy específicos).
                  </p>
                </div>
              </div>
            </details>

            <details className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-100 cursor-pointer">
              <summary className="font-bold text-lg text-gray-900 flex items-center gap-3 list-none">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Scale className="w-5 h-5 text-green-600" />
                </div>
                <span>Legítima, mejoras y cuarta de libre disposición</span>
              </summary>
              <div className="mt-4 pl-11 text-gray-600 leading-relaxed">
                <p className="mb-4">
                  En Chile, tu herencia se divide en 3 partes:
                </p>
                
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-600">
                    <div className="font-bold text-blue-900 mb-2">1. Legítima (50%)</div>
                    <p className="text-sm text-blue-800">
                      <strong>OBLIGATORIO.</strong> Se reparte en partes iguales entre tus herederos forzosos. 
                      No puedes cambiar esto.
                    </p>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-600">
                    <div className="font-bold text-green-900 mb-2">2. Mejoras (25%)</div>
                    <p className="text-sm text-green-800">
                      Puedes dársela a uno o varios de tus herederos forzosos. Por ejemplo, "le doy más a mi hijo menor".
                    </p>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-600">
                    <div className="font-bold text-purple-900 mb-2">3. Cuarta de libre disposición (25%)</div>
                    <p className="text-sm text-purple-800">
                      Aquí sí puedes hacer lo que quieras: dársela a un amigo, una fundación, quien sea.
                    </p>
                  </div>
                </div>

                <div className="mt-4 bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700">
                    <strong>Ejemplo simple:</strong> Si tienes $100 millones, al menos $50M van sí o sí a tus herederos forzosos 
                    en partes iguales. Los otros $50M los puedes distribuir con más libertad.
                  </p>
                </div>
              </div>
            </details>

            <details className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-100 cursor-pointer">
              <summary className="font-bold text-lg text-gray-900 flex items-center gap-3 list-none">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-purple-600" />
                </div>
                <span>Testamento abierto vs cerrado</span>
              </summary>
              <div className="mt-4 pl-11 text-gray-600 leading-relaxed">
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
                    <div className="font-bold text-green-900 mb-2">✓ Testamento Abierto</div>
                    <p className="text-sm text-green-800 mb-3">
                      El que creas con MiLegado. Lo lees tú, el notario y los testigos en el momento de firmarlo.
                    </p>
                    <div className="text-xs text-green-700">
                      <strong>Ventajas:</strong> Más rápido, más económico, menos errores.
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
                    <div className="font-bold text-gray-900 mb-2">Testamento Cerrado</div>
                    <p className="text-sm text-gray-700 mb-3">
                      Lo entregas en sobre sellado. Nadie sabe qué dice hasta tu fallecimiento.
                    </p>
                    <div className="text-xs text-gray-600">
                      <strong>Ventajas:</strong> Más privacidad. <strong>Desventajas:</strong> Más caro y más lento.
                    </div>
                  </div>
                </div>
                <p className="text-sm bg-blue-50 border-l-4 border-blue-600 p-3 rounded">
                  <strong>Recomendación:</strong> El 95% de las personas elige testamento abierto. Es más simple y cumple el mismo propósito.
                </p>
              </div>
            </details>
          </div>
        </section>

        {/* Mitos comunes */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Mitos comunes sobre testamentos</h2>
          
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-red-500">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-red-600 text-2xl">✕</span>
                </div>
                <div>
                  <div className="font-bold text-lg text-gray-900 mb-2">"Los testamentos son solo para gente rica"</div>
                  <p className="text-gray-600">
                    <strong>FALSO.</strong> Si tienes aunque sea una casa, un auto o ahorros, necesitas un testamento. 
                    No importa cuánto valga, importa que sea claro quién lo recibe.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-red-500">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-red-600 text-2xl">✕</span>
                </div>
                <div>
                  <div className="font-bold text-lg text-gray-900 mb-2">"Soy muy joven para hacer testamento"</div>
                  <p className="text-gray-600">
                    <strong>FALSO.</strong> Nadie planea tener un accidente. Si tienes más de 18 años y algo que dejar, 
                    es mejor tener testamento. Lo puedes cambiar cuando quieras.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-red-500">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-red-600 text-2xl">✕</span>
                </div>
                <div>
                  <div className="font-bold text-lg text-gray-900 mb-2">"Si hago testamento online no es válido"</div>
                  <p className="text-gray-600">
                    <strong>FALSO.</strong> El testamento que creas aquí es un <strong>documento válido</strong> que cumple 
                    con el Código Civil chileno. Solo necesitas firmarlo ante notario después de generarlo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ¿Qué necesitas? */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 md:p-12 text-white shadow-xl">
            <h2 className="text-3xl font-bold mb-6">¿Qué necesitas para crear tu testamento?</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold mb-1">Tus datos personales</div>
                  <p className="text-blue-100 text-sm">Nombre, RUT, dirección, estado civil, etc.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold mb-1">Lista de tus bienes</div>
                  <p className="text-blue-100 text-sm">Casa, auto, cuentas bancarias, etc. (sin valores exactos)</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold mb-1">Quiénes son tus herederos</div>
                  <p className="text-blue-100 text-sm">Nombres y RUTs de las personas que recibirán tu herencia</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold mb-1">15 minutos de tu tiempo</div>
                  <p className="text-blue-100 text-sm">Es todo lo que toma completar el proceso</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border-2 border-blue-100">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Heart className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¿Listo para crear tu testamento?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Ahora que entiendes qué es y para qué sirve, te guiaremos paso a paso para crear el tuyo.
            </p>
            <Link 
              href="/formulario"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl text-lg font-bold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Comenzar mi testamento ahora
              <ArrowRight className="w-6 h-6" />
            </Link>
            <p className="text-gray-500 text-sm mt-4">
              Sin compromisos • Guardas tu progreso • Editable siempre
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
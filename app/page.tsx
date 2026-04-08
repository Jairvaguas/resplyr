'use client';

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Star, MessageSquareText, Zap, ShieldCheck, Menu, X, ArrowDown } from "lucide-react";

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-600 selection:text-white flex flex-col">
      
      {/* MEJORA 1: Navbar con efecto blur y menú hamburguesa */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-lg transition-all">
        <div className="max-w-6xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center">
              <Image src="/logo.png" alt="Resplyr Logo" height={40} width={0} sizes="100vw" className="h-8 md:h-10 w-auto object-contain" unoptimized />
            </Link>
            <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
              <Link href="#como-funciona" className="hover:text-slate-900 transition-colors">Cómo funciona</Link>
              <Link href="#beneficios" className="hover:text-slate-900 transition-colors">Beneficios</Link>
              <Link href="#precios" className="hover:text-slate-900 transition-colors">Precios</Link>
            </nav>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <Link href="/sign-in" className="text-sm font-medium text-blue-600 hover:text-blue-700 bg-transparent">
              Iniciar sesión
            </Link>
            <Link href="/sign-up">
              <Button className="bg-blue-600 text-white hover:bg-blue-700 rounded-full px-5">
                Empezar gratis
              </Button>
            </Link>
          </div>
          {/* Botón menú mobile */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Menú mobile expandible */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-4 shadow-lg top-16 absolute w-full left-0 z-40 flex flex-col">
            <Link href="#como-funciona" onClick={() => setIsMobileMenuOpen(false)} className="block text-base font-medium text-slate-700 hover:text-blue-600">Cómo funciona</Link>
            <Link href="#beneficios" onClick={() => setIsMobileMenuOpen(false)} className="block text-base font-medium text-slate-700 hover:text-blue-600">Beneficios</Link>
            <Link href="#precios" onClick={() => setIsMobileMenuOpen(false)} className="block text-base font-medium text-slate-700 hover:text-blue-600">Precios</Link>
            <hr className="border-slate-100" />
            <Link href="/sign-in" onClick={() => setIsMobileMenuOpen(false)} className="block text-base font-medium text-blue-600 hover:text-blue-700">Iniciar sesión</Link>
            <Link href="/sign-up" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
              <Button className="w-full bg-blue-600 text-white hover:bg-blue-700 rounded-full">
                Empezar gratis
              </Button>
            </Link>
          </div>
        )}
      </header>

      <main className="flex-1 mt-16"> {/* Spacer del navbar fixo */}
        {/* BLOQUE 2: Hero */}
        <section className="relative px-4 sm:px-6 pt-12 pb-24 md:pt-24 md:pb-32 max-w-6xl mx-auto text-center bg-gradient-to-b from-white to-blue-50">
          <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 mb-8 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-green-600 mr-2"></span>
            7 días gratis · Sin tarjeta de crédito
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-tight mb-6">
            Responde todas tus reseñas de Google en minutos, <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600">con IA y aprobación humana.</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Conecta tu Google Business Profile, recibe borradores personalizados para cada reseña y publícalos con un clic. Sin abrir Google todos los días.
          </p>
          
          <div className="flex flex-col items-center gap-3">
            <Link href="/sign-up">
              <Button size="lg" className="w-full sm:w-auto text-base h-14 px-8 rounded-full bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-200/50 transition-all hover:scale-[1.02]">
                Responder mis reseñas gratis
              </Button>
            </Link>
            <p className="text-sm text-slate-600 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-green-600" /> Solo lectura. No publicamos nada sin tu aprobación.
            </p>
          </div>

          {/* Animación del Mockup Hero */}
          <div className="mt-16 sm:mt-24 max-w-3xl mx-auto relative perspective-1000">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden text-left ring-1 ring-slate-900/5 transition-transform hover:scale-[1.01] duration-500">
              <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <span className="ml-2 text-xs text-slate-400 font-mono">alerta_reseña_nueva.email</span>
              </div>
              <div className="p-6 sm:p-10 space-y-6 bg-white">
                
                {/* Review original */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-slate-900">Juan Pérez</span>
                    <span className="text-sm text-slate-500">hace 2 horas</span>
                  </div>
                  <div className="flex text-amber-500 mb-3 text-sm">
                    <Star className="w-4 h-4 fill-current"/>
                    <Star className="w-4 h-4 fill-current"/>
                    <Star className="w-4 h-4 text-slate-300"/>
                    <Star className="w-4 h-4 text-slate-300"/>
                    <Star className="w-4 h-4 text-slate-300"/>
                  </div>
                  <p className="text-slate-600 bg-slate-50 p-4 rounded-lg border-l-4 border-slate-300 italic">
                    &quot;El servicio fue muy lento y el pedido llegó frío. Una decepción.&quot;
                  </p>
                </div>

                {/* AI Draft */}
                <div className="relative">
                  <div className="absolute -left-3 top-0 bottom-0 w-1 bg-blue-600 rounded-full"></div>
                  <div className="bg-blue-50 border border-blue-200 p-5 rounded-xl">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-2 py-1 rounded">Borrador IA generado</span>
                      <Zap className="w-3 h-3 text-blue-600" />
                    </div>
                    <p className="text-slate-900 leading-relaxed">
                      Hola Juan, lamentamos mucho tu experiencia. Esto no refleja nuestro estándar de servicio ni la temperatura a la que servimos nuestros platos. Te invitamos a contactarnos directamente al teléfono para compensarte con un postre en tu próxima visita. ¡Esperamos verte pronto y mejorar tu impresión!
                    </p>
                    <div className="mt-5 flex gap-3">
                      <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-700 text-xs px-4">
                        Aprobar y publicar
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs px-4 border-slate-200 text-slate-600">
                        Editar borrador
                      </Button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* MEJORA 2: Sección Social Proof */}
        <section className="bg-slate-50 border-y border-slate-200 py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <p className="text-center text-sm font-semibold uppercase tracking-wider text-slate-500 mb-8">
              La confianza de negocios locales en toda Latinoamérica
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="flex flex-col items-center">
                <span className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500 mb-2">Primeros 100 negocios</span>
                <span className="text-sm font-medium text-slate-500">en beta LATAM</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500 mb-2">&lt; 30 segundos</span>
                <span className="text-sm font-medium text-slate-500">tiempo de respuesta IA</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500 mb-2">Solo lectura</span>
                <span className="text-sm font-medium text-slate-500">nunca modificamos tu perfil</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500 mb-2">7 días</span>
                <span className="text-sm font-medium text-slate-500">de prueba gratis</span>
              </div>
            </div>
          </div>
        </section>

        {/* BLOQUE 3: El problema */}
        <section id="como-funciona" className="bg-blue-50 py-24 sm:py-32 border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-4">¿Cuánto te está costando ignorar tus reseñas?</h2>
              <p className="text-lg text-slate-600">Cada reseña sin respuesta le dice a tu próximo cliente que no te importa. Y a Google también.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-slate-50 p-8 rounded-2xl shadow-sm border border-slate-200">
                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-6">
                  <MessageSquareText className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">Reputación dañada</h3>
                <p className="text-slate-600">Una reseña negativa sin respuesta puede alejar a futuros clientes antes de que te conozcan. El silencio se interpreta como indiferencia.</p>
              </div>
              <div className="bg-slate-50 p-8 rounded-2xl shadow-sm border border-slate-200">
                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-6">
                  <Star className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">Ranking en Google Maps</h3>
                <p className="text-slate-600">Responder reseñas activamente mejora la confianza del cliente y refuerza tu presencia local en Google Maps.</p>
              </div>
              <div className="bg-slate-50 p-8 rounded-2xl shadow-sm border border-slate-200">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">Pérdida de tiempo valioso</h3>
                <p className="text-slate-600">Tienes un negocio que operar. Entrar a Google todos los días y pensar redacciones profesionales no está en tu lista de prioridades.</p>
              </div>
            </div>
          </div>
        </section>

        {/* BLOQUE 4: Cómo funciona */}
        <section className="py-24 sm:py-32 bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-16">Tres pasos. Cinco minutos.</h2>
            
            <div className="grid md:grid-cols-3 gap-12 relative">
              {/* Línea conectora (oculta en mobile) */}
              <div className="hidden md:block absolute top-[20%] left-[15%] right-[15%] h-0.5 bg-slate-200 -z-10"></div>
              
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-600 text-white text-2xl font-bold rounded-full flex items-center justify-center mb-6 border-8 border-white shadow-sm ring-1 ring-slate-200">1</div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">Conecta tu negocio</h3>
                <p className="text-slate-600">Vincula tu Google Business Profile en 2 clics con OAuth oficial de Google. Sin contraseñas, sin riesgos de seguridad.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-600 text-white text-2xl font-bold rounded-full flex items-center justify-center mb-6 border-8 border-white shadow-sm ring-1 ring-slate-200">2</div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">La IA genera la respuesta</h3>
                <p className="text-slate-600">Cada vez que llega una reseña, Resplyr analiza el rating y el contexto, y redacta una respuesta totalmente ajustada al tono de tu negocio.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-600 text-white text-2xl font-bold rounded-full flex items-center justify-center mb-6 border-8 border-white shadow-sm ring-1 ring-slate-200">3</div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">Apruebas con un clic</h3>
                <p className="text-slate-600">Revisa el borrador directamente en el email o panel, edítalo si lo requieres, y publícalo en Google Maps desde Resplyr al instante.</p>
              </div>
            </div>
          </div>
        </section>

        {/* BLOQUE 5: Beneficios */}
        <section id="beneficios" className="py-24 sm:py-32 bg-blue-50 text-slate-900">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-16 text-center text-slate-900">Tu negocio, con mejor reputación.</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
                <CheckCircle2 className="w-8 h-8 text-green-600 mb-5" />
                <h3 className="text-xl font-bold mb-3 text-slate-900">Alertas instantáneas</h3>
                <p className="text-slate-600">Recibe un email en minutos cuando llega una reseña nueva, con el borrador de respuesta ya incluido. Se acabó revisar Google de forma manual.</p>
              </div>
              <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
                <CheckCircle2 className="w-8 h-8 text-green-600 mb-5" />
                <h3 className="text-xl font-bold mb-3 text-slate-900">Respuestas que suenan humanas</h3>
                <p className="text-slate-600">La IA adapta automáticamente el tono según el rating: hiper agradecida en las de 5⭐ y empática/resolutiva en las de 1-2⭐.</p>
              </div>
              <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
                <CheckCircle2 className="w-8 h-8 text-green-600 mb-5" />
                <h3 className="text-xl font-bold mb-3 text-slate-900">Historial completo</h3>
                <p className="text-slate-600">Observa todas tus reseñas, su estado pendiente o publicado y las respuestas hechas en un solo panel consolidado. Sin copiar y pegar.</p>
              </div>
            </div>
          </div>
        </section>

        {/* BLOQUE 6: Para quién es */}
        <section className="py-24 sm:py-32 bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">Diseñado para negocios locales</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 border rounded-2xl hover:shadow-lg transition-shadow bg-slate-50 border-slate-200 text-slate-900">
                <h3 className="text-xl font-bold mb-3 text-slate-900">🍽️ Restaurantes y cafeterías</h3>
                <p className="text-slate-600">Cada reseña negativa sin respuesta aleja futuros comensales. Resplyr te ayuda a recuperar rápido la narrativa y mostrar que la experiencia del cliente te importa.</p>
              </div>
              <div className="p-8 border rounded-2xl hover:shadow-lg transition-shadow bg-slate-50 border-slate-200 text-slate-900">
                <h3 className="text-xl font-bold mb-3 text-slate-900">🩺 Clínicas y consultorios</h3>
                <p className="text-slate-600">Tus pacientes nuevos leen las reseñas antes de agendar. Una respuesta profesional a tiempo puede ser la diferencia entre que elijan tu clínica o la de la competencia.</p>
              </div>
              <div className="p-8 border rounded-2xl hover:shadow-lg transition-shadow bg-slate-50 border-slate-200 text-slate-900">
                <h3 className="text-xl font-bold mb-3 text-slate-900">🔧 Talleres, salones y servicios</h3>
                <p className="text-slate-600">Tu reputación en Maps es tu vitrina principal. Responder reseñas de forma consistente construye una enorme confianza incluso antes de que el cliente te llame.</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: Cómo suena tu marca */}
        <section className="py-24 sm:py-32 bg-slate-50 border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-4">Respuestas que suenan a ti, no a una plantilla</h2>
              <p className="text-lg text-slate-600">La IA adapta el tono según el tipo de negocio y el rating de cada reseña</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">
                <div className="inline-block bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full self-start">🍽️ Restaurante</div>
                <div>
                  <div className="flex text-amber-400 mb-3">
                    <Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/>
                  </div>
                  <p className="text-slate-600 bg-slate-50 p-4 rounded-xl border-l-4 border-slate-300 italic text-sm">
                    &quot;La pizza estaba increíble y el servicio fue muy rápido. ¡Volveremos!&quot;
                  </p>
                </div>
                <div className="flex justify-center text-slate-400">
                  <ArrowDown className="w-6 h-6" />
                </div>
                <div className="bg-blue-50 border border-blue-100 p-5 rounded-xl flex-1 flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-100 px-2 py-0.5 rounded">Resplyr generó esta respuesta</span>
                    <Zap className="w-3 h-3 text-blue-600" />
                  </div>
                  <p className="text-slate-800 text-sm leading-relaxed">
                    &quot;¡Gracias Diego! Nos alegra mucho que hayas disfrutado la experiencia. Te esperamos pronto con más sabor y buena atención 🍕&quot;
                  </p>
                </div>
              </div>
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">
                <div className="inline-block bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full self-start">🩺 Clínica dental</div>
                <div>
                  <div className="flex text-amber-400 mb-3">
                    <Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 text-slate-200"/><Star className="w-4 h-4 text-slate-200"/><Star className="w-4 h-4 text-slate-200"/>
                  </div>
                  <p className="text-slate-600 bg-slate-50 p-4 rounded-xl border-l-4 border-slate-300 italic text-sm">
                    &quot;Esperé 45 minutos y nadie me explicó el procedimiento.&quot;
                  </p>
                </div>
                <div className="flex justify-center text-slate-400">
                  <ArrowDown className="w-6 h-6" />
                </div>
                <div className="bg-blue-50 border border-blue-100 p-5 rounded-xl flex-1 flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-100 px-2 py-0.5 rounded">Resplyr generó esta respuesta</span>
                    <Zap className="w-3 h-3 text-blue-600" />
                  </div>
                  <p className="text-slate-800 text-sm leading-relaxed">
                    &quot;Hola María, lamentamos mucho tu experiencia. Los tiempos de espera y la comunicación son aspectos que tomamos muy en serio. Te invitamos a contactarnos directamente para resolver tu situación.&quot;
                  </p>
                </div>
              </div>
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">
                <div className="inline-block bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full self-start">🔧 Taller mecánico</div>
                <div>
                  <div className="flex text-amber-400 mb-3">
                    <Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 text-slate-200"/>
                  </div>
                  <p className="text-slate-600 bg-slate-50 p-4 rounded-xl border-l-4 border-slate-300 italic text-sm">
                    &quot;Buen trabajo con el carro, aunque el precio fue un poco alto.&quot;
                  </p>
                </div>
                <div className="flex justify-center text-slate-400">
                  <ArrowDown className="w-6 h-6" />
                </div>
                <div className="bg-blue-50 border border-blue-100 p-5 rounded-xl flex-1 flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-100 px-2 py-0.5 rounded">Resplyr generó esta respuesta</span>
                    <Zap className="w-3 h-3 text-blue-600" />
                  </div>
                  <p className="text-slate-800 text-sm leading-relaxed">
                    &quot;Gracias Carlos por confiar en nosotros. Entendemos tu observación sobre el precio y siempre buscamos ser transparentes. ¡Quedamos a tu servicio!&quot;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BLOQUE 7: Precios */}
        <section id="precios" className="py-24 sm:py-32 bg-blue-50 border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-4">Invierte menos de lo que pierdes por ignorar una reseña.</h2>
            </div>
            
            <div className="flex justify-center items-center gap-4 mb-16">
              <span className={`text-sm font-medium ${!isAnnual ? 'text-slate-900' : 'text-slate-500'}`}>Mensual</span>
              <button 
                onClick={() => setIsAnnual(!isAnnual)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isAnnual ? 'bg-blue-600' : 'bg-slate-300'}`}
              >
                <span className={`${isAnnual ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
              </button>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${isAnnual ? 'text-slate-900' : 'text-slate-500'}`}>Anual</span>
                <span className="inline-block bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">Ahorra 15%</span>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              
              {/* PLAN BÁSICO */}
              <div className="bg-slate-50 rounded-3xl shadow-sm border border-slate-200 overflow-hidden relative p-8 flex flex-col h-full">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Plan Starter</h3>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl font-extrabold tracking-tight text-slate-900">${isAnnual ? '16' : '19'}</span>
                  <span className="text-slate-500 font-medium">USD / mes</span>
                </div>
                <p className="text-sm text-slate-600 mb-8 border-b border-slate-200 pb-8">Para negocios con 1 ubicación</p>
                
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-start gap-3 text-slate-600">
                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                    <span>1 ubicación de Google Business incluida</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-600">
                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                    <span>Respuestas ilimitadas con IA</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-600">
                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                    <span>Alertas instantáneas por email</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-600">
                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                    <span>Historial completo de reseñas</span>
                  </li>
                </ul>
                
                <Link href="/sign-up" className="block w-full mt-auto">
                  <Button size="lg" variant="outline" className="w-full text-base h-12 rounded-xl text-blue-600 border-blue-600 hover:bg-blue-50 transition-all">
                    Iniciar prueba gratis
                  </Button>
                </Link>
              </div>

              {/* PLAN PRO */}
              <div className="bg-white rounded-3xl shadow-xl border-2 border-blue-600 overflow-hidden relative p-8 flex flex-col h-full md:-mt-4 md:mb-4">
                <div className="absolute top-0 inset-x-0 h-2 bg-blue-600"></div>
                <div className="inline-block bg-blue-600 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-6 relative self-start">
                  Más popular
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Plan Growth</h3>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl font-extrabold tracking-tight text-slate-900">${isAnnual ? '33' : '39'}</span>
                  <span className="text-slate-500 font-medium">USD / mes</span>
                </div>
                <p className="text-sm text-slate-600 mb-8 border-b border-slate-200 pb-8">Para negocios en expansión</p>
                
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-start gap-3 text-slate-600">
                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                    <span>3 ubicaciones incluidas + adicionales a $15/mes</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-600">
                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                    <span>Todo lo del plan Starter</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-600">
                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                    <span>Auditoría semanal automática</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-600">
                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                    <span>Soporte prioritario</span>
                  </li>
                </ul>
                
                <Link href="/sign-up" className="block w-full mt-auto">
                  <Button size="lg" className="w-full text-base h-12 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all">
                    Iniciar prueba gratis
                  </Button>
                </Link>
              </div>

              {/* PLAN BUSINESS */}
              <div className="bg-slate-50 rounded-3xl shadow-sm border border-slate-200 overflow-hidden relative p-8 flex flex-col h-full">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Plan Multi-ubicación</h3>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl font-extrabold tracking-tight text-slate-900">${isAnnual ? '67' : '79'}</span>
                  <span className="text-slate-500 font-medium">USD / mes</span>
                </div>
                <p className="text-sm text-slate-600 mb-8 border-b border-slate-200 pb-8">Para cadenas y franquicias</p>
                
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-start gap-3 text-slate-600">
                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                    <span>9 ubicaciones incluidas + adicionales a $15/mes</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-600">
                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                    <span>Todo lo del plan Growth</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-600">
                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                    <span>Gestión centralizada multi-sucursal</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-600">
                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                    <span>Dashboard unificado</span>
                  </li>
                </ul>
                
                <Link href="/sign-up" className="block w-full mt-auto">
                  <Button size="lg" variant="outline" className="w-full text-base h-12 rounded-xl text-blue-600 border-blue-600 hover:bg-blue-50 transition-all">
                    Iniciar prueba gratis
                  </Button>
                </Link>
              </div>

            </div>
          </div>
        </section>

        {/* MEJORA 3: Testimonios */}
        <section className="py-24 sm:py-32 bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-16 text-center">
              Lo que dicen nuestros clientes
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Testimonio 1 */}
              <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 flex flex-col justify-between hover:shadow-lg transition-shadow">
                <div>
                  <div className="flex text-amber-400 mb-4">
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                  </div>
                  <p className="text-slate-600 italic mb-8 leading-relaxed">
                    &quot;Antes tardaba horas respondiendo reseñas. Ahora recibo el borrador en el email y lo publico en segundos. Mi calificación subió de 4.1 a 4.6 estrellas en 2 meses.&quot;
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-green-500 text-white flex items-center justify-center font-bold text-lg">
                    MG
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">María G.</h4>
                    <p className="text-xs text-slate-500">Dueña de restaurante · Ciudad de México</p>
                  </div>
                </div>
              </div>

              {/* Testimonio 2 */}
              <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 flex flex-col justify-between hover:shadow-lg transition-shadow">
                <div>
                  <div className="flex text-amber-400 mb-4">
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                  </div>
                  <p className="text-slate-600 italic mb-8 leading-relaxed">
                    &quot;Las alertas de reseñas negativas me salvaron varias veces. Puedo responder en minutos. La IA entiende perfectamente el tono profesional que necesitamos.&quot;
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-green-500 text-white flex items-center justify-center font-bold text-lg">
                    CR
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Carlos R.</h4>
                    <p className="text-xs text-slate-500">Director de clínica dental · Bogotá, Colombia</p>
                  </div>
                </div>
              </div>

              {/* Testimonio 3 */}
              <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 flex flex-col justify-between hover:shadow-lg transition-shadow">
                <div>
                  <div className="flex text-amber-400 mb-4">
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                  </div>
                  <p className="text-slate-600 italic mb-8 leading-relaxed">
                    &quot;Gestionamos 5 sucursales y Resplyr nos ahorra horas cada semana. El precio es muy accesible comparado con otras herramientas que vimos.&quot;
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-green-500 text-white flex items-center justify-center font-bold text-lg">
                    AM
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Ana M.</h4>
                    <p className="text-xs text-slate-500">Gerente de salones · Buenos Aires, Argentina</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BLOQUE 8: Seguridad */}
        <section className="py-24 sm:py-32 bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
            <ShieldCheck className="w-16 h-16 text-blue-600 mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-16">Tu negocio está seguro con nosotros</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
              <div>
                <h3 className="font-bold text-slate-900 mb-2">Solo lectura</h3>
                <p className="text-sm text-slate-600">La conexión es de solo lectura para sincronizar reseñas. La publicación de respuestas requiere tu aprobación explícita.</p>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-2">OAuth oficial de Google</h3>
                <p className="text-sm text-slate-600">Conexión encriptada directa con Google. Nunca vemos ni almacenamos tu contraseña, operamos con tokens temporales y seguros.</p>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-2">Sin entrenar modelos</h3>
                <p className="text-sm text-slate-600">Tus reseñas y datos de negocio jamás se usan para entrenar modelos públicos de Inteligencia Artificial.</p>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-2">Cancelas cuando quieras</h3>
                <p className="text-sm text-slate-600">Cero amarras. Sin contratos de permanencia ni letras pequeñas. Cancelas con 1 clic desde el panel de facturación.</p>
              </div>
            </div>
          </div>
        </section>

        {/* BLOQUE 9: FAQ */}
        <section className="py-24 sm:py-32 bg-blue-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-12 text-center">Preguntas frecuentes</h2>
            <div className="space-y-8">
              <div className="bg-slate-50 p-6 rounded-2xl shadow-sm border border-slate-200">
                <h4 className="font-bold text-lg text-slate-900 mb-2">¿Qué tan buena es la respuesta si la reseña está en inglés o Spanglish?</h4>
                <p className="text-slate-600">Resplyr detecta automáticamente el idioma y responde en el mismo. Si la reseña mezcla idiomas, responde en español.</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl shadow-sm border border-slate-200">
                <h4 className="font-bold text-lg text-slate-900 mb-2">¿Puedo definir el tono por sucursal?</h4>
                <p className="text-slate-600">Sí. Cada ubicación tiene su propio perfil de negocio. Un taller mecánico y una clínica reciben respuestas con tono diferente.</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl shadow-sm border border-slate-200">
                <h4 className="font-bold text-lg text-slate-900 mb-2">¿Qué pasa si llega una reseña injusta o agresiva?</h4>
                <p className="text-slate-600">La IA genera una respuesta profesional y calmada. Tú la revisas, la editas si quieres, y decides si publicarla o no.</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl shadow-sm border border-slate-200">
                <h4 className="font-bold text-lg text-slate-900 mb-2">¿Las respuestas son realmente ilimitadas?</h4>
                <p className="text-slate-600">Sí, sin límite de uso razonable. Puedes responder todas las reseñas que recibas en tus ubicaciones incluidas.</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl shadow-sm border border-slate-200">
                <h4 className="font-bold text-lg text-slate-900 mb-2">¿Qué pasa cuando termina el trial de 7 días?</h4>
                <p className="text-slate-600">Recibes un email de aviso el día anterior. Si no activas tu plan, el dashboard deja de sincronizar reseñas pero tus datos quedan guardados.</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl shadow-sm border border-slate-200">
                <h4 className="font-bold text-lg text-slate-900 mb-2">¿Funciona para cualquier tipo de negocio en Latinoamérica?</h4>
                <p className="text-slate-600">Sí. Cualquier negocio con Google Business Profile puede usar Resplyr: restaurantes, clínicas, talleres, salones, hoteles, tiendas y más.</p>
              </div>
            </div>
          </div>
        </section>

        {/* MEJORA 4: CTA Final oscuro */}
        <section className="py-24 sm:py-32 bg-slate-900 text-center px-4 overflow-hidden relative border-t-4 border-blue-600">
          {/* Decorative glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-blue-600/20 blur-[100px] rounded-full pointer-events-none"></div>

          <div className="max-w-4xl mx-auto relative z-10">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-white leading-tight">
              Respuestas inteligentes que cuidan tu imagen <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
                en minutos.
              </span>
            </h2>
            <p className="text-xl sm:text-2xl text-slate-300 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
              Recupera tu tiempo y mejora tu posicionamiento conectando tu perfil de Google hoy mismo.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Link href="/sign-up">
                <Button size="lg" className="w-full sm:w-auto text-lg h-16 px-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 transition-all font-bold shadow-xl shadow-blue-900/40">
                  Empezar gratis 7 días
                </Button>
              </Link>
              <Link href="#como-funciona">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg h-16 px-10 rounded-full border-white/20 text-white bg-transparent hover:bg-white/10 hover:text-white transition-all font-medium">
                  Ver cómo funciona
                </Button>
              </Link>
            </div>
            <p className="text-sm font-medium text-slate-400 tracking-wide">
              Sin tarjeta de crédito · 7 días gratis · Configuración en 5 minutos
            </p>
          </div>
        </section>
      </main>

      {/* MEJORA 5: Footer completo 4 columnas */}
      <footer className="bg-slate-900 border-t border-slate-800 py-16 pb-8 text-slate-400">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-slate-800 pb-12 mb-8">
            {/* Col 1 */}
            <div className="flex flex-col gap-4 items-start">
              <Image src="/logo2.png" alt="Resplyr Logo" height={48} width={0} sizes="100vw" className="h-10 md:h-12 w-auto object-contain" unoptimized />
              <p className="text-sm leading-relaxed text-slate-400 max-w-xs mt-2">
                La forma más inteligente de gestionar tu reputación en Google. Respuestas con IA adaptadas al tono de tu negocio.
              </p>
            </div>
            {/* Col 2 */}
            <div className="flex flex-col gap-3">
              <h4 className="text-white font-bold mb-2">Producto</h4>
              <Link href="#como-funciona" className="text-sm hover:text-white transition-colors">Características</Link>
              <Link href="#precios" className="text-sm hover:text-white transition-colors">Precios</Link>
              <Link href="/sign-in" className="text-sm hover:text-white transition-colors">Dashboard</Link>
            </div>
            {/* Col 3 */}
            <div className="flex flex-col gap-3">
              <h4 className="text-white font-bold mb-2">Legal</h4>
              <Link href="/privacidad" className="text-sm hover:text-white transition-colors">Política de Privacidad</Link>
              <Link href="/terminos" className="text-sm hover:text-white transition-colors">Términos del Servicio</Link>
            </div>
            {/* Col 4 */}
            <div className="flex flex-col gap-3">
              <h4 className="text-white font-bold mb-2">Contacto</h4>
              <a href="mailto:info@resplyr.com" className="text-sm hover:text-white transition-colors">info@resplyr.com</a>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <div>
              © 2026 Resplyr. Todos los derechos reservados.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

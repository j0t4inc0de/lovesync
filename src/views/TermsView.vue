<template>
  <ion-page>
    <ion-content class="liquid-dark-bg">
      <!-- Background Glow Orbs -->
      <div class="bg-orb w-[360px] h-[360px] bg-[#ff375f]/20 -top-20 -left-20 animate-pulse-glow"></div>
      <div class="bg-orb w-[380px] h-[380px] bg-[#9b51e0]/20 bottom-10 -right-20 animate-pulse-glow" style="animation-delay: 1s;"></div>
      <div class="bg-orb w-[280px] h-[280px] bg-[#ff80bf]/15 top-1/2 left-1/3 animate-pulse-glow" style="animation-delay: 2s;"></div>

      <div class="min-h-screen py-10 px-4 sm:px-6 lg:px-8 relative z-10 max-w-4xl mx-auto">
        <!-- Top Navigation Bar -->
        <header class="flex items-center justify-between mb-8 animate-fade-in">
          <button 
            @click="goBack" 
            class="btn btn-soft px-4 py-2.5 text-sm rounded-xl flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 shadow-md"
          >
            <svg class="w-4 h-4 text-[var(--accent)]" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span>Volver Atrás</span>
          </button>

          <div class="flex items-center gap-2">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#ff375f]/15 text-[#ff375f] border border-[#ff375f]/30">
              <svg class="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
              Cumplimiento Legal y EULA
            </span>
          </div>
        </header>

        <!-- Main Title Card -->
        <section class="glass dark-glass-card p-8 sm:p-10 rounded-[2.5rem] mb-8 border border-white/15 shadow-2xl animate-slide-up">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-6">
            <div>
              <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-[#ff375f] via-[#ff7095] to-[#c77dff] bg-clip-text text-transparent">
                Términos y Condiciones de Uso
              </h1>
              <p class="mt-2 text-sm text-gray-300 font-medium">
                Acuerdo de Licencia de Usuario Final (EULA) — Our Story / LoveSync
              </p>
            </div>
            <div class="text-right sm:text-right text-xs text-gray-400 bg-white/5 py-2 px-3.5 rounded-xl border border-white/10 self-start sm:self-center">
              <span class="block font-semibold text-gray-200">Última actualización</span>
              9 de Julio, 2026
            </div>
          </div>

          <!-- Quick Summary Banner -->
          <div class="bg-gradient-to-r from-[#ff375f]/15 to-[#9b51e0]/15 border border-[#ff375f]/30 rounded-2xl p-5 mb-8 text-sm text-gray-200 leading-relaxed flex gap-4 items-start">
            <div class="w-10 h-10 rounded-xl bg-[#ff375f]/20 flex items-center justify-center shrink-0 mt-0.5 text-[#ff375f] border border-[#ff375f]/40">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 class="font-bold text-white text-base mb-1">Resumen del Escudo Legal y Compromiso de Seguridad</h3>
              <p>
                Al utilizar Our Story / LoveSync, aceptas nuestro pacto mutuo de respeto, las directrices obligatorias de seguridad de Apple y Google frente a contenido generado por usuarios (UGC), las normativas del SERNAC de Chile sobre bienes digitales, y el protocolo de desvinculación de parejas (`unpair`).
              </p>
            </div>
          </div>

          <!-- Section 1: Exención de Responsabilidad -->
          <article class="legal-section mb-8">
            <div class="flex items-center gap-3 mb-3.5">
              <div class="w-8 h-8 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold text-sm border border-pink-500/30">1</div>
              <h2 class="text-xl font-bold text-white tracking-wide">Aceptación y Exención de Responsabilidad</h2>
            </div>
            <div class="pl-11 space-y-3 text-gray-300 text-sm sm:text-base leading-relaxed">
              <p>
                La plataforma móvil y servicio web <strong>Our Story / LoveSync</strong> se licencia y proporciona "tal cual" (*as is*) y "según disponibilidad", con el objetivo exclusivo de facilitar la sincronización privada de recuerdos, notas emocionales e hitos entre dos dispositivos móviles emparejados bajo un identificador único (`couple_id`).
              </p>
              <p>
                <strong class="text-white">Exención de garantías técnicas:</strong> No garantizamos que el servicio opere de manera ininterrumpida, libre de errores o exenta de latencias derivadas del estado de la red Wi-Fi/celular del usuario, fallos eléctricos de terceros o restricciones de ahorro de energía del sistema operativo. En la máxima medida autorizada por la ley aplicable —incluyendo la Ley N° 19.496 de Chile—, los titulares y desarrolladores de Our Story / LoveSync no asumirán responsabilidad civil o patrimonial por interrupciones temporales, pérdida accidental de borradores no sincronizados en la nube o fluctuaciones en la velocidad de emparejamiento.
              </p>
            </div>
          </article>

          <!-- Section 2: Reglas Estrictas UGC (Apple & Google Play) -->
          <article class="legal-section mb-8 bg-[#ff375f]/10 p-6 rounded-2xl border border-[#ff375f]/30">
            <div class="flex items-center gap-3 mb-3.5">
              <div class="w-8 h-8 rounded-lg bg-[#ff375f] text-white flex items-center justify-center font-bold text-sm shadow-md shadow-pink-500/40">2</div>
              <h2 class="text-xl font-bold text-white tracking-wide flex items-center gap-2">
                <span>Normas Estrictas de Conducta (UGC)</span>
                <span class="text-[11px] font-semibold bg-red-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">Cero Tolerancia</span>
              </h2>
            </div>
            <div class="pl-11 space-y-3.5 text-gray-200 text-sm sm:text-base leading-relaxed">
              <p>
                En cumplimiento imperativo de las directrices de seguridad de <strong>Apple App Store</strong> y <strong>Google Play Store</strong> aplicables a aplicaciones con Contenido Generado por el Usuario (UGC), Our Story / LoveSync impone reglas inflexibles para proteger la integridad y dignidad en la bitácora compartida:
              </p>
              <ul class="list-disc pl-5 space-y-2 text-gray-300">
                <li><strong class="text-white">Prohibición de Acoso y Violencia Digital:</strong> Queda estrictamente prohibido utilizar notas, descripciones o imágenes para ejercer intimidación, acoso psicológico, hostigamiento, discursos de odio o amenazas contra la pareja (`couple_id`) o terceros.</li>
                <li><strong class="text-white">Material Explícito e Inapropiado:</strong> Cero tolerancia a la carga de pornografía, desnudez no consensuada (*revenge porn*), material violento o promoción de autolesiones.</li>
                <li><strong class="text-white">Suspensión Inmediata y Definitiva:</strong> Nos reservamos el derecho unilateral e irrenunciable de <strong>bloquear, suspender o cancelar de forma inmediata y sin previo aviso</strong> la cuenta y el acceso a la nube de cualquier usuario que infrinja estas normas de conducta.</li>
                <li><strong class="text-white">Sin Derecho a Reembolso:</strong> La rescisión o expulsión de un usuario por incumplimiento de la política UGC no otorgará derecho alguno a devolución o compensación económica por suscripciones premium o compras integradas.</li>
              </ul>
            </div>
          </article>

          <!-- Section 3: Política de Bienes Digitales y No Reembolso (SERNAC) -->
          <article class="legal-section mb-8">
            <div class="flex items-center gap-3 mb-3.5">
              <div class="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-sm border border-purple-500/30">3</div>
              <h2 class="text-xl font-bold text-white tracking-wide">Bienes Digitales y Política de No Reembolso (SERNAC)</h2>
            </div>
            <div class="pl-11 space-y-3 text-gray-300 text-sm sm:text-base leading-relaxed">
              <p>
                De acuerdo con la legislación de protección de los derechos de los consumidores de Chile (<strong class="text-white">Ley N° 19.496, Artículo 3 bis, modificado por Ley N° 21.398</strong> y normativas aplicables al comercio de contenido digital):
              </p>
              <p>
                El acceso a suscripciones premium, almacenamiento ampliado de bitácora o características de pago adicionales en Our Story / LoveSync califica como el suministro de <strong class="text-white">servicios digitales suministrados por medios electrónicos con ejecución inmediata</strong>. Al activar la compra o suscripción mediante confirmación expresa en la aplicación o tiendas oficiales, el usuario reconoce y consiente que la ejecución del servicio comienza en ese acto y que, por consiguiente, <strong class="text-white text-pink-400 font-semibold">pierde su derecho de retracto</strong>.
              </p>
              <p>
                Salvo en casos de indisponibilidad técnica prolongada atribuible directamente a una falla crítica en los servidores centrales que impida por completo el uso de la funcionalidad premium —en cuyo caso aplicarán las garantías proporcionales de la ley chilena—, todas las compras de suscripciones de pago se consideran definitivas, no procediendo devoluciones ni reembolsos por periodos no utilizados tras la cancelación o por decisión unilateral del usuario.
              </p>
            </div>
          </article>

          <!-- Section 4: Normas y Efectos sobre Desvinculación (unpair) -->
          <article class="legal-section mb-6">
            <div class="flex items-center gap-3 mb-3.5">
              <div class="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm border border-indigo-500/30">4</div>
              <h2 class="text-xl font-bold text-white tracking-wide">Desvinculación de Parejas (`unpair`) y Efectos</h2>
            </div>
            <div class="pl-11 space-y-3 text-gray-300 text-sm sm:text-base leading-relaxed">
              <p>
                El emparejamiento entre dos dispositivos en Our Story / LoveSync se sustenta en el consentimiento mutuo. Cualquiera de las partes (`couple_id`) tiene el derecho y la libertad de ejercer la <strong class="text-white">Desvinculación Autónoma (`unpair`)</strong> desde la configuración de perfil en cualquier momento, produciendo los siguientes efectos inmediatos:
              </p>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-xs sm:text-sm">
                <div class="bg-white/5 p-4 rounded-xl border border-white/10">
                  <h4 class="font-bold text-white mb-1.5 flex items-center gap-1.5">
                    <svg class="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" /></svg>
                    Ruptura Inmediata del Enlace
                  </h4>
                  <p class="text-gray-300">
                    Se desasocia de inmediato el token de pareja (`couple_id`), cesando la sincronización cruzada en tiempo real de nuevas fotografías y notas entre ambos teléfonos.
                  </p>
                </div>
                <div class="bg-white/5 p-4 rounded-xl border border-white/10">
                  <h4 class="font-bold text-white mb-1.5 flex items-center gap-1.5">
                    <svg class="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    Resguardo e Historial
                  </h4>
                  <p class="text-gray-300">
                    El usuario desvinculado podrá gestionar o purgar su copia y datos compartidos según nuestra Política de Privacidad, resguardando la intimidad de ambos.
                  </p>
                </div>
              </div>
            </div>
          </article>

          <!-- Bottom Action Section -->
          <div class="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="text-xs text-gray-400 text-center sm:text-left">
              ¿Tienes dudas o necesitas asistencia legal o técnica?<br />
              <span class="text-white font-medium">Soporte oficial:</span> soporte@ourstoryapp.cl
            </div>
            <div class="flex items-center gap-3 w-full sm:w-auto">
              <router-link to="/privacy" class="btn btn-ghost px-5 py-3 text-sm rounded-xl font-semibold text-gray-200 border border-white/20 hover:bg-white/10 text-center flex-1 sm:flex-none">
                Ver Política de Privacidad
              </router-link>
              <button @click="goBack" class="btn btn-soft px-6 py-3 text-sm rounded-xl font-bold active:scale-95 transition-transform flex-1 sm:flex-none text-center">
                Aceptar y Volver
              </button>
            </div>
          </div>
        </section>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { IonPage, IonContent } from '@ionic/vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const goBack = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push('/login');
  }
};
</script>

<style scoped>
/* Dark Liquid Glass Palette for TermsView */
.liquid-dark-bg {
  --background: #0f111a;
  background-color: #0f111a;
  color: #e5e7eb;
}

.dark-glass-card {
  background: rgba(24, 26, 42, 0.78) !important;
  backdrop-filter: blur(36px) saturate(190%) !important;
  -webkit-backdrop-filter: blur(36px) saturate(190%) !important;
  border: 1px solid rgba(255, 255, 255, 0.16) !important;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.45),
              0 2px 6px rgba(255, 55, 95, 0.08) !important;
}

.bg-orb {
  position: absolute;
  border-radius: 9999px;
  pointer-events: none;
  filter: blur(130px);
  opacity: 0.6;
}

.btn-soft {
  background: rgba(255, 55, 95, 0.15);
  color: #ff375f;
  border: 1px solid rgba(255, 55, 95, 0.35);
}
.btn-soft:hover {
  background: rgba(255, 55, 95, 0.25);
  border-color: rgba(255, 55, 95, 0.5);
}

.btn-ghost {
  background: rgba(255, 255, 255, 0.06);
  color: #f3f4f6;
  border: 1px solid rgba(255, 255, 255, 0.15);
}
.btn-ghost:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.25);
}
</style>

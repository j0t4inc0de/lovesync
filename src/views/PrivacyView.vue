<template>
  <ion-page>
    <ion-content class="liquid-dark-bg">
      <!-- Background Glow Orbs -->
      <div class="bg-orb w-[380px] h-[380px] bg-[#9b51e0]/20 -top-20 -left-20 animate-pulse-glow"></div>
      <div class="bg-orb w-[360px] h-[360px] bg-[#ff375f]/20 bottom-10 -right-20 animate-pulse-glow" style="animation-delay: 1.2s;"></div>
      <div class="bg-orb w-[280px] h-[280px] bg-[#c77dff]/15 top-1/2 right-1/4 animate-pulse-glow" style="animation-delay: 2.4s;"></div>

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
            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#9b51e0]/20 text-[#d896ff] border border-[#9b51e0]/40">
              <svg class="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/></svg>
              Privacidad y Ley N° 19.628
            </span>
          </div>
        </header>

        <!-- Main Title Card -->
        <section class="glass dark-glass-card p-8 sm:p-10 rounded-[2.5rem] mb-8 border border-white/15 shadow-2xl animate-slide-up">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-6">
            <div>
              <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-[#d896ff] via-[#ff7095] to-[#ff375f] bg-clip-text text-transparent">
                Política de Privacidad
              </h1>
              <p class="mt-2 text-sm text-gray-300 font-medium">
                Tratamiento de Datos Personales — Our Story / LoveSync
              </p>
            </div>
            <div class="text-right sm:text-right text-xs text-gray-400 bg-white/5 py-2 px-3.5 rounded-xl border border-white/10 self-start sm:self-center">
              <span class="block font-semibold text-gray-200">Última actualización</span>
              9 de Julio, 2026
            </div>
          </div>

          <!-- Highlight Banner: Cloudflare R2 Explicit Clause -->
          <div class="bg-gradient-to-r from-[#9b51e0]/25 via-[#ff375f]/20 to-[#9b51e0]/25 border border-[#c77dff]/40 rounded-2xl p-6 mb-8 text-sm sm:text-base text-gray-100 leading-relaxed shadow-lg relative overflow-hidden">
            <div class="absolute -right-6 -bottom-6 w-32 h-32 bg-[#ff375f]/10 rounded-full blur-2xl pointer-events-none"></div>
            <div class="flex gap-4 items-start relative z-10">
              <div class="w-10 h-10 rounded-xl bg-[#c77dff]/25 flex items-center justify-center shrink-0 mt-0.5 text-[#e0aaff] border border-[#c77dff]/50 shadow-inner">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <div>
                <h3 class="font-extrabold text-white text-base sm:text-lg mb-2 flex items-center gap-2">
                  <span>Almacenamiento Seguro en la Nube con Cloudflare R2</span>
                </h3>
                <blockquote class="italic text-gray-100 font-medium border-l-2 border-[#ff375f] pl-3.5 my-2">
                  "Las fotografías e imágenes de la bitácora se transmiten cifradas y se almacenan en Cloudflare R2 exclusivamente para sincronización entre los teléfonos de la pareja <code>couple_id</code> sin ser vendidas ni cedidas a terceros para entrenamiento de inteligencia artificial, publicidad ni ningún otro fin comercial."
                </blockquote>
                <p class="text-xs text-gray-300 mt-2">
                  Implementamos cifrado en tránsito <strong>TLS 1.3 / HTTPS</strong> y cifrado en reposo <strong>AES-256</strong> con estricto aislamiento de compartimentos por identificador único de pareja (`couple_id`).
                </p>
              </div>
            </div>
          </div>

          <!-- Section 1: Datos Personales Mínimos -->
          <article class="legal-section mb-8">
            <div class="flex items-center gap-3 mb-3.5">
              <div class="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-sm border border-purple-500/30">1</div>
              <h2 class="text-xl font-bold text-white tracking-wide">Datos Personales Mínimos Recolectados</h2>
            </div>
            <div class="pl-11 space-y-3 text-gray-300 text-sm sm:text-base leading-relaxed">
              <p>
                Bajo el principio de <strong class="text-white">minimización de datos</strong> y en total concordancia con la <strong>Ley N° 19.628 de Protección de la Vida Privada de Chile</strong>, únicamente requerimos y procesamos la información indispensable para operar la sincronización y la cuenta:
              </p>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 text-xs sm:text-sm">
                <div class="bg-white/5 p-3.5 rounded-xl border border-white/10">
                  <span class="text-white font-bold block mb-1">Identificación Básica</span>
                  Correo electrónico y nombre o apodo (`name`) para la autenticación en sesión.
                </div>
                <div class="bg-white/5 p-3.5 rounded-xl border border-white/10">
                  <span class="text-white font-bold block mb-1">Emparejamiento (`couple_id`)</span>
                  Tokens técnicos de usuario y de pareja para conectar únicamente los dos teléfonos móviles vinculados.
                </div>
              </div>
              <p class="text-xs text-gray-400 pt-1">
                * No accedemos a tu lista general de contactos del teléfono, geolocalización en segundo plano ni historiales de navegación web externa.
              </p>
            </div>
          </article>

          <!-- Section 2: Procesamiento Seguro de Pagos -->
          <article class="legal-section mb-8">
            <div class="flex items-center gap-3 mb-3.5">
              <div class="w-8 h-8 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold text-sm border border-pink-500/30">2</div>
              <h2 class="text-xl font-bold text-white tracking-wide">Procesamiento Seguro de Pagos (Sin Almacenamiento Bancario)</h2>
            </div>
            <div class="pl-11 space-y-3 text-gray-300 text-sm sm:text-base leading-relaxed">
              <p>
                La seguridad financiera de nuestros usuarios es una prioridad absoluta. Our Story / LoveSync opera con separación total de responsabilidades criptográficas:
              </p>
              <p>
                <strong class="text-white">Cero Almacenamiento Bancario:</strong> Nuestra aplicación y servidores de backend <strong class="text-pink-400 font-semibold">nunca recopilan, procesan ni almacenan números de tarjetas de crédito o débito, códigos CVV ni credenciales bancarias personales</strong>.
              </p>
              <p>
                Toda compra, suscripción o transacción monetaria es procesada de manera externa y segura por pasarelas certificadas bajo el estándar global <strong>PCI-DSS Nivel 1</strong>, incluyendo <strong>MercadoPago</strong>, <strong>Transbank (Webpay Plus)</strong>, y gestores de facturación como <strong>RevenueCat</strong> (así como los sistemas nativos de Apple App Store y Google Play Store). Nuestra infraestructura únicamente recibe un comprobante digital o token transaccional anónimo para activar el beneficio en tu `couple_id`.
              </p>
            </div>
          </article>

          <!-- Section 3: Derecho al Olvido y Borrado de Cuenta -->
          <article class="legal-section mb-6 bg-white/[0.03] p-6 rounded-2xl border border-white/10">
            <div class="flex items-center gap-3 mb-3.5">
              <div class="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-sm border border-red-500/30">3</div>
              <h2 class="text-xl font-bold text-white tracking-wide flex items-center gap-2">
                <span>Derecho al Olvido y Borrado de Cuenta</span>
                <span class="text-[11px] font-semibold bg-purple-600/60 text-purple-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">Control Total</span>
              </h2>
            </div>
            <div class="pl-11 space-y-3.5 text-gray-300 text-sm sm:text-base leading-relaxed">
              <p>
                En estricto acatamiento de la <strong>Ley N° 19.628 (Chile)</strong> y del requisito de eliminación de cuenta de Apple App Store y Google Play Store (*Account Deletion Requirement*), garantizamos tu soberanía y control de purga:
              </p>
              <ul class="list-disc pl-5 space-y-2 text-gray-300">
                <li><strong class="text-white">Acción Autónoma desde la App:</strong> Puedes solicitar y ejecutar en cualquier momento la eliminación definitiva de tu cuenta y datos personales directamente desde el menú de perfil/configuración de la aplicación móvil, o vía correo electrónico.</li>
                <li><strong class="text-white">Purga de Fotografías en Cloudflare R2:</strong> Al confirmar la eliminación de la cuenta o tras desvincular un historial (`couple_id`), nuestro sistema elimina físicamente las fotos e imágenes alojadas en los buckets de Cloudflare R2 dentro de un plazo máximo no superior a <strong>14 días corridos</strong>, sin copias ocultas ni retención residual.</li>
                <li><strong class="text-white">Eliminación de Registro de Base de Datos:</strong> Los identificadores asociados al usuario y al emparejamiento son purgados de los servidores de producción para garantizar tu pleno <strong>Derecho al Olvido</strong>.</li>
              </ul>
            </div>
          </article>

          <!-- Bottom Action Section -->
          <div class="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="text-xs text-gray-400 text-center sm:text-left">
              Para consultas de privacidad o ejercicio de derechos ARCO:<br />
              <span class="text-white font-medium">Contacto oficial:</span> privacidad@ourstoryapp.cl
            </div>
            <div class="flex items-center gap-3 w-full sm:w-auto">
              <router-link to="/terms" class="btn btn-ghost px-5 py-3 text-sm rounded-xl font-semibold text-gray-200 border border-white/20 hover:bg-white/10 text-center flex-1 sm:flex-none">
                Ver Términos y Condiciones
              </router-link>
              <button @click="goBack" class="btn btn-soft px-6 py-3 text-sm rounded-xl font-bold active:scale-95 transition-transform flex-1 sm:flex-none text-center">
                Volver Atrás
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
/* Dark Liquid Glass Palette for PrivacyView */
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
              0 2px 6px rgba(155, 81, 224, 0.08) !important;
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

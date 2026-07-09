<template>
  <ion-page>
    <ion-content class="liquid-bg">
      <div class="min-h-screen py-10 px-4 sm:px-6 lg:px-8 relative z-10 max-w-4xl mx-auto text-white">
        <!-- Top Navigation -->
        <header class="flex items-center justify-between mb-8">
          <button 
            @click="goBack" 
            class="btn-soft px-4 py-2.5 text-sm rounded-xl flex items-center gap-2 transition-all active:scale-95 shadow-sm"
          >
            <svg class="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span>Volver Atrás</span>
          </button>

          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
            🔒 Confianza y Resguardo
          </span>
        </header>

        <!-- Main Title Card -->
        <section class="glass p-8 sm:p-10 rounded-[2.5rem] mb-8 border border-white/15 shadow-2xl relative overflow-hidden" style="background: linear-gradient(135deg, rgba(26, 26, 46, 0.85) 0%, rgba(30, 20, 40, 0.92) 100%);">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-6">
            <div>
              <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-white" style="font-family: 'Comfortaa', sans-serif;">
                Política de Privacidad
              </h1>
              <p class="mt-2 text-sm text-purple-200/80 font-medium">
                Cuidado de Datos, Recuerdos en Nube y Conexión — Our Story / LoveSync
              </p>
            </div>
            <div class="text-right text-xs text-white/60 bg-white/5 py-2 px-3.5 rounded-xl border border-white/10 self-start sm:self-center">
              <span class="block font-semibold text-white">Última actualización</span>
              9 de Julio, 2026
            </div>
          </div>

          <!-- R2 Cloudflare Friendly Highlight -->
          <div class="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-6 mb-8 text-sm sm:text-base text-white/90 leading-relaxed shadow-lg">
            <div class="flex gap-4 items-start">
              <div class="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0 mt-0.5 text-purple-300">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <div>
                <h3 class="font-extrabold text-white text-base sm:text-lg mb-2">
                  Almacenamiento en Nube con Cloudflare R2
                </h3>
                <p class="italic text-white/85 font-medium border-l-2 border-purple-400 pl-3.5 my-2">
                  "Las fotografías e imágenes de la bitácora se transmiten cifradas y se almacenan en servidores seguros de la nube en Cloudflare R2 con el único objetivo de permitir la sincronización instantánea y privada entre los teléfonos de ambos miembros de la pareja (`couple_id`). Jamás se venden, comparten ni analizan con fines publicitarios."
                </p>
                <p class="text-xs text-white/65 mt-2">
                  Usamos cifrado moderno de grado industrial (TLS 1.3 en tránsito y AES-256 en reposo). Solo los dos teléfonos autorizados en tu enlace de pareja tienen acceso a tu álbum fotográfico.
                </p>
              </div>
            </div>
          </div>

          <!-- 1. Datos que Recopilamos -->
          <article class="mb-8">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-8 h-8 rounded-lg bg-purple-500 text-white flex items-center justify-center font-bold text-sm shadow-md">1</div>
              <h2 class="text-xl font-bold text-white tracking-wide">Datos Mínimos que Cuidamos</h2>
            </div>
            <div class="pl-11 space-y-3 text-white/80 text-sm sm:text-base leading-relaxed">
              <p>
                Para brindarte la experiencia de sincronización con tu persona especial, solo recolectamos lo estrictamente indispensable:
              </p>
              <ul class="list-disc pl-5 space-y-2 text-white/75">
                <li><strong class="text-white">Información de Perfil:</strong> Correo electrónico, nombre de pila y foto opcional del perfil.</li>
                <li><strong class="text-white">Identificador de Pareja (`couple_id`):</strong> El código criptográfico que vincula en tiempo real tu dispositivo con el de tu pareja.</li>
                <li><strong class="text-white">Contenido de la Bitácora:</strong> Las fechas, títulos, descripciones y fotos de sus citas para presentarlos en la línea de tiempo.</li>
              </ul>
            </div>
          </article>

          <!-- 2. Pagos de Terceros -->
          <article class="mb-8">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-8 h-8 rounded-lg bg-pink-500 text-white flex items-center justify-center font-bold text-sm shadow-md">2</div>
              <h2 class="text-xl font-bold text-white tracking-wide">Seguridad Bancaria y Pasarelas (MercadoPago)</h2>
            </div>
            <div class="pl-11 space-y-3 text-white/80 text-sm sm:text-base leading-relaxed">
              <p>
                Todas las compras de paquetes de cupos en nuestra tienda son procesadas externamente por pasarelas especializadas de alta seguridad certificada (como <strong>MercadoPago / Transbank</strong> o tiendas oficiales de Apple/Google). LoveSync <strong>jamás recibe, recopila ni almacena los números de tus tarjetas de crédito, débito o Cuenta RUT</strong> en nuestros servidores. Solo recibimos un aviso seguro de que tu pago fue aprobado para sumar tus cupos al instante.
              </p>
            </div>
          </article>

          <!-- 3. Derecho al Olvido y Borrado -->
          <article class="mb-4">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-md">3</div>
              <h2 class="text-xl font-bold text-white tracking-wide">Tu Derecho al Olvido (Ley N° 19.628 de Chile)</h2>
            </div>
            <div class="pl-11 space-y-3 text-white/80 text-sm sm:text-base leading-relaxed">
              <p>
                Eres el único dueño de tus recuerdos. En cumplimiento con la legislación chilena y las exigencias globales de Apple y Google, cuentas con el control total para solicitar o ejecutar la purga y borrado absoluto de tu cuenta desde la sección de Ajustes en la app. Al confirmar la eliminación, todos los registros en base de datos y los archivos en Cloudflare R2 son destruidos de manera permanente sin posibilidad de recuperación.
              </p>
            </div>
          </article>
        </section>

        <!-- Footer -->
        <footer class="text-center text-xs text-white/40 pb-6">
          <p>© 2026 Our Story / LoveSync. Hecho con amor para conectar parejas.</p>
        </footer>
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
.liquid-bg {
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

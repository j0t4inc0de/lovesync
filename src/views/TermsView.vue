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
            <svg class="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span>Volver Atrás</span>
          </button>

          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-pink-500/15 text-pink-300 border border-pink-500/30">
            💖 Compromiso y Armonía
          </span>
        </header>

        <!-- Main Title Card -->
        <section class="glass p-8 sm:p-10 rounded-[2.5rem] mb-8 border border-white/15 shadow-2xl relative overflow-hidden" style="background: linear-gradient(135deg, rgba(26, 26, 46, 0.85) 0%, rgba(30, 20, 40, 0.92) 100%);">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-6">
            <div>
              <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-white" style="font-family: 'Comfortaa', sans-serif;">
                Términos y Condiciones
              </h1>
              <p class="mt-2 text-sm text-pink-200/80 font-medium">
                Pacto de Conexión, Convivencia y Tienda — Our Story / LoveSync
              </p>
            </div>
            <div class="text-right text-xs text-white/60 bg-white/5 py-2 px-3.5 rounded-xl border border-white/10 self-start sm:self-center">
              <span class="block font-semibold text-white">Última actualización</span>
              9 de Julio, 2026
            </div>
          </div>

          <div class="bg-pink-500/10 border border-pink-500/20 rounded-2xl p-5 mb-8 text-sm text-white/90 leading-relaxed flex gap-4 items-start">
            <div class="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center shrink-0 mt-0.5 text-pink-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <h3 class="font-bold text-white text-base mb-1">Un Espacio Seguro para el Amor</h3>
              <p>
                Our Story / LoveSync está diseñado para ser un refugio íntimo entre tú y tu pareja. Al utilizar nuestra bitácora y tienda, aceptas cuidar este espacio con respeto mutuo, cumpliendo con la legislación chilena (SERNAC / Ley N° 19.628) y las normas globales de Apple y Google.
              </p>
            </div>
          </div>

          <!-- 1. Respeto y Cuidado de Contenidos (UGC) -->
          <article class="mb-8">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-8 h-8 rounded-lg bg-pink-500 text-white flex items-center justify-center font-bold text-sm shadow-md">1</div>
              <h2 class="text-xl font-bold text-white tracking-wide">Armonía en Nuestra Comunidad (Contenido de Usuario)</h2>
            </div>
            <div class="pl-11 space-y-3 text-white/80 text-sm sm:text-base leading-relaxed">
              <p>
                Aunque las bitácoras y fotos son privadas entre cada pareja (`couple_id`), para cumplir con los estándares internacionales de seguridad en aplicaciones móviles de Apple App Store y Google Play Store relativas a contenido subido a servidores en la nube (UGC), establecemos las siguientes reglas de convivencia:
              </p>
              <ul class="list-disc pl-5 space-y-2 text-white/75">
                <li><strong class="text-white">Respeto Mutuo y No Acoso:</strong> Queda prohibido utilizar las descripciones o imágenes para hostigar, intimidar o agredir verbalmente a la pareja o a otros miembros en trivias comunitarias.</li>
                <li><strong class="text-white">Contenido Adecuado y Legal:</strong> No está permitida la subida o distribución de material ilícito, violento o desnudez no consentida a nuestros servidores en la nube.</li>
                <li><strong class="text-white">Protección del Ecosistema:</strong> Para mantener la seguridad y calidez del servicio, nos reservamos el derecho de suspender o remover cuentas que incurran en conductas abusivas flagrantes sin previo aviso ni reembolso.</li>
              </ul>
            </div>
          </article>

          <!-- 2. Tienda de Recuerdos y Lógica de Cupos (Opción A) -->
          <article class="mb-8">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-md">2</div>
              <h2 class="text-xl font-bold text-white tracking-wide">Tienda de Recuerdos, Cupos y Vigencia Mensual</h2>
            </div>
            <div class="pl-11 space-y-3 text-white/80 text-sm sm:text-base leading-relaxed">
              <p>
                En LoveSync cada pareja dispone de un límite base mensual de citas gratuitas para documentar su historia. Si desean subir más recuerdos en un mismo mes, ponemos a disposición paquetes de expansión en nuestra Tienda:
              </p>
              <div class="bg-white/5 p-4 rounded-xl border border-white/10 my-3 text-sm">
                <strong class="text-amber-300 block mb-1 font-bold">✨ Vigencia de Cupos Extras (Modelo Mensual - Opción A):</strong>
                Los paquetes de cupos adquiridos (como la <em>Bolsa de Apuro</em> o la <em>Bolsa Estrella</em>) expanden la capacidad máxima de la bitácora <strong>para el mes calendario en curso en que se realiza la compra</strong>. El primer día del mes siguiente, el contador de citas se reinicia al límite base habitual (10 citas), incentivando a la pareja a disfrutar, tomar fotos y documentar sus citas activamente mes a mes. Los cupos extras no se traspasan ni acumulan para meses posteriores.
              </div>
              <p>
                <strong class="text-white">Bienes Digitales y Devoluciones (SERNAC - Ley N° 19.496 / N° 21.398):</strong> La compra de paquetes de cupos adicionales constituye la adquisición de un bien digital de consumo y acreditación electrónica instantánea. Una vez acreditados los cupos en la cuenta de la pareja en milisegundos tras el pago en MercadoPago o Tiendas oficiales, el usuario reconoce que se ha prestado el servicio y no proceden devoluciones o retractos, salvo fallas críticas de interrupción en nuestros servidores.
              </p>
            </div>
          </article>

          <!-- 3. Desvinculación de Parejas (`unpair`) -->
          <article class="mb-8">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-8 h-8 rounded-lg bg-purple-500 text-white flex items-center justify-center font-bold text-sm shadow-md">3</div>
              <h2 class="text-xl font-bold text-white tracking-wide">Desvinculación Autónoma (`unpair`)</h2>
            </div>
            <div class="pl-11 space-y-3 text-white/80 text-sm sm:text-base leading-relaxed">
              <p>
                El enlace de pareja en LoveSync es voluntario. Cualquiera de los miembros puede desvincularse desde Ajustes en cualquier momento. Al desvincularse, la conexión en tiempo real cesa y cada usuario conserva el acceso a su cuenta individual. Si la pareja se vuelve a emparejar en el futuro, podrán retomar sus recuerdos según la configuración de base de datos activa.
              </p>
            </div>
          </article>

          <!-- 4. Exención General y Uso -->
          <article class="mb-6">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-8 h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center font-bold text-sm shadow-md">4</div>
              <h2 class="text-xl font-bold text-white tracking-wide">Disponibilidad del Servicio</h2>
            </div>
            <div class="pl-11 space-y-3 text-white/80 text-sm sm:text-base leading-relaxed">
              <p>
                Trabajamos continuamente para que tu bitácora esté rápida y segura en Cloudflare R2 y servidores Docker. Sin embargo, el servicio se proporciona "tal cual" y no garantizamos que esté libre de interrupciones ocasionales por mantenimiento de redes o actualizaciones de sistema.
              </p>
            </div>
          </article>

          <!-- Bottom Action Section -->
          <div class="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="text-xs text-white/60 text-center sm:text-left">
              ¿Tienes dudas o necesitas asistencia legal o técnica?<br />
              <span class="text-white font-medium">Soporte oficial:</span> soporte@ourstoryapp.cl
            </div>
            <div class="flex items-center gap-3 w-full sm:w-auto">
              <router-link to="/privacy" class="btn-soft px-5 py-3 text-sm rounded-xl font-semibold text-white/90 border border-white/20 hover:bg-white/10 text-center flex-1 sm:flex-none">
                Ver Política de Privacidad
              </router-link>
              <button @click="goBack" class="btn-soft px-6 py-3 text-sm rounded-xl font-bold active:scale-95 transition-transform flex-1 sm:flex-none text-center bg-pink-500/30 text-white hover:bg-pink-500/40 border border-pink-500/50">
                Aceptar y Volver
              </button>
            </div>
          </div>
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

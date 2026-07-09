<template>
  <ion-page>
    <ion-content class="liquid-bg">
      <div class="min-h-screen py-10 px-4 sm:px-6 lg:px-8 relative z-10 max-w-4xl mx-auto text-white">
        <!-- Top Navigation -->
        <header class="flex items-center justify-between mb-8">
          <button 
            @click="goBack" 
            class="btn-primary px-4 py-2.5 text-sm rounded-xl flex items-center gap-2 transition-all active:scale-95 shadow-sm"
          >
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span class="text-white font-medium">Volver Atrás</span>
          </button>

          <span class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-white/90 text-black shadow-sm">
            <svg class="w-3.5 h-3.5 text-black" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Compromiso y Armonía
          </span>
        </header>

        <!-- Main Title Card -->
        <section class="glass p-8 sm:p-10 rounded-[2.5rem] mb-8 border border-white/15 shadow-2xl relative overflow-hidden" style="background: linear-gradient(135deg, rgba(20, 20, 30, 0.95) 0%, rgba(25, 25, 35, 0.98) 100%);">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/15 pb-6 mb-6">
            <div>
              <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-white" style="font-family: 'Comfortaa', sans-serif;">
                Términos y Condiciones
              </h1>
              <p class="mt-2 text-sm text-white font-normal">
                Acuerdo de Licencia de Usuario Final (EULA) y Convivencia — OurStory
              </p>
            </div>
            <div class="text-right text-xs text-white bg-white/10 py-2 px-3.5 rounded-xl border border-white/20 self-start sm:self-center">
              <span class="block font-bold text-white">Última actualización</span>
              9 de Julio, 2026
            </div>
          </div>

          <!-- Official Introductory Banner -->
          <div class="bg-white/5 border border-white/15 rounded-2xl p-5 mb-8 text-sm text-white font-normal leading-relaxed flex gap-4 items-start">
            <div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 mt-0.5 text-white">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 class="font-bold text-white text-base mb-1">Un Espacio Seguro para Tu Historia</h3>
              <p class="text-white font-normal">
                OurStory está diseñada como una bitácora y álbum íntimo entre tú y tu pareja. Al utilizar nuestros servicios y tienda, aceptas resguardar este espacio con respeto mutuo, en cumplimiento con la legislación de protección al consumidor e intimidad de Chile (SERNAC / Ley N° 19.628) y las normativas globales de Apple App Store y Google Play Store.
              </p>
            </div>
          </div>

          <!-- 1. Respeto y Cuidado de Contenidos (UGC) -->
          <article class="mb-8">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-8 h-8 rounded-lg bg-white/20 text-white flex items-center justify-center font-bold text-sm border border-white/30">1</div>
              <h2 class="text-xl font-bold text-white tracking-wide">Armonía en Nuestra Comunidad (Contenido de Usuario)</h2>
            </div>
            <div class="pl-11 space-y-3 text-white font-normal text-sm sm:text-base leading-relaxed">
              <p class="text-white">
                Aunque las bitácoras y fotografías son de carácter enteramente privado entre los dos dispositivos emparejados (`couple_id`), para acatar las directrices internacionales relativas al contenido subido a servidores en la nube (UGC) de Apple App Store y Google Play Store, establecemos las siguientes normas inexcusables:
              </p>
              <ul class="list-disc pl-5 space-y-2 text-white font-normal">
                <li class="text-white"><strong class="text-white font-bold">Respeto Mutuo y No Acoso:</strong> Queda prohibido utilizar títulos, descripciones o notas para ejercer intimidación, hostigamiento o agresiones verbales contra la pareja o terceros en apartados comunitarios.</li>
                <li class="text-white"><strong class="text-white font-bold">Contenido Legal y Consensuado:</strong> Queda estrictamente vedada la subida a nuestros servidores en la nube de material ilícito, violento o desnudez no consentida.</li>
                <li class="text-white"><strong class="text-white font-bold">Protección del Ecosistema:</strong> Nos reservamos el derecho unilateral de suspender o revocar cuentas que incurran en conductas abusivas reiteradas y graves, sin previo aviso ni derecho a reembolso de servicios contratados.</li>
              </ul>
            </div>
          </article>

          <!-- 2. Tienda de Recuerdos y Vigencia Mensual -->
          <article class="mb-8">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-8 h-8 rounded-lg bg-white/20 text-white flex items-center justify-center font-bold text-sm border border-white/30">2</div>
              <h2 class="text-xl font-bold text-white tracking-wide">Tienda de Recuerdos, Cupos y Vigencia Mensual</h2>
            </div>
            <div class="pl-11 space-y-3 text-white font-normal text-sm sm:text-base leading-relaxed">
              <p class="text-white">
                En OurStory cada pareja dispone de un límite base de citas gratuitas para documentar su historia de amor mes a mes. Si desean registrar un número mayor de recuerdos durante el mismo periodo mensual, ponemos a disposición paquetes de expansión en nuestra Tienda integrada:
              </p>
              <div class="bg-white/5 p-4.5 rounded-xl border border-white/15 my-3 text-sm flex gap-3.5 items-start">
                <div class="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div class="text-white font-normal">
                  <strong class="text-white block mb-1 font-bold">Vigencia de Cupos Extras (Renovación Mensual):</strong>
                  Los paquetes de cupos adquiridos en la Tienda expanden la capacidad máxima de la bitácora <strong>para el mes calendario en curso en que se efectúa el pago</strong>. El primer día del mes posterior, el contador de capacidad se reinicia automáticamente al límite base de la cuenta (10 citas mensuales), incentivando a la pareja a vivir experiencias y construir recuerdos mes a mes. Los cupos adicionales no se traspasan ni se acumulan para meses subsiguientes.
                </div>
              </div>
              <p class="text-white">
                <strong class="text-white font-bold">Bienes Digitales y Devoluciones (SERNAC - Ley N° 19.496 / N° 21.398):</strong> La adquisición de paquetes de cupos constituye la compra de un bien de contenido digital con prestación instantánea. Una vez acreditados de forma electrónica los cupos en el perfil del usuario tras el pago confirmado vía MercadoPago o Tiendas oficiales, se reconoce y acepta que se ha iniciado la prestación del servicio, por lo que cesa el derecho de retracto y no proceden devoluciones por saldos no utilizados en el mes respectivo.
              </p>
            </div>
          </article>

          <!-- 3. Desvinculación de Parejas (`unpair`) -->
          <article class="mb-8">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-8 h-8 rounded-lg bg-white/20 text-white flex items-center justify-center font-bold text-sm border border-white/30">3</div>
              <h2 class="text-xl font-bold text-white tracking-wide">Desvinculación de Dispositivos (`unpair`)</h2>
            </div>
            <div class="pl-11 space-y-3 text-white font-normal text-sm sm:text-base leading-relaxed">
              <p class="text-white">
                La conexión relacional en OurStory es voluntaria y de consentimiento mutuo. Cualquiera de los miembros puede desvincular su cuenta desde la configuración en cualquier instante. Al confirmar la desvinculación, finaliza de inmediato la sincronización cruzada de nuevas fotografías y notas entre ambos dispositivos. Cada usuario mantendrá su acceso al historial previo según lo estipulado en nuestra Política de Privacidad.
              </p>
            </div>
          </article>

          <!-- 4. Exención General y Disponibilidad -->
          <article class="mb-6">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-8 h-8 rounded-lg bg-white/20 text-white flex items-center justify-center font-bold text-sm border border-white/30">4</div>
              <h2 class="text-xl font-bold text-white tracking-wide">Disponibilidad Técnica de los Servidores</h2>
            </div>
            <div class="pl-11 space-y-3 text-white font-normal text-sm sm:text-base leading-relaxed">
              <p class="text-white">
                Trabajamos continuamente y con protocolos redundantes para mantener tu álbum disponible en servidores de alta velocidad (Cloudflare R2 y bases de datos relacionales). Sin embargo, el servicio se presta "tal cual" (*as is*) y no garantizamos ausencia absoluta de interrupciones por mantenimiento programado o fluctuaciones de red ajenas a nuestra infraestructura.
              </p>
            </div>
          </article>

          <!-- Bottom Action Section -->
          <div class="mt-8 pt-6 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="text-xs text-white font-normal text-center sm:text-left">
              ¿Tienes consultas o necesitas soporte técnico o legal?<br />
              <span class="text-white font-bold">Atención a usuarios:</span> wearesamod@gmail.com
            </div>
            <div class="flex items-center gap-3 w-full sm:w-auto">
              <router-link to="/privacy" class="btn-soft px-5 py-3 text-sm rounded-xl font-bold text-white border border-white/30 hover:bg-white/10 text-center flex-1 sm:flex-none">
                Ver Política de Privacidad
              </router-link>
              <button @click="goBack" class="btn-soft px-6 py-3 text-sm rounded-xl font-bold active:scale-95 transition-transform flex-1 sm:flex-none text-center bg-white text-black hover:bg-white/90">
                Aceptar y Volver
              </button>
            </div>
          </div>
        </section>

        <!-- Footer -->
        <footer class="text-center text-xs text-white/60 pb-6">
          <p>© 2026 OurStory. Todos los derechos reservados.</p>
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

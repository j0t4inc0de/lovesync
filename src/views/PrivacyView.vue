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
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span class="text-white font-medium">Volver Atrás</span>
          </button>

          <span class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-white/90 text-black shadow-sm">
            <svg class="w-3.5 h-3.5 text-black" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Privacidad y Resguardo
          </span>
        </header>

        <!-- Main Title Card -->
        <section class="glass p-8 sm:p-10 rounded-[2.5rem] mb-8 border border-white/15 shadow-2xl relative overflow-hidden" style="background: linear-gradient(135deg, rgba(20, 20, 30, 0.95) 0%, rgba(25, 25, 35, 0.98) 100%);">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/15 pb-6 mb-6">
            <div>
              <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-white" style="font-family: 'Comfortaa', sans-serif;">
                Política de Privacidad
              </h1>
              <p class="mt-2 text-sm text-white font-normal">
                Tratamiento de Datos Personales y Repositorio en Nube — OurStory
              </p>
            </div>
            <div class="text-right text-xs text-white bg-white/10 py-2 px-3.5 rounded-xl border border-white/20 self-start sm:self-center">
              <span class="block font-bold text-white">Última actualización</span>
              9 de Julio, 2026
            </div>
          </div>

          <!-- R2 Cloudflare Official Highlight -->
          <div class="bg-white/5 border border-white/15 rounded-2xl p-6 mb-8 text-sm sm:text-base text-white font-normal leading-relaxed shadow-lg">
            <div class="flex gap-4 items-start">
              <div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 mt-0.5 text-white">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <div>
                <h3 class="font-extrabold text-white text-base sm:text-lg mb-2">
                  Almacenamiento en Nube con Cloudflare R2
                </h3>
                <p class="italic text-white font-normal border-l-2 border-white pl-3.5 my-2">
                  "Las fotografías e imágenes de la bitácora de OurStory se transmiten mediante protocolos cifrados y se resguardan en servidores de la nube de Cloudflare R2 con el único objetivo de hacer posible la sincronización privada y en tiempo real entre los dos dispositivos móviles emparejados (`couple_id`). No se ceden, venden ni explotan con fines publicitarios ni de entrenamiento artificial."
                </p>
                <p class="text-xs text-white font-normal mt-2">
                  Implementamos protocolos de seguridad estándar de la industria (cifrado TLS en tránsito y AES-256 en reposo). Solo los dos teléfonos autorizados bajo tu enlace de pareja tienen acceso y visibilidad sobre el álbum.
                </p>
              </div>
            </div>
          </div>

          <!-- 1. Datos Personales Mínimos Recolectados -->
          <article class="mb-8">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-8 h-8 rounded-lg bg-white/20 text-white flex items-center justify-center font-bold text-sm border border-white/30">1</div>
              <h2 class="text-xl font-bold text-white tracking-wide">Datos Personales Mínimos Recolectados</h2>
            </div>
            <div class="pl-11 space-y-3 text-white font-normal text-sm sm:text-base leading-relaxed">
              <p class="text-white">
                En cumplimiento con el principio de minimización de datos y conforme a las exigencias de la Ley N° 19.628 sobre Protección de la Vida Privada de Chile, OurStory únicamente requiere la información estrictamente indispensable para operar tu cuenta y sincronización:
              </p>
              <ul class="list-disc pl-5 space-y-2 text-white font-normal">
                <li class="text-white"><strong class="text-white font-bold">Información de Cuenta:</strong> Correo electrónico (empleado de manera exclusiva para autenticación y recuperación de credenciales) y el nombre de pila o seudónimo del usuario.</li>
                <li class="text-white"><strong class="text-white font-bold">Identificador Criptográfico de Pareja (`couple_id`):</strong> Token relacional privado que enlaza en exclusiva las dos cuentas y terminales móviles autorizadas.</li>
                <li class="text-white"><strong class="text-white font-bold">Historial y Recuerdos de la Bitácora:</strong> Fechas, títulos, relatos escritos e imágenes que tú y tu pareja deciden adjuntar libremente a la línea de tiempo.</li>
              </ul>
            </div>
          </article>

          <!-- 2. Procesamiento Seguro de Pagos de Terceros -->
          <article class="mb-8">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-8 h-8 rounded-lg bg-white/20 text-white flex items-center justify-center font-bold text-sm border border-white/30">2</div>
              <h2 class="text-xl font-bold text-white tracking-wide">Seguridad Bancaria y Pasarelas de Pago</h2>
            </div>
            <div class="pl-11 space-y-3 text-white font-normal text-sm sm:text-base leading-relaxed">
              <p class="text-white">
                OurStory <strong class="text-white font-bold">no solicita, recibe ni almacena en sus servidores números de tarjetas de crédito o débito, códigos CVV ni credenciales bancarias o de Cuenta RUT</strong>. Todas las compras y suscripciones de paquetes de cupos en la tienda son procesadas externamente por pasarelas especializadas de alta seguridad certificadas con el estándar PCI-DSS (como MercadoPago, Transbank o sistemas nativos de Apple App Store y Google Play Store). Nuestros sistemas reciben únicamente un comprobante digital encriptado de aprobación que acredita los cupos de manera instantánea.
              </p>
            </div>
          </article>

          <!-- 3. Derecho al Olvido y Borrado de Cuenta -->
          <article class="mb-4">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-8 h-8 rounded-lg bg-white/20 text-white flex items-center justify-center font-bold text-sm border border-white/30">3</div>
              <h2 class="text-xl font-bold text-white tracking-wide">Tu Derecho al Olvido y Eliminación de Datos</h2>
            </div>
            <div class="pl-11 space-y-3 text-white font-normal text-sm sm:text-base leading-relaxed">
              <p class="text-white">
                Eres soberano sobre tu información e historia personal. En apego al artículo 12 de la Ley N° 19.628 de Chile y a las normativas de purga obligatoria de Apple App Store y Google Play Store, el usuario puede solicitar y ejecutar en cualquier momento la eliminación completa y definitiva de su cuenta y registros directamente desde el menú de Ajustes dentro de la aplicación.
              </p>
              <p class="text-white">
                Al confirmar la eliminación definitiva, el perfil y los identificadores se borran del servidor de base de datos y se activa un proceso automatizado que destruye para siempre los archivos y fotografías alojados bajo su cuenta o `couple_id` en los buckets de Cloudflare R2 en un plazo no mayor a 14 días corridos, sin posibilidad de recuperación ni retención oculta.
              </p>
            </div>
          </article>

          <!-- Bottom Action Section -->
          <div class="mt-8 pt-6 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="text-xs text-white font-normal text-center sm:text-left">
              ¿Dudas sobre el tratamiento de tus datos en Chile o el extranjero?<br />
              <span class="text-white font-bold">Oficial de Privacidad:</span> wearesamod@gmail.com
            </div>
            <div class="flex items-center gap-3 w-full sm:w-auto">
              <router-link to="/terms" class="btn-soft px-5 py-3 text-sm rounded-xl font-bold text-white border border-white/30 hover:bg-white/10 text-center flex-1 sm:flex-none">
                Ver Términos y Condiciones
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

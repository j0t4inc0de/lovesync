<template>
  <ion-page>
    <ion-content class="ion-padding flex items-center justify-center">
      <!-- Background glow orbs -->
      <div class="bg-orb w-[300px] h-[300px] bg-pink-300/35 -top-10 -left-10"></div>
      <div class="bg-orb w-[300px] h-[300px] bg-violet-300/25 bottom-10 -right-10"></div>

      <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="max-w-md w-full space-y-8 glass p-8 rounded-[2.2rem] border border-white/60 shadow-2xl relative text-center">
          
          <!-- Back button / Log out mock -->
          <button @click="goBack" class="absolute top-6 left-6 text-[13px] font-semibold flex items-center gap-1" style="color: var(--text-secondary);">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
            Atrás
          </button>

          <!-- Header -->
          <div class="pt-6">
            <h2 class="text-2xl font-extrabold tracking-tight" style="color: var(--text-primary); font-family: 'Comfortaa', sans-serif;">
              Vincular Pareja
            </h2>
            <p class="mt-2 text-[13px] font-medium leading-relaxed px-2" style="color: var(--text-secondary);">
              Para comenzar a compartir recuerdos, conéctate con tu pareja compartiendo tu código o ingresando el de ella.
            </p>
          </div>

          <!-- Section 1: Generate My Code -->
          <div class="rounded-2xl p-5 border mt-6 text-left relative overflow-hidden" style="background: rgba(255, 55, 95, 0.02); border-color: rgba(255, 55, 95, 0.08);">
            <label class="text-[0.65rem] font-bold uppercase tracking-wider pl-1 mb-2 block" style="color: var(--accent);">Tu Código de Invitación</label>
            <div class="flex items-center gap-3">
              <div class="flex-1 input-field px-4 py-3 text-center text-lg font-bold tracking-widest bg-white/60 select-all" style="font-family: monospace; color: var(--text-primary);">
                {{ myCode }}
              </div>
              <button @click="copyCode" class="btn btn-soft btn-sm p-3.5 flex items-center justify-center">
                <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/></svg>
              </button>
            </div>
            <p class="text-[10px] font-semibold text-right mt-1.5" style="color: var(--text-muted);">Haz clic para copiar y enviar</p>
          </div>

          <!-- Divider -->
          <div class="flex items-center justify-center my-4">
            <span class="h-[1px] w-full bg-[var(--border-subtle)]"></span>
            <span class="px-3 text-[10px] font-bold uppercase tracking-wider" style="color: var(--text-muted);">O</span>
            <span class="h-[1px] w-full bg-[var(--border-subtle)]"></span>
          </div>

          <!-- Section 2: Enter Partner's Code -->
          <div class="text-left">
            <label class="text-[0.65rem] font-bold uppercase tracking-wider pl-1 mb-2 block" style="color: var(--text-muted);">Ingresar Código de tu Pareja</label>
            <form @submit.prevent="handlePair" class="space-y-4">
              <input v-model="partnerCode" type="text" required placeholder="LVSY-XXXX" class="input-field w-full px-4 py-3.5 text-[15px] text-center font-semibold tracking-wider placeholder:tracking-normal focus:outline-none uppercase" />
              <button type="submit" :disabled="pairing" class="w-full btn btn-primary py-3.5 text-[15px] font-bold active:scale-95 transition-transform flex items-center justify-center gap-2">
                <svg v-if="pairing" class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="10"/></svg>
                <span>{{ pairing ? 'Vinculando...' : 'Vincular Pareja' }}</span>
              </button>
            </form>
          </div>

        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { IonPage, IonContent } from '@ionic/vue';
import { api } from '../services/api';

const router = useRouter();
const partnerCode = ref('');
const pairing = ref(false);
const myCode = ref('Cargando...');
let pollInterval = null;

// Fetch my code on mount & start smart auto-detection
onMounted(async () => {
  try {
    const profile = await api.getProfile();
    if (profile && profile.user) {
      if (profile.user.couple_id) {
        router.push('/home');
        return;
      }
      myCode.value = profile.user.invite_code;

      // Detección automática en tiempo real: si la otra persona ingresa nuestro código, entramos solos sin recargar
      pollInterval = setInterval(async () => {
        try {
          const res = await api.getProfile();
          if (res && res.user && res.user.couple_id) {
            clearInterval(pollInterval);
            alert('¡Tu pareja ha ingresado tu código y se han conectado con éxito! Entrando a su santuario...');
            router.push('/home');
          }
        } catch (e) {
          // Ignorar de forma silenciosa si hay parpadeos en red durante la espera
        }
      }, 3000);
    } else {
      router.push('/login');
    }
  } catch (error) {
    console.error('Error fetching invite code:', error);
    myCode.value = 'ERROR';
    router.push('/login');
  }
});

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval);
});

const copyCode = () => {
  if (myCode.value === 'Cargando...' || myCode.value === 'ERROR') return;
  navigator.clipboard.writeText(myCode.value);
  alert('¡Código copiado al portapapeles! Envíalo a tu pareja.');
};

const handlePair = async () => {
  if (!partnerCode.value) return;
  pairing.value = true;
  
  try {
    const cleanCode = partnerCode.value.trim().toUpperCase();
    await api.pair(cleanCode);

    if (pollInterval) clearInterval(pollInterval);
    alert('¡Vinculación exitosa! Redireccionando a la Bitácora...');
    router.push('/home');
  } catch (error) {
    alert(error.message || 'Error al vincular');
  } finally {
    pairing.value = false;
  }
};

const goBack = () => {
  if (pollInterval) clearInterval(pollInterval);
  api.logout();
  router.push('/login');
};
</script>

<style scoped>
ion-content {
  --background: #f0f0f5;
}
</style>

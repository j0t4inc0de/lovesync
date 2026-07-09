<template>
  <ion-page>
    <ion-content class="ion-padding flex items-center justify-center">
      <!-- Background glow orbs -->
      <div class="bg-orb w-[300px] h-[300px] bg-pink-300/35 -top-10 -left-10"></div>
      <div class="bg-orb w-[300px] h-[300px] bg-violet-300/25 bottom-10 -right-10"></div>

      <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="max-w-md w-full space-y-8 glass p-8 rounded-[2.2rem] border border-white/60 shadow-2xl relative">
          <!-- Logo & Header -->
          <div class="text-center">
            <div class="w-16 h-16 rounded-2xl bg-[var(--accent)] flex items-center justify-center mx-auto shadow-lg shadow-[var(--accent-glow)] mb-4 animate-pulse">
              <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            </div>
            <h2 class="text-3xl font-extrabold tracking-tight" style="color: var(--text-primary); font-family: 'Comfortaa', sans-serif;">
              Our Story
            </h2>
            <p class="mt-2 text-[13px] font-medium" style="color: var(--text-secondary);">
              {{ isSignUp ? 'Registra tu cuenta para conectar' : 'Sincroniza tus citas y recuerdos' }}
            </p>
          </div>

          <!-- Form -->
          <form class="mt-8 space-y-4" @submit.prevent="handleSubmit">
            <div v-if="isSignUp" class="animate-fade-in">
              <label class="text-[0.65rem] font-bold uppercase tracking-wider pl-1 mb-1.5 block" style="color: var(--text-muted);">Tu Nombre</label>
              <input v-model="name" type="text" required placeholder="Juan Pérez" class="input-field w-full px-4 py-3.5 text-[15px] focus:outline-none" />
            </div>

            <div>
              <label class="text-[0.65rem] font-bold uppercase tracking-wider pl-1 mb-1.5 block" style="color: var(--text-muted);">Correo Electrónico</label>
              <input v-model="email" type="email" required placeholder="correo@ejemplo.com" class="input-field w-full px-4 py-3.5 text-[15px] focus:outline-none" />
            </div>

            <div>
              <label class="text-[0.65rem] font-bold uppercase tracking-wider pl-1 mb-1.5 block" style="color: var(--text-muted);">Contraseña</label>
              <input v-model="password" type="password" required placeholder="••••••••" class="input-field w-full px-4 py-3.5 text-[15px] focus:outline-none" />
            </div>

            <div class="pt-2">
              <button type="submit" :disabled="loading" class="w-full btn btn-primary py-3.5 text-[15px] font-bold active:scale-95 transition-transform flex items-center justify-center gap-2">
                <svg v-if="loading" class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="10"/></svg>
                <span>{{ isSignUp ? 'Registrarse' : 'Iniciar Sesión' }}</span>
              </button>
            </div>
          </form>

          <!-- Toggle Button -->
          <div class="text-center mt-6">
            <button @click="isSignUp = !isSignUp" class="text-[13px] font-semibold hover:underline" style="color: var(--accent);">
              {{ isSignUp ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate' }}
            </button>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { IonPage, IonContent } from '@ionic/vue';
import { api } from '../services/api';

const router = useRouter();
const isSignUp = ref(false);
const loading = ref(false);

const name = ref('');
const email = ref('');
const password = ref('');

const handleSubmit = async () => {
  if (!email.value || !password.value) return;
  loading.value = true;
  
  try {
    if (isSignUp.value) {
      await api.register(name.value || 'Pareja', email.value, password.value);
      alert('¡Registro exitoso! Por favor inicia sesión ahora.');
      isSignUp.value = false;
    } else {
      await api.login(email.value, password.value);

      // Check if user is already paired
      const profile = await api.getProfile();
      if (profile.user && profile.user.couple_id) {
        router.push('/home');
      } else {
        router.push('/pair');
      }
    }
  } catch (error) {
    alert(error.message || 'Ocurrió un error');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
ion-content {
  --background: #f0f0f5;
}
</style>

<template>
  <ion-app>
    <ion-router-outlet />
    
    <!-- Reusable Premium Popup -->
    <div v-if="isVisible" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/25 backdrop-blur-sm" @click="hidePopup" style="animation: fadeIn 0.2s ease-out;">
      <div class="glass p-6 rounded-3xl text-center max-w-xs mx-auto border border-white/60 shadow-2xl" @click.stop style="background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(25px); box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
        <div class="w-12 h-12 rounded-2xl bg-[var(--accent-soft)] flex items-center justify-center mx-auto mb-3 text-[var(--accent)] shadow-inner">
          <svg class="w-6 h-6 animate-pulse" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
        </div>
        <p class="text-[16px] font-bold m-0" style="color: var(--text-primary); font-family: 'Comfortaa', sans-serif;">{{ popupMessage }}</p>
        <button @click="hidePopup" class="btn-primary btn-sm mt-4 w-full text-[13px] font-semibold py-2">Entendido</button>
      </div>
    </div>
  </ion-app>
</template>

<script setup>
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { usePopup } from './services/popup';

const { isVisible, popupMessage, hidePopup } = usePopup();
</script>

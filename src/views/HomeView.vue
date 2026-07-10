<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar class="px-5 pt-3 pb-2">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-[var(--accent)] flex items-center justify-center shadow-lg shadow-[var(--accent-glow)]">
              <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            </div>
            <div>
              <h1 class="text-[18px] font-bold tracking-tight m-0" style="color: var(--text-primary); font-family: 'Comfortaa', sans-serif;">Our Story</h1>
              <p class="text-[12px] font-medium m-0" style="color: var(--text-secondary);">Vinculado con {{ partnerName }}</p>
            </div>
          </div>
          <div class="flex items-center gap-1.5 sm:gap-2">
            <!-- Streak pill -->
            <div @click="toggleStreakTooltip" class="px-2.5 py-1 rounded-full text-[12px] font-bold border cursor-pointer select-none active:scale-95 transition-transform flex items-center gap-1 shadow-sm" style="background: rgba(255, 149, 0, 0.08); border-color: rgba(255, 149, 0, 0.22); color: #ff9500;">
              <span>{{ loveStreak }}</span>
              <svg class="w-3.5 h-3.5 text-[#ff9500] fill-current animate-bounce" viewBox="0 0 24 24"><path d="M17.55 11.2c-.23-.3-.5-.56-.8-.77-.45-.33-1-.54-1.55-.66-.45-.1-.9-.13-1.35-.1-.45.03-.9.13-1.33.28-.43.15-.83.37-1.2.65-.73.55-1.35 1.25-1.8 2.05-.18-.28-.38-.55-.6-.8-.43-.5-.94-.94-1.52-1.3-.57-.36-1.18-.63-1.82-.8-.64-.17-1.3-.23-1.96-.18-.66.05-1.3.2-1.92.45-.62.25-1.2.6-1.7 1.03C1.65 13.06 3.03 16.5 5.14 18.6 7.25 20.7 10.7 22.08 14.15 21c3.45-1.08 6.03-4.08 6.85-7.53.2-1.02.14-2.07-.15-3.07-.3-1-.8-1.92-1.48-2.72z"/></svg>
            </div>
            <!-- Slots pill -->
            <div @click="toggleSlotsTooltip" class="px-3 py-1 rounded-full text-[12px] font-bold border cursor-pointer select-none active:scale-95 transition-transform" style="background: rgba(255, 55, 95, 0.06); border-color: rgba(255, 55, 95, 0.12); color: var(--accent);">
              {{ datesList.length }}/{{ maxSlots }} citas
            </div>
          </div>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <!-- Background glow orbs -->
      <div class="bg-orb w-[400px] h-[400px] bg-pink-300/30 top-0 left-0"></div>
      <div class="bg-orb w-[400px] h-[400px] bg-violet-300/20 bottom-0 right-0"></div>

      <!-- Celebration overlay -->
      <div v-if="showHeartOverlay" class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/40 backdrop-blur-3xl animate-fade-in">
        <div class="glass w-72 p-6 rounded-3xl text-center shadow-2xl flex flex-col items-center border border-white/50">
          <div class="w-16 h-16 rounded-2xl bg-[var(--accent)] flex items-center justify-center mb-4 animate-bounce shadow-lg shadow-[var(--accent-glow)] text-white">
            <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          </div>
          <p class="text-[19px] font-bold mb-1" style="color: var(--text-primary); font-family: 'Comfortaa', sans-serif;">¡Cita guardada!</p>
          <p class="text-[13px] font-medium m-0" style="color: var(--text-secondary);">Sincronización completada</p>
        </div>
      </div>

      <!-- Match Celebration overlay (Satisfying double-click match animation) -->
      <div v-if="showMatchCelebration" class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/40 backdrop-blur-3xl animate-fade-in overflow-hidden">
        <div class="relative w-72 h-72 flex items-center justify-center">
          <!-- Shockwave ring -->
          <div class="absolute w-24 h-24 rounded-full border-2 border-[var(--accent)] animate-shockwave"></div>
          
          <!-- Glowing background aura -->
          <div class="absolute w-40 h-40 bg-[var(--accent)] rounded-full blur-[40px] opacity-20 animate-pulse-glow"></div>
          
          <!-- Floating Heart Left (User) -->
          <div class="absolute animate-heart-merge-left flex flex-col items-center">
            <div class="w-16 h-16 rounded-2xl bg-[var(--accent)] flex items-center justify-center shadow-lg shadow-[var(--accent-glow)] text-white">
              <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            </div>
            <span class="text-[11px] font-bold mt-2 uppercase tracking-wider" style="color: var(--text-primary);">Tú</span>
          </div>
          
          <!-- Floating Heart Right (Partner) -->
          <div class="absolute animate-heart-merge-right flex flex-col items-center">
            <div class="w-16 h-16 rounded-2xl bg-pink-500 flex items-center justify-center shadow-lg shadow-pink-500/20 text-white">
              <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            </div>
            <span class="text-[11px] font-bold mt-2 uppercase tracking-wider" style="color: var(--text-primary);">{{ partnerName }}</span>
          </div>

          <!-- Sparkle stars and miniature heart particles bursting from the center -->
          <div v-for="n in 8" :key="n" :class="'absolute w-3.5 h-3.5 text-[var(--accent)] particle-' + n">
            <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          </div>
        </div>
        
        <div class="text-center mt-4 px-6 animate-text-reveal">
          <h3 class="text-[20px] font-black tracking-tight" style="color: var(--text-primary);">¡Conexión Sincronizada!</h3>
          <p class="text-[14px] font-medium mt-1" style="color: var(--text-secondary);">Abriendo formulario de recuerdos...</p>
        </div>
      </div>

      <div class="pb-28 max-w-lg mx-auto relative z-10">

        <!-- ═══ TIMELINE ═══ -->
        <div v-if="currentTab === 'timeline'">
          <div class="flex items-baseline justify-between mb-5">
            <h2 class="text-[22px] font-bold tracking-tight" style="color: var(--text-primary); font-family: 'Comfortaa', sans-serif;">Bitácora</h2>
            <span class="text-[13px] font-medium" style="color: var(--text-muted);">Han tenido {{ datesList.length }} citas!</span>
          </div>

          <!-- Quick Action -->
          <div class="glass rounded-2xl p-5 mb-5 relative">
            <!-- Tooltip for Quick Action Info -->
            <div v-if="showQuickActionTooltip" 
                 class="absolute z-30 w-52 p-3 rounded-2xl glass text-[11px] leading-snug font-semibold text-center flex items-center justify-center border border-white/60 animate-tooltip-in" 
                 style="top: -65px; right: 10px; background: rgba(255,255,255,0.95); backdrop-filter: blur(25px); color: var(--text-primary); pointer-events: none; box-shadow: 0 8px 25px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.02);">
              <div class="absolute -bottom-[5px] right-4 w-2.5 h-2.5 bg-white border-b border-r border-white/60 rotate-45" style="background: rgba(255,255,255,0.95);"></div>
              <span>Presionen ambos al mismo tiempo para registrar su día juntos.</span>
            </div>

            <h3 class="text-[15px] font-semibold mb-1 flex items-center justify-between" style="color: var(--text-primary);">
              <span>¿Tuvieron una cita hoy?</span>
              <a href="#" @click.prevent="toggleQuickActionTooltip">
                <svg class="w-4 h-4" style="color: #a2a8b3;" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path stroke-linecap="round" stroke-linejoin="round" d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3m0 4h.01"/></svg>
              </a>
            </h3>
            <p class="text-[13px] mb-4" style="color: var(--text-secondary);">Ambos deben presionar para registrar el recuerdo.</p>

            <button @click="handleFirstLock"
              :class="[
                'w-full text-[15px] font-semibold flex items-center justify-center gap-2.5 transition-all active:scale-95',
                doubleLockState === 'idle'    ? 'btn-primary' :
                doubleLockState === 'waiting' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20 animate-pulse btn' :
                                                'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 btn'
              ]">
              <svg v-if="doubleLockState === 'idle'" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              <svg v-else-if="doubleLockState === 'waiting'" class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="10"/></svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
              {{ doubleLockState === 'idle' ? 'Añadir Cita' : doubleLockState === 'waiting' ? 'Esperando a ' + partnerName + '...' : doubleLockState === 'waiting_partner' ? '¡' + partnerName + ' te espera! Presiona' : '¡Ambos Listos!' }}
            </button>
            
            <button v-if="doubleLockState === 'waiting' || doubleLockState === 'waiting_partner'" 
                    @click="cancelLock" 
                    class="btn-soft w-full mt-2 text-[14px]">
              Cancelar
            </button>
          </div>

          <!-- Memory Cards -->
          <div class="space-y-4">
            <div v-for="date in datesList" :key="date.id" 
                 class="glass rounded-2xl overflow-hidden group select-none active:scale-[0.99] transition-transform duration-300"
                 @mousedown="startPress(date)"
                 @mouseup="cancelPress"
                 @mouseleave="cancelPress"
                 @touchstart="startPress(date)"
                 @touchend="cancelPress"
                 @touchmove="cancelPress">
              <div class="h-44 relative">
                <img :src="date.photo_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80'" alt="Memory" class="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
                <div class="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                  <div>
                    <h4 class="text-[15px] font-bold text-white leading-tight drop-shadow-sm" style="font-family: 'Comfortaa', sans-serif;">{{ date.location }}</h4>
                    <p class="text-[12px] text-white/75 font-medium mt-0.5">{{ date.city }} · {{ formatDate(date.date_time) }}</p>
                  </div>
                  <div class="flex items-center gap-1.5 bg-white/15 backdrop-blur-md px-2.5 py-1.5 rounded-xl text-[12px] font-bold text-white border border-white/20">
                    <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    {{ getAvgStars(date.rating_user_1, date.rating_user_2) }}
                  </div>
                </div>
              </div>

              <div class="px-4 py-3.5">
                <p class="text-[13px] leading-relaxed italic" style="color: var(--text-secondary);">"{{ date.description || 'Sin descripción...' }}"</p>

                <div class="flex items-center justify-between mt-3 pt-3" style="border-top: 1px solid var(--border-subtle);">
                  <div class="flex items-center gap-1 text-[12px] font-medium" style="color: var(--text-secondary);">
                    <span>Tú {{ isUser1 ? date.rating_user_1 : date.rating_user_2 }}</span>
                    <svg class="w-3 h-3 text-amber-500" fill="currentColor" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    <span class="mx-1 opacity-30">·</span>
                    <span>{{ partnerName }} {{ isUser1 ? date.rating_user_2 : date.rating_user_1 }}</span>
                    <svg class="w-3 h-3 text-amber-500" fill="currentColor" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  </div>
                  <div v-if="getEditTimeLeft(date.created_at)" @click="openEditModal(date)" class="flex items-center gap-1 text-[11px] font-bold cursor-pointer select-none px-2 py-0.5 rounded-lg border border-[var(--accent)]/15 active:scale-95 transition-transform" style="background: var(--accent-soft); color: var(--accent);">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    Editar · {{ getEditTimeLeft(date.created_at) }}
                  </div>
                  <div v-else class="flex items-center gap-1 text-[11px] font-medium" style="color: var(--text-muted);">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                    Sincronizada
                  </div>
                </div>

                <div class="flex flex-wrap gap-1.5 mt-2.5">
                  <span v-for="tag in date.tags" :key="tag" class="px-2.5 py-1 rounded-lg text-[11px] font-medium" style="background: var(--fill); color: var(--text-secondary);">{{ tag }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ═══ TRIVIA ═══ -->
        <div v-if="currentTab === 'trivia'">
          <div class="mb-5 relative">
            <h2 class="text-[22px] font-bold tracking-tight flex items-center justify-between" style="color: var(--text-primary); font-family: 'Comfortaa', sans-serif;">
              <span>Trivia</span>
              <a href="#" @click.prevent="toggleTriviaTooltip">
                <svg class="w-4 h-4" style="color: #a2a8b3;" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path stroke-linecap="round" stroke-linejoin="round" d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3m0 4h.01"/></svg>
              </a>
            </h2>
            <p class="text-[13px] font-medium" style="color: var(--text-secondary);">Responde correctamente para ganar +1 cupo</p>

            <!-- Tooltip for Trivia Info -->
            <div v-if="showTriviaTooltip" 
                 class="absolute z-30 w-52 p-3 rounded-2xl glass text-[11px] leading-snug font-semibold text-center flex items-center justify-center border border-white/60 animate-tooltip-in" 
                 style="top: 40px; right: 0; background: rgba(255,255,255,0.95); backdrop-filter: blur(25px); color: var(--text-primary); pointer-events: none; box-shadow: 0 8px 25px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.02);">
              <div class="absolute -top-[5px] right-2 w-2.5 h-2.5 bg-white border-t border-l border-white/60 rotate-45" style="background: rgba(255,255,255,0.95);"></div>
              <span>Ambos deben responder correctamente hoy para ganar +1 cupo de cita.</span>
            </div>
          </div>

          <!-- Locked State if less than 3 dates -->
          <div v-if="datesList.length < 3" class="glass rounded-2xl p-6 text-center border border-white/50" style="background: rgba(255,255,255,0.65); backdrop-filter: blur(20px);">
            <div class="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center border bg-red-50 border-red-100 text-red-500">
              <svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            </div>
            <h3 class="text-[17px] font-bold mb-1.5" style="color: var(--text-primary); font-family: 'Comfortaa', sans-serif;">Trivia Bloqueada</h3>
            <p class="text-[13.5px] leading-relaxed px-3 mb-0" style="color: var(--text-secondary);">Deben registrar al menos <strong>3 citas</strong> en su Bitácora para poder jugar la Trivia sobre sus recuerdos de pareja.</p>
          </div>

          <!-- Locked State if already played today -->
          <div v-else-if="hasPlayedTriviaToday" class="glass rounded-2xl p-6 text-center border border-white/50" style="background: rgba(255,255,255,0.65); backdrop-filter: blur(20px);">
            <div class="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center border bg-amber-50 border-amber-100 text-amber-500">
              <svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            </div>
            <h3 class="text-[17px] font-bold mb-1.5" style="color: var(--text-primary); font-family: 'Comfortaa', sans-serif;">Trivia Completada</h3>
            <p class="text-[13.5px] leading-relaxed px-3 mb-0" style="color: var(--text-secondary);">Ya has jugado la trivia de hoy. ¡Vuelve mañana para ganar más cupos!</p>
          </div>

          <!-- Active Game States -->
          <div v-else>
            <div v-if="triviaState === 'active'" class="glass rounded-2xl p-5 relative overflow-hidden">
              <div class="absolute top-0 left-0 right-0 h-1" style="background: var(--fill);">
                <div class="h-full bg-[var(--accent)] transition-all duration-1000 ease-linear rounded-full" :style="{ width: (timerSeconds / 15) * 100 + '%' }"></div>
              </div>
              <div class="flex justify-between items-center mb-4 mt-2">
                <span class="text-[12px] font-bold uppercase tracking-wider" style="color: var(--accent);">Desafío</span>
                <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-bold bg-red-50 text-red-500">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                  {{ timerSeconds }}s
                </div>
              </div>
              <h3 class="text-[17px] font-bold mb-5 leading-snug" style="color: var(--text-primary);">{{ currentQuestion?.question }}</h3>
              <div class="space-y-2.5">
                <button v-for="(option, idx) in currentQuestion?.options" :key="idx" @click="selectOption(idx)"
                  class="btn-ghost btn-left w-full text-[15px] hover:border-[var(--accent)]/30 hover:bg-[var(--accent-soft)]" style="color: var(--text-primary);">
                  {{ option }}
                </button>
              </div>
              <div class="mt-5 flex items-start gap-2.5 py-3 px-4 rounded-xl text-[12px] leading-snug bg-amber-50 text-amber-700">
                <svg class="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <p class="m-0"><strong>Anti-Trampa:</strong> Si sales de la app o el tiempo expira, perderás este intento.</p>
              </div>
            </div>

            <div v-else-if="triviaState === 'cheated'" class="glass rounded-2xl p-6 text-center">
              <div class="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center border" style="background: rgba(255, 59, 48, 0.08); border-color: rgba(255, 59, 48, 0.15);">
                <svg class="w-7 h-7 text-red-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              </div>
              <h3 class="text-[17px] font-bold mb-1" style="color: var(--text-primary); font-family: 'Comfortaa', sans-serif;">Intento Anulado</h3>
              <p class="text-[13px] mb-5" style="color: var(--text-secondary);">Cambiaste de pestaña o saliste de la app.</p>
              <button @click="restartTrivia" class="btn text-[15px] mx-auto block text-white font-semibold shadow-lg shadow-red-500/20" style="background: #ff3b30;">Aceptar</button>
            </div>

            <div v-else-if="triviaState === 'success'" class="glass rounded-2xl p-6 text-center">
              <div class="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center border" style="background: rgba(52, 199, 89, 0.08); border-color: rgba(52, 199, 89, 0.15);">
                <svg class="w-7 h-7 text-emerald-500" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
              </div>
              <h3 class="text-[17px] font-bold mb-1" style="color: var(--text-primary); font-family: 'Comfortaa', sans-serif;">¡Correcto!</h3>
              <p class="text-[13.5px] mb-4 leading-relaxed" style="color: var(--text-secondary);">
                {{ matchedDailySlots ? '¡Ambos respondieron bien!' : 'Respondiste correctamente. Esperando que tu pareja también responda hoy.' }}
              </p>
              <div v-if="matchedDailySlots" class="inline-block px-3 py-1 rounded-full text-[12px] font-bold mb-5 border" style="background: rgba(52, 199, 89, 0.06); border-color: rgba(52, 199, 89, 0.12); color: #34c759;">+1 Cupo Ganado</div>
              <button @click="restartTrivia" class="btn text-[15px] mx-auto block text-white font-semibold shadow-lg shadow-emerald-500/20" style="background: #34c759;">Aceptar</button>
            </div>

            <div v-else-if="triviaState === 'wrong'" class="glass rounded-2xl p-6 text-center">
              <div class="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center border" style="background: rgba(0, 0, 0, 0.04); border-color: rgba(0, 0, 0, 0.06);">
                <svg class="w-7 h-7" style="color: var(--text-muted);" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </div>
              <h3 class="text-[17px] font-bold mb-1" style="color: var(--text-primary); font-family: 'Comfortaa', sans-serif;">Incorrecto</h3>
              <p class="text-[13px] mb-5" style="color: var(--text-secondary);">La correcta era: <strong>{{ currentQuestion?.options[currentQuestion?.answerIdx] }}</strong></p>
              <button @click="restartTrivia" class="btn text-[15px] mx-auto block text-white font-semibold bg-zinc-500 hover:bg-zinc-600 shadow-md">Aceptar</button>
            </div>

            <div v-else class="glass rounded-2xl p-6 text-center">
              <div class="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center border" style="background: rgba(245, 158, 11, 0.08); border-color: rgba(245, 158, 11, 0.15);">
                <svg class="w-7 h-7 text-amber-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>
              </div>
              <h3 class="text-[17px] font-bold mb-1" style="color: var(--text-primary); font-family: 'Comfortaa', sans-serif;">Desafío de Pareja</h3>
              <p class="text-[13px] mb-5 px-2" style="color: var(--text-secondary);">Responde en 15 segundos sin salir de la app para ganar cupos extra.</p>
              <button @click="startTrivia" class="btn-primary text-[15px] mx-auto block">Comenzar</button>
            </div>
          </div>
        </div>

        <!-- ═══ EXPLORE ═══ -->
        <div v-if="currentTab === 'explore'">
          <div class="mb-5">
            <h2 class="text-[22px] font-bold tracking-tight" style="color: var(--text-primary); font-family: 'Comfortaa', sans-serif;">Explorar</h2>
            <p class="text-[13px] font-medium" style="color: var(--text-secondary);">Ideas de citas cerca de ti</p>
          </div>

          <!-- Buscador de Ideas (Glassmorphism design matching system input-field) -->
          <div class="relative mb-4">
            <input v-model="searchQuery" type="text" placeholder="Buscar ideas (lugar, descripción, tags)..." class="input-field w-full pl-10 pr-4 py-2.5 text-[14px] focus:outline-none" />
            <div class="absolute left-3.5 top-3 flex items-center">
              <svg class="w-4 h-4" style="color: var(--text-muted);" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
          </div>

          <!-- Filtro de Ciudades dinámico -->
          <div class="flex gap-2.5 overflow-x-auto pb-4 scrollbar-none mb-2">
            <button v-for="city in nearbyCities" :key="city" 
                    @click="selectedCity = city"
                    :class="['btn-sm transition-all active:scale-90 flex items-center gap-1.5 shrink-0', selectedCity === city ? 'btn-primary' : 'btn-ghost']">
              <svg v-if="city !== 'Todas' && selectedCity === city" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {{ city }}
            </button>
          </div>

          <!-- Tarjetas de Exploración filtradas -->
          <div class="space-y-3">
            <div v-for="exp in filteredExploreList" :key="exp.id" class="glass rounded-2xl p-4">
              <div class="flex items-center justify-between mb-2.5">
                <span class="px-2.5 py-1 rounded-lg text-[11px] font-medium" style="background: var(--fill); color: var(--text-secondary);">{{ exp.tag }}</span>
                <div class="flex items-center gap-2">
                  <span class="text-[12px] font-medium" style="color: var(--text-muted);">{{ exp.created_at ? formatRelativeTime(exp.created_at) : 'Hace un momento' }}</span>
                  <!-- Botón Rápido de Borrado de Admin (Solo visible si currentUser.is_admin) -->
                  <button v-if="currentUser && currentUser.is_admin" @click="adminDeleteExploreDate(exp.id)" class="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-90 cursor-pointer flex items-center justify-center" title="Eliminar Cita (Moderación Admin)">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  </button>
                </div>
              </div>
              <h4 class="text-[15px] font-bold mb-0.5" style="color: var(--text-primary); font-family: 'Comfortaa', sans-serif;">{{ exp.location }}</h4>
              <p class="text-[12px] font-medium flex items-center gap-1 mb-3" style="color: var(--text-secondary);">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {{ exp.city }}
              </p>
              <p class="text-[13px] italic leading-relaxed py-3 px-3.5 rounded-xl" style="background: var(--fill); color: var(--text-secondary);">"{{ exp.description }}"</p>
              <div class="flex justify-between items-center mt-3 pt-3" style="border-top: 1px solid var(--border-subtle);">
                <span class="text-[12px] font-medium" style="color: var(--text-muted);">Pareja Anónima</span>
                
                <div class="flex items-center gap-3">
                  <!-- Botón de Dar/Quitar Like con corazón interactivo -->
                  <button @click="toggleLike(exp.id)" class="flex items-center gap-1 hover:bg-[var(--accent-soft)] transition-colors active:scale-75 cursor-pointer py-1 px-1.5 rounded-xl">
                    <svg class="w-[18px] h-[18px] transition-all duration-300" 
                         :class="[isLiked(exp.id) ? 'text-[var(--accent)] fill-current scale-110' : 'text-[#9fa6b1] fill-none']" 
                         stroke="currentColor" 
                         stroke-width="2" 
                         viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    <span v-if="exp.likes_count > 1" class="text-[12px] font-bold" :class="[isLiked(exp.id) ? 'text-[var(--accent)]' : 'text-[#9fa6b1]']">
                      {{ exp.likes_count }}
                    </span>
                  </button>

                  <!-- Botón Reportar (Kanban 1.4) -->
                  <button @click="handleReportDate(exp.id)" class="flex items-center gap-1 text-[11px] font-medium text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors active:scale-90 cursor-pointer py-1 px-2 rounded-xl" title="Reportar contenido inapropiado">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                    </svg>
                    <span>Reportar</span>
                  </button>

                  <!-- Nota promedio -->
                  <div class="flex items-center gap-1 text-[12px] font-bold text-amber-500">
                    <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    {{ exp.avgStars }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ═══ SETTINGS ═══ -->
        <div v-if="currentTab === 'settings'">
          <h2 class="text-[22px] font-bold tracking-tight mb-5" style="color: var(--text-primary); font-family: 'Comfortaa', sans-serif;">Ajustes</h2>

          <div class="glass rounded-2xl p-5 mb-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-11 h-11 rounded-xl flex items-center justify-center" style="background: var(--accent-soft);">
                  <svg class="w-5 h-5" style="color: var(--accent);" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
                </div>
                <div>
                  <h3 class="text-[15px] font-bold" style="color: var(--text-primary); font-family: 'Comfortaa', sans-serif;">Tu Vínculo</h3>
                  <p class="text-[12px] font-semibold m-0 flex items-center gap-1.5 mt-0.5 text-emerald-500">
                    <span class="w-[6px] h-[6px] bg-emerald-500 rounded-full"></span>
                    Activo con {{ partnerName }}
                  </p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-[9px] font-bold uppercase tracking-wider mb-0.5" style="color: var(--text-muted);">Tu Código</p>
                <span class="text-[12px] font-mono font-bold bg-black/5 px-2.5 py-1.5 rounded-lg select-all" style="color: var(--text-primary);">{{ currentUser?.invite_code }}</span>
              </div>
            </div>
          </div>

          <!-- Scrapbook Digital -->
          <div class="glass rounded-2xl p-5 mb-4">
            <div class="flex items-center gap-2.5 mb-2">
              <div class="w-9 h-9 rounded-xl flex items-center justify-center" style="background: var(--fill);">
                <svg class="w-[18px] h-[18px]" style="color: var(--text-secondary);" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 016.5 17H20M4 4.5A2.5 2.5 0 016.5 2H20v20H6.5a2.5 2.5 0 01-2.5-2.5V4.5z"/></svg>
              </div>
              <h3 class="text-[15px] font-bold" style="color: var(--text-primary); font-family: 'Comfortaa', sans-serif;">Scrapbook Digital</h3>
            </div>
            <p class="text-[13px] mb-4 leading-relaxed" style="color: var(--text-secondary);">PDF con sus fotos y recuerdos, listo para imprimir.</p>
            <button @click="buyPDF" class="btn-soft w-full text-[15px]">Generar PDF</button>
          </div>

          <!-- Tienda / Premium (Efecto Señuelo & Neuroventas) -->
          <div class="rounded-2xl p-5 mb-4 relative overflow-hidden text-white border border-white/20 shadow-xl" style="background-color: #ff4c70;">
            <div class="flex items-center justify-between mb-2">
              <p class="text-[0.65rem] font-black uppercase tracking-widest text-white/80">Tienda de Recuerdos</p>
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-white text-[#ff4c70] shadow-sm flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>Oferta Cómplice</span>
              </span>
            </div>
            <h3 class="text-[18px] font-extrabold mb-1" style="font-family: 'Comfortaa', sans-serif;">¿Necesitas más espacio?</h3>
            <p class="text-[13px] mb-4 leading-relaxed text-white/90 font-medium">Guarda todas sus citas en la bitácora sin preocuparte por el límite mensual.</p>
            
            <div v-if="loadingPayment" class="bg-black/30 rounded-xl p-3 mb-3 text-center flex items-center justify-center gap-2.5 text-white font-bold text-[13px] border border-white/30 animate-pulse">
              <svg class="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              <span>Conectando de forma segura con MercadoPago...</span>
            </div>

            <div class="flex flex-col gap-3">
              <!-- Opción Estrella (Señuelo irresistible · 50% DCTO) -->
              <div @click="buySlots('slots_10')" :class="{'opacity-60 pointer-events-none': loadingPayment}" class="cursor-pointer group relative rounded-xl p-3.5 border-2 border-white bg-black/20 hover:bg-black/30 transition-all shadow-lg active:scale-[0.99]">
                <div class="absolute -top-2.5 right-3 bg-white text-[#ff4c70] text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1">
                  <svg class="w-3 h-3 text-[#ff4c70]" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path stroke-linecap="round" stroke-linejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg>
                  <span>MÁS VENDIDO · AHORRAS 50%</span>
                </div>
                <div class="flex items-center justify-between mt-1">
                  <div>
                    <div class="text-[14px] font-bold text-white group-hover:text-white/90 transition-colors">Bolsa Estrella (+10 Citas)</div>
                    <div class="text-[11px] text-white/90 font-semibold flex items-center gap-1 mt-0.5">
                      <span>¡Apenas $499 por recuerdo!</span>
                      <svg class="w-3.5 h-3.5 text-amber-300 inline" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd" /></svg>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-[16px] font-black text-white">$4.990 <span class="text-[10px] font-normal text-white/80">CLP</span></div>
                  </div>
                </div>
              </div>

              <!-- Opción Apuro (Señuelo alto costo unitario) -->
              <div @click="buySlots('slots_2')" :class="{'opacity-60 pointer-events-none': loadingPayment}" class="cursor-pointer group rounded-xl p-3 border border-white/30 bg-black/10 hover:bg-black/20 transition-all active:scale-[0.99]">
                <div class="flex items-center justify-between">
                  <div>
                    <div class="text-[13px] font-bold text-white">Bolsa de Apuro (+2 Citas)</div>
                    <div class="text-[11px] text-white/75 font-medium">$995 por recuerdo</div>
                  </div>
                  <div class="text-right">
                    <div class="text-[14px] font-bold text-white">$1.990 <span class="text-[10px] font-normal text-white/75">CLP</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Panel de Control Administrador (Red themed Premium style card) -->
          <div v-if="currentUser?.is_admin" class="rounded-2xl p-5 mb-4 relative overflow-hidden text-white border border-white/10" style="background: linear-gradient(135deg, rgba(185, 28, 28, 0.85) 0%, rgba(127, 29, 29, 0.98) 100%); backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px);">
            <div class="absolute -right-6 -bottom-6 w-32 h-32 rounded-full" style="background: radial-gradient(circle, rgba(239, 68, 68, 0.4), transparent); opacity: 0.8;"></div>
            <p class="text-[0.65rem] font-bold uppercase tracking-widest mb-3 text-white/40">Administrador</p>
            <h3 class="text-[17px] font-bold mb-1" style="font-family: 'Comfortaa', sans-serif;">Panel de Control</h3>
            <p class="text-[13px] mb-4 leading-relaxed text-white/60">Gestiona parejas, asigna planes de prueba o actualiza cupos mensuales.</p>
            <button @click="openAdminModal" class="btn w-full text-[15px] font-bold" style="background: #1a1a2e; color: white; box-shadow: 0 10px 25px rgba(0,0,0,0.25);">Abrir Panel Admin</button>
          </div>

          <!-- Cerrar Sesión -->
          <div class="glass rounded-2xl p-5 mb-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-11 h-11 rounded-xl flex items-center justify-center" style="background: var(--fill);">
                  <svg class="w-5 h-5" style="color: var(--text-secondary);" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                </div>
                <div>
                  <h3 class="text-[15px] font-bold" style="color: var(--text-primary); font-family: 'Comfortaa', sans-serif;">Cerrar Sesión</h3>
                  <p class="text-[12px] m-0" style="color: var(--text-muted);">Salir de tu cuenta actual.</p>
                </div>
              </div>
              <button @click="logOut" class="btn btn-ghost btn-sm text-[12px] py-1.5 px-3">Salir</button>
            </div>
          </div>

          <!-- Divider line to visually isolate the Danger Zone -->
          <div class="my-6 border-t" style="border-color: var(--border-subtle);"></div>

          <!-- Danger Zone: Delete Account / Derecho al Olvido -->
          <div class="glass rounded-2xl p-5 mb-4">
            <p class="text-[0.65rem] font-bold uppercase tracking-wider mb-2" style="color: var(--text-muted);">Eliminar Cuenta</p>
            <p class="text-[13px] mb-4 leading-relaxed" style="color: var(--text-secondary);">Derecho al Olvido — Esta acción borra tu usuario y acceso de forma definitiva. Los recuerdos de la bitácora compartida permanecerán protegidos en la cuenta de tu pareja para resguardar su historia.</p>
            <button @click="handleDeleteMyAccount"
              class="w-full text-[13px] font-semibold transition-all active:scale-95 btn"
              style="background: rgba(255,59,48,0.08); color: #ff3b30;">
              Eliminar mi cuenta y datos
            </button>
          </div>

          <!-- Danger Zone: Unpair option -->
          <div class="glass rounded-2xl p-5 mb-6">
            <p class="text-[0.65rem] font-bold uppercase tracking-wider mb-2" style="color: var(--text-muted);">Desvincularse</p>
            
            <div v-if="unpairState === 'idle'">
              <p class="text-[13px] mb-4 leading-relaxed" style="color: var(--text-secondary);">Esto borrará toda sus recuerdos en la applicación. Ambos deben estar de acuerdo. Tu pareja tiene 5 días para aceptar.</p>
              <button @click="handleUnpairRequest"
                class="w-full text-[13px] font-semibold transition-all active:scale-95 btn"
                style="background: rgba(255,59,48,0.08); color: #ff3b30;">
                Solicitar Desvinculación
              </button>
            </div>

            <div v-else-if="unpairState === 'pending'">
              <!-- If initiated by current user -->
              <div v-if="unpairRequestedBy === currentUser.id">
                <p class="text-[13px] mb-4 leading-relaxed font-medium text-amber-600 animate-pulse">
                  Solicitud enviada. Tu pareja tiene hasta {{ unpairDaysLeft }} días para aceptar.
                </p>
                <button @click="handleCancelUnpair"
                  class="w-full text-[13px] font-semibold transition-all active:scale-95 btn"
                  style="background: rgba(0,0,0,0.05); color: var(--text-primary);">
                  Cancelar Solicitud
                </button>
              </div>
              
              <!-- If initiated by partner -->
              <div v-else>
                <p class="text-[13px] mb-4 leading-relaxed font-semibold text-red-500">
                  Tu pareja ha solicitado desvincularse. Te quedan {{ unpairDaysLeft }} días para responder.
                </p>
                <div class="flex gap-2">
                  <button @click="handleConfirmUnpair"
                    class="flex-1 text-[13px] font-semibold transition-all active:scale-95 btn text-white"
                    style="background: var(--accent);">
                    Aceptar
                  </button>
                  <button @click="handleCancelUnpair"
                    class="flex-1 text-[13px] font-semibold transition-all active:scale-95 btn"
                    style="background: rgba(0,0,0,0.05); color: var(--text-primary);">
                    Rechazar
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Escudo Legal y Cumplimiento (Términos / Privacidad) -->
          <div class="glass rounded-2xl p-4 mb-6 text-center border border-white/15">
            <p class="text-[11px] font-semibold mb-3" style="color: var(--text-muted);">Información y Acuerdos Legales</p>
            <div class="flex flex-wrap items-center justify-center gap-2.5">
              <router-link to="/terms" class="text-[10px] font-lightbold text-black px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all">
                <svg class="w-3.5 h-3.5 text-black" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span class="text-black">Términos y Condiciones</span>
              </router-link>
              <router-link to="/privacy" class="text-[10px] font-lightbold text-black px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all">
                <svg class="w-3.5 h-3.5 text-black" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span class="text-black">Política de Privacidad</span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </ion-content>

    <!-- Date Modal -->
    <div v-if="showDateModal" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
      <div @click="closeDateModal" class="absolute inset-0 bg-black/25 backdrop-blur-md"></div>
      <div class="relative w-full max-w-md glass-modal sm:rounded-2xl rounded-t-[2.2rem] shadow-2xl overflow-hidden animate-slide-up max-h-[90vh] flex flex-col">
        <!-- iOS Sheet Grabber -->
        <div class="w-12 h-1.5 bg-black/10 rounded-full mx-auto my-3 shrink-0"></div>

        <div class="px-5 pb-3 flex justify-between items-center" style="border-bottom: 1px solid var(--border-subtle);">
          <button @click="closeDateModal" class="text-[15px] font-medium transition-all active:scale-95" style="color: var(--text-secondary);">Cancelar</button>
          <h3 class="text-[16px] font-bold m-0 flex items-center gap-1.5" style="color: var(--text-primary); font-family: 'Comfortaa', sans-serif;">
            Nueva Cita
            <svg class="w-3.5 h-3.5 text-red-500 fill-current animate-pulse" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          </h3>
          <button @click="submitNewDate" :disabled="isSubmitting" class="text-[15px] font-bold transition-all disabled:opacity-50 disabled:active:scale-100 active:scale-95" style="color: var(--accent);">
            {{ isSubmitting ? 'Guardando...' : 'Guardar' }}
          </button>
        </div>
        <div class="p-5 overflow-y-auto flex-1 space-y-4">
          <div>
            <label class="text-[0.65rem] font-bold uppercase tracking-wider pl-1 mb-1.5 flex items-center justify-between" style="color: var(--text-muted);">
              <span>Título</span>
              <span class="text-[9px] lowercase font-normal italic text-[var(--text-muted)]">obligatorio</span>
            </label>
            <input id="create-location-input" v-model="newDate.location" type="text" placeholder="Cafetería, Cine, Playa..." class="input-field w-full px-4 py-3.5 text-[15px] focus:outline-none" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-[0.65rem] font-bold uppercase tracking-wider pl-1 mb-1.5 block" style="color: var(--text-muted);">Ciudad</label>
              <input v-model="newDate.city" type="text" placeholder="Villa Alemana" class="input-field w-full px-4 py-3.5 text-[15px] focus:outline-none" />
            </div>
            <div>
              <label class="text-[0.65rem] font-bold uppercase tracking-wider pl-1 mb-1.5 block" style="color: var(--text-muted);">Fecha</label>
              <input v-model="newDate.date" type="date" class="input-field w-full px-4 py-3.5 text-[15px] focus:outline-none" />
            </div>
          </div>
          <div>
            <label class="text-[0.65rem] font-bold uppercase tracking-wider pl-1 mb-2 block" style="color: var(--text-muted);">Tags</label>
            <div class="flex flex-wrap gap-2">
              <button v-for="t in availableTags" :key="t" @click="toggleTag(t)"
                :class="['btn-sm transition-all active:scale-90', newDate.tags.includes(t) ? 'btn-primary' : 'btn-ghost']">
                {{ t }}
              </button>
            </div>
          </div>
          <div class="rounded-xl p-4 space-y-3 border" style="background: rgba(255, 55, 95, 0.03); border-color: rgba(255, 55, 95, 0.08);">
            <p class="text-[0.65rem] font-bold uppercase tracking-wider m-0" style="color: var(--accent);">Valoraciones</p>
            <div>
              <div class="flex justify-between text-[13px] mb-1">
                <span class="font-medium" style="color: var(--text-primary);">Tu Nota</span>
                <span class="font-bold" style="color: var(--accent);">{{ newDate.rating1 }} ★</span>
              </div>
              <input v-model.number="newDate.rating1" type="range" min="1" max="5" step="0.5" class="w-full accent-[var(--accent)]" />
            </div>
            <div>
              <div class="flex justify-between text-[13px] mb-1">
                <span class="font-medium" style="color: var(--text-primary);">Nota de {{ partnerName }}</span>
                <span class="font-bold" style="color: var(--accent);">{{ newDate.rating2 }} ★</span>
              </div>
              <input v-model.number="newDate.rating2" type="range" min="1" max="5" step="0.5" class="w-full accent-[var(--accent)]" />
            </div>
          </div>
          <div>
            <label class="text-[0.65rem] font-bold uppercase tracking-wider pl-1 mb-1.5 block" style="color: var(--text-muted);">Foto</label>
            <input type="file" ref="createFileInput" accept="image/*" class="hidden" @change="e => handlePhotoUpload(e, 'create')" />
            <div @click="triggerPhotoUpload('create')" class="input-field overflow-hidden relative cursor-pointer hover:bg-white/80 transition-all flex flex-col items-center justify-center min-h-[96px] p-2" style="border-style: dashed; border-color: rgba(0,0,0,0.15);">
              <template v-if="newDate.photo_url">
                <img :src="newDate.photo_url" class="absolute inset-0 w-full h-full object-cover" />
                <div class="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <span class="text-white text-[12px] font-bold">Cambiar foto</span>
                </div>
              </template>
              <template v-else>
                <svg class="w-6 h-6 mb-1" style="color: var(--text-muted);" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
                <span class="text-[13px] font-medium" style="color: var(--text-muted);">Subir foto</span>
              </template>
            </div>
          </div>
          <div>
            <label class="text-[0.65rem] font-bold uppercase tracking-wider pl-1 mb-1.5 flex items-center justify-between" style="color: var(--text-muted);">
              <span>Descripción</span>
              <span class="text-[9px] lowercase font-normal italic text-[var(--text-muted)]">obligatoria</span>
            </label>
            <textarea v-model="newDate.description" rows="3" placeholder="¿Qué recuerdan de este momento?" class="input-field w-full p-4 text-[15px] focus:outline-none resize-none"></textarea>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Date Modal -->
    <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
      <div @click="closeEditModal" class="absolute inset-0 bg-black/25 backdrop-blur-md"></div>
      <div class="relative w-full max-w-md glass-modal sm:rounded-2xl rounded-t-[2.2rem] shadow-2xl overflow-hidden animate-slide-up max-h-[90vh] flex flex-col">
        <!-- iOS Sheet Grabber -->
        <div class="w-12 h-1.5 bg-black/10 rounded-full mx-auto my-3 shrink-0"></div>

        <div class="px-5 pb-3 flex justify-between items-center" style="border-bottom: 1px solid var(--border-subtle);">
          <button @click="closeEditModal" class="text-[15px] font-medium transition-all active:scale-95" style="color: var(--text-secondary);">Cancelar</button>
          <h3 class="text-[16px] font-bold m-0 flex items-center gap-1.5" style="color: var(--text-primary); font-family: 'Comfortaa', sans-serif;">
            Editar Cita
            <svg class="w-3.5 h-3.5 text-red-500 fill-current animate-pulse" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          </h3>
          <button @click="submitEditDate" class="text-[15px] font-bold transition-all active:scale-95" style="color: var(--accent);">Guardar</button>
        </div>
        <div class="p-5 overflow-y-auto flex-1 space-y-4">
          <div>
            <label class="text-[0.65rem] font-bold uppercase tracking-wider pl-1 mb-1.5 flex items-center justify-between" style="color: var(--text-muted);">
              <span>Lugar / Título</span>
              <span class="text-[9px] lowercase font-normal italic text-[var(--text-muted)]">obligatoria</span>
            </label>
            <input id="edit-location-input" v-model="editingDate.location" type="text" placeholder="Cafetería, Cine, Playa..." class="input-field w-full px-4 py-3.5 text-[15px] focus:outline-none" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-[0.65rem] font-bold uppercase tracking-wider pl-1 mb-1.5 block" style="color: var(--text-muted);">Ciudad</label>
              <input v-model="editingDate.city" type="text" class="input-field w-full px-4 py-3.5 text-[15px] focus:outline-none" />
            </div>
            <div>
              <label class="text-[0.65rem] font-bold uppercase tracking-wider pl-1 mb-1.5 block" style="color: var(--text-muted);">Fecha</label>
              <input v-model="editingDate.date" type="date" class="input-field w-full px-4 py-3.5 text-[15px] focus:outline-none" />
            </div>
          </div>
          <div>
            <label class="text-[0.65rem] font-bold uppercase tracking-wider pl-1 mb-2 block" style="color: var(--text-muted);">Tags</label>
            <div class="flex flex-wrap gap-2">
              <button v-for="t in availableTags" :key="t" @click="() => {
                const i = editingDate.tags.indexOf(t);
                i > -1 ? editingDate.tags.splice(i, 1) : editingDate.tags.push(t);
              }"
                :class="['btn-sm transition-all active:scale-90', editingDate.tags.includes(t) ? 'btn-primary' : 'btn-ghost']">
                {{ t }}
              </button>
            </div>
          </div>
          <div class="rounded-xl p-4 space-y-3 border" style="background: rgba(255, 55, 95, 0.03); border-color: rgba(255, 55, 95, 0.08);">
            <p class="text-[0.65rem] font-bold uppercase tracking-wider m-0" style="color: var(--accent);">Valoraciones</p>
            <div>
              <div class="flex justify-between text-[13px] mb-1">
                <span class="font-medium" style="color: var(--text-primary);">Tu Nota</span>
                <span class="font-bold" style="color: var(--accent);">{{ editingDate.rating1 }} ★</span>
              </div>
              <input v-model.number="editingDate.rating1" type="range" min="1" max="5" step="0.5" class="w-full accent-[var(--accent)]" />
            </div>
            <div>
              <div class="flex justify-between text-[13px] mb-1">
                <span class="font-medium" style="color: var(--text-primary);">Nota de {{ partnerName }}</span>
                <span class="font-bold" style="color: var(--accent);">{{ editingDate.rating2 }} ★</span>
              </div>
              <input v-model.number="editingDate.rating2" type="range" min="1" max="5" step="0.5" class="w-full accent-[var(--accent)]" />
            </div>
          </div>
          <div>
            <label class="text-[0.65rem] font-bold uppercase tracking-wider pl-1 mb-1.5 block" style="color: var(--text-muted);">Foto</label>
            <input type="file" ref="editFileInput" accept="image/*" class="hidden" @change="e => handlePhotoUpload(e, 'edit')" />
            <div @click="triggerPhotoUpload('edit')" class="input-field overflow-hidden relative cursor-pointer hover:bg-white/80 transition-all flex flex-col items-center justify-center min-h-[96px] p-2" style="border-style: dashed; border-color: rgba(0,0,0,0.15);">
              <template v-if="editingDate.photo_url">
                <img :src="editingDate.photo_url" class="absolute inset-0 w-full h-full object-cover" />
                <div class="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <span class="text-white text-[12px] font-bold">Cambiar foto</span>
                </div>
              </template>
              <template v-else>
                <svg class="w-6 h-6 mb-1" style="color: var(--text-muted);" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
                <span class="text-[13px] font-medium" style="color: var(--text-muted);">Subir foto</span>
              </template>
            </div>
          </div>
          <div>
            <label class="text-[0.65rem] font-bold uppercase tracking-wider pl-1 mb-1.5 flex items-center justify-between" style="color: var(--text-muted);">
              <span>Descripción</span>
              <span class="text-[9px] lowercase font-normal italic text-[var(--text-muted)]">obligatoria</span>
            </label>
            <textarea v-model="editingDate.description" rows="3" placeholder="¿Qué recuerdan de este momento?" class="input-field w-full p-4 text-[15px] focus:outline-none resize-none"></textarea>
          </div>
          <div class="pt-2">
            <button @click="deleteDate" class="btn-danger w-full text-[15px]">
              Eliminar Cita
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Admin Dashboard Modal -->
    <AdminModal v-if="showAdminModal"
      :user-couple-id="userCoupleId"
      :current-user-id="currentUser?.id"
      @close="closeAdminModal"
      @update-slots="(newSlots) => maxSlots = newSlots"
    />

    <!-- Floating Slots Tooltip (Positioned globally with high z-index to escape shadow DOM clipping and overlay under bitacora) -->
    <div v-if="showSlotsTooltip" 
         class="fixed z-[9999] w-48 p-3 rounded-2xl glass text-[11px] leading-snug font-semibold text-center flex items-center justify-center gap-1.5 border border-white/60 animate-tooltip-in" 
         style="top: 75px; right: 20px; background: rgba(255,255,255,0.95); backdrop-filter: blur(25px); color: var(--text-primary); pointer-events: none; box-shadow: 0 8px 25px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.02);">
      <!-- Tiny upward triangle pointer -->
      <div class="absolute -top-[5px] right-6 w-2.5 h-2.5 bg-white border-t border-l border-white/60 rotate-45" style="background: rgba(255,255,255,0.95);"></div>
      
      <span>Cupos de citas para ingresar al mes</span>
      <svg class="w-3.5 h-3.5 text-red-500 fill-current animate-pulse shrink-0" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
    </div>

    <!-- Floating Streak Tooltip -->
    <div v-if="showStreakTooltip" 
         class="fixed z-[9999] w-64 p-4 rounded-2xl glass text-[11px] leading-relaxed font-medium text-left space-y-2.5 border border-white/60 animate-tooltip-in" 
         style="top: 75px; right: 80px; background: rgba(255,255,255,0.95); backdrop-filter: blur(25px); color: var(--text-primary); box-shadow: 0 8px 25px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.02);">
      <!-- Tiny upward triangle pointer -->
      <div class="absolute -top-[5px] right-8 w-2.5 h-2.5 bg-white border-t border-l border-white/60 rotate-45" style="background: rgba(255,255,255,0.95);"></div>
      
      <div class="flex items-center justify-between">
        <span class="font-bold text-[13px] text-[#ff9500] flex items-center gap-1.5" style="font-family: 'Comfortaa', sans-serif;">
          <svg class="w-4 h-4 fill-current animate-bounce" viewBox="0 0 24 24"><path d="M17.55 11.2c-.23-.3-.5-.56-.8-.77-.45-.33-1-.54-1.55-.66-.45-.1-.9-.13-1.35-.1-.45.03-.9.13-1.33.28-.43.15-.83.37-1.2.65-.73.55-1.35 1.25-1.8 2.05-.18-.28-.38-.55-.6-.8-.43-.5-.94-.94-1.52-1.3-.57-.36-1.18-.63-1.82-.8-.64-.17-1.3-.23-1.96-.18-.66.05-1.3.2-1.92.45-.62.25-1.2.6-1.7 1.03C1.65 13.06 3.03 16.5 5.14 18.6 7.25 20.7 10.7 22.08 14.15 21c3.45-1.08 6.03-4.08 6.85-7.53.2-1.02.14-2.07-.15-3.07-.3-1-.8-1.92-1.48-2.72z"/></svg>
          Racha de Amor: {{ loveStreak }} días
        </span>
        <button @click="showStreakTooltip = false" class="text-[var(--text-muted)] hover:text-black font-bold p-1">✕</button>
      </div>
      <div class="flex items-center justify-between p-2 rounded-xl bg-amber-50/80 border border-amber-200/60">
        <div class="flex items-center p-1">
          <span class="text-amber-600 font-extrabold text-[12px]">★</span>
        </div>
        <span class="text-[10px] text-amber-800 font-bold leading-tight">
          ¡Cada 7 días de racha se premia con un cupo de cita en tu ahorro!
        </span>
      </div>

      <!-- Piggy Bank Claim Card -->
      <div v-if="unclaimedStreakRewards > 0" class="p-2.5 rounded-xl bg-gradient-to-r from-pink-500/15 to-violet-500/15 border border-pink-300/60 space-y-2">
        <div class="flex items-center justify-between text-[11px] font-bold text-pink-700">
          <span class="flex items-center gap-1.5">
            <svg class="w-4 h-4 text-pink-600 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/></svg>
            <span>Recompensas disponibles: {{ unclaimedStreakRewards }}</span>
          </span>
        </div>
        
        <!-- Bulk vs Single Claim Buttons -->
        <div v-if="unclaimedStreakRewards > 1" class="flex flex-col gap-1.5 pt-0.5">
          <button @click="claimStreakReward('all')" :disabled="claimingReward" class="w-full py-1.5 px-2 rounded-xl btn-primary text-white font-extrabold text-[11px] shadow-sm active:scale-95 transition-transform flex items-center justify-center gap-1">
            <svg v-if="claimingReward" class="w-3.5 h-3.5 animate-spin shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="10"/></svg>
            <svg v-else class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            <span>{{ claimingReward ? 'Reclamando...' : `Reclamar Todo (+${unclaimedStreakRewards} Cupos)` }}</span>
          </button>
          <button @click="claimStreakReward(1)" :disabled="claimingReward" class="w-full py-1 px-2 rounded-lg bg-pink-100/80 hover:bg-pink-200 text-pink-800 font-bold text-[10px] transition-colors flex items-center justify-center gap-1">
            <span>Reclamar de a 1 (+1 Cupo)</span>
          </button>
        </div>
        <button v-else @click="claimStreakReward(1)" :disabled="claimingReward" class="w-full py-2 px-2.5 rounded-xl btn-primary text-white font-extrabold text-[11px] shadow-sm active:scale-95 transition-transform flex items-center justify-center gap-1.5">
          <svg v-if="claimingReward" class="w-3.5 h-3.5 animate-spin shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="10"/></svg>
          <svg v-else class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
          <span>{{ claimingReward ? 'Reclamando...' : 'Reclamar +1 Cupo al Mes' }}</span>
        </button>
      </div>

      <!-- Streak At Risk Section -->
      <div v-if="isStreakAtRisk" class="pt-2 border-t border-black/5 space-y-1.5">
        <p class="text-[10px] text-red-500 font-bold leading-tight m-0">¡Tu racha anterior de {{ previousStreak }} días está congelada!</p>
        
        <!-- Option 1: Rescue using 10 accumulated rewards (Discovered when achieved) -->
        <button v-if="unclaimedStreakRewards >= 10" @click="rescueStreakWithRewards" :disabled="rescuingWithRewards" class="w-full py-2 px-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-[11px] shadow-md active:scale-95 transition-transform flex items-center justify-center gap-1.5">
          <svg v-if="rescuingWithRewards" class="w-3.5 h-3.5 animate-spin shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="10"/></svg>
          <svg v-else class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/></svg>
          <span>{{ rescuingWithRewards ? 'Salvando...' : 'Recuperar Racha Gratis (Canjear 10)' }}</span>
        </button>

        <!-- Option 2: Rescue with $1.990 -->
        <button @click="rescueStreak" class="w-full py-2 px-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-[#ff4c70] text-white font-extrabold text-[11px] shadow-md active:scale-95 transition-transform flex items-center justify-center gap-1.5">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          <span>Salvar Racha + 2 Citas ($1.990)</span>
        </button>
      </div>
    </div>

    <!-- Floating Liquid Glass Tab Bar -->
    <div class="fixed bottom-6 left-4 right-4 z-30 max-w-md mx-auto py-2 px-3 flex items-center justify-around rounded-3xl border" style="background: rgba(255,255,255,0.72); backdrop-filter: blur(35px) saturate(200%); -webkit-backdrop-filter: blur(35px) saturate(200%); border-color: rgba(255,255,255,0.55); box-shadow: 0 12px 35px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.02);">
      <button v-for="tab in tabs" :key="tab.id" @click="currentTab = tab.id"
        class="flex flex-col items-center gap-0.5 transition-all duration-300 min-w-[64px] py-1 px-2 active:scale-90"
        :class="currentTab === tab.id ? 'text-[var(--accent)] font-bold' : 'text-[var(--text-secondary)] font-medium'">
        <svg class="w-5 h-5 transition-transform duration-300" :class="currentTab === tab.id ? 'scale-110' : ''" fill="none" stroke="currentColor" :stroke-width="currentTab === tab.id ? '2.2' : '1.5'" viewBox="0 0 24 24" v-html="tab.icon"></svg>
        <span class="text-[9px] uppercase tracking-wider font-bold">{{ tab.label }}</span>
      </button>
    </div>
  </ion-page>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch, defineAsyncComponent } from 'vue';
import { useRouter } from 'vue-router';
import { IonPage, IonHeader, IonToolbar, IonContent } from '@ionic/vue';
import { api, getApiUrl } from '../services/api';
import { io } from 'socket.io-client';
import { usePopup } from '../services/popup';

const AdminModal = defineAsyncComponent(() => import('../components/AdminModal.vue'));

const { showPopup } = usePopup();

const router = useRouter();

const tabs = [
  { id: 'timeline', label: 'Bitácora', icon: '<path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M4 4.5A2.5 2.5 0 016.5 2H20v20H6.5a2.5 2.5 0 01-2.5-2.5V4.5z"/>' },
  { id: 'trivia', label: 'Trivia', icon: '<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>' },
  { id: 'explore', label: 'Explorar', icon: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>' },
  { id: 'settings', label: 'Ajustes', icon: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9c.26.604.852.997 1.51 1H21a2 2 0 010 4h-.09c-.658.003-1.25.396-1.51 1z"/>' },
];


const isSubmitting = ref(false);

const submitNewDate = async () => {
  if (isSubmitting.value) return;
  if (!newDate.value.location || !newDate.value.location.trim()) {
    showPopup('Por favor escribe el título o lugar de la cita.');
    return;
  }
  if (!newDate.value.description || !newDate.value.description.trim()) {
    showPopup('Por favor escribe una descripción de la cita para recordar este momento.');
    return;
  }
  if (!userCoupleId.value) return;

  isSubmitting.value = true;

  try {
    const dateObj = {
      location: newDate.value.location,
      city: newDate.value.city,
      date_time: new Date(newDate.value.date + 'T12:00:00Z').toISOString(),
      description: newDate.value.description,
      rating_user_1: isUser1.value ? newDate.value.rating1 : newDate.value.rating2,
      rating_user_2: isUser1.value ? newDate.value.rating2 : newDate.value.rating1,
      tags: newDate.value.tags,
      photo_url: newDate.value.photo_url || 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80'
    };

    await api.createDate(dateObj);

    if (socket) {
      socket.emit('clear_lock', userCoupleId.value);
    }
    showDateModal.value = false;
    doubleLockState.value = 'idle';
    showHeartOverlay.value = true;
    setTimeout(() => { showHeartOverlay.value = false; }, 2500);

    // Recargar listas desde la BD
    await loadDates();
    await loadExploreDates();

    // Resetear formulario
    newDate.value = { location: '', city: 'Villa Alemana', date: new Date().toISOString().split('T')[0], tags: [], rating1: 5.0, rating2: 5.0, description: '', photo_url: '' };
  } catch (error) {
    alert('Error al guardar la cita: ' + error.message);
  } finally {
    isSubmitting.value = false;
  }
};

const closeDateModal = () => {
  showDateModal.value = false;
  doubleLockState.value = 'idle';
  if (socket) {
    socket.emit('clear_lock', userCoupleId.value);
  }
};
const currentTab = ref('timeline');
const dateSlots = computed(() => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  return datesList.value.filter(date => {
    const d = new Date(date.created_at || date.date_time);
    return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
  }).length;
});
const maxSlots = ref(10);
const loveStreak = ref(0);
const previousStreak = ref(0);
const lastStreakDate = ref(null);
const showStreakTooltip = ref(false);
const unclaimedStreakRewards = ref(0);
const claimingReward = ref(false);
const rescuingWithRewards = ref(false);
const doubleLockState = ref('idle');
const loadingPayment = ref(false);
const showDateModal = ref(false);
const showEditModal = ref(false);
const editingDate = ref({
  id: null,
  location: '',
  city: '',
  date: '',
  description: '',
  rating1: 5.0,
  rating2: 5.0,
  tags: [],
  photo_url: ''
});
const showHeartOverlay = ref(false);
const showMatchCelebration = ref(false);
const showSlotsTooltip = ref(false);
const showQuickActionTooltip = ref(false);
const showTriviaTooltip = ref(false);
const unpairState = ref('idle');
const unpairRequestedBy = ref(null);
const unpairDaysLeft = ref(0);
const availableTags = ['Comida', 'Baile', 'Paseo', 'Cine', 'Naturaleza', 'Playa', 'Cafecito', 'En Casa'];

// Admin Panel state & opening logic (modal component is lazy loaded via AdminModal.vue)
const showAdminModal = ref(false);

const openAdminModal = () => {
  showAdminModal.value = true;
};

const closeAdminModal = () => {
  showAdminModal.value = false;
};

const currentUser = ref(null);
const partnerName = ref('Pareja');
const partnerId = ref(null);
const userCoupleId = ref(null);

const isUser1 = computed(() => {
  if (!currentUser.value || !partnerId.value) return true;
  return currentUser.value.id < partnerId.value;
});

const hasPlayedTriviaToday = computed(() => {
  if (!currentUser.value || !currentUser.value.last_trivia_date) return false;
  const dateStr = currentUser.value.last_trivia_date;
  const dbDateOnly = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
  const todayStr = new Date().toLocaleDateString('sv-SE');
  return dbDateOnly === todayStr;
});

const datesList = ref([]);

const exploreList = ref([
  { id: 1, location: 'Café Color', city: 'Villa Alemana', tag: 'Cafecito', avgStars: 4.8, description: 'El ambiente es genial para conversar y jugar juegos de mesa mientras tomas té de frutos rojos.', likes_count: 5, user_liked: false },
  { id: 2, location: 'Jardín Botánico', city: 'Viña del Mar', tag: 'Naturaleza', avgStars: 4.9, description: 'Hicimos un picnic abajo de los árboles. Muy tranquilo para desconectarse el fin de semana.', likes_count: 12, user_liked: false },
  { id: 3, location: 'La Flor de Chile', city: 'Valparaíso', tag: 'Comida', avgStars: 4.5, description: 'Las mejores chorrillanas de la región. Ideal para ir con hambre.', likes_count: 8, user_liked: false }
]);

const searchQuery = ref('');
const selectedCity = ref('Todas');
const nearbyCities = ref(['Todas', 'Villa Alemana', 'Quilpué', 'Viña del Mar', 'Valparaíso', 'Santiago']);

const localLikes = ref([]);

const toggleLike = async (id) => {
  const item = exploreList.value.find(exp => exp.id === id);
  if (!item) return;

  try {
    const res = await api.likeDate(id);
    item.user_liked = res.liked;
    item.likes_count = res.likes_count !== undefined ? res.likes_count : (res.liked ? ((item.likes_count || 0) + 1) : Math.max(0, (item.likes_count || 0) - 1));
  } catch (error) {
    console.warn('Backend like failed, using local fallback:', error.message);
    const idx = localLikes.value.indexOf(id);
    if (idx > -1) {
      localLikes.value.splice(idx, 1);
      item.user_liked = false;
      item.likes_count = Math.max(0, (item.likes_count || 0) - 1);
    } else {
      localLikes.value.push(id);
      item.user_liked = true;
      item.likes_count = (item.likes_count || 0) + 1;
    }
  }
};

const isLiked = (id) => {
  const item = exploreList.value.find(exp => exp.id === id);
  if (item && item.user_liked !== undefined) {
    return !!item.user_liked;
  }
  return localLikes.value.includes(id);
};

const detectLocation = async () => {
  try {
    const res = await fetch('https://ipapi.co/json/');
    if (res.ok) {
      const data = await res.json();
      if (data && data.city) {
        const city = data.city;
        const region = data.region || '';
        if (['villa alemana', 'viña del mar', 'valparaíso', 'valparaiso', 'quilpué', 'concon', 'concón'].some(c => city.toLowerCase().includes(c) || region.toLowerCase().includes('valparaiso'))) {
          nearbyCities.value = ['Todas', 'Villa Alemana', 'Quilpué', 'Viña del Mar', 'Valparaíso'];
        } else if (city.toLowerCase().includes('santiago') || region.toLowerCase().includes('santiago') || region.toLowerCase().includes('metropolitana')) {
          nearbyCities.value = ['Todas', 'Santiago', 'Providencia', 'Las Condes', 'Ñuñoa'];
        } else if (['concepcion', 'concepción', 'talcahuano', 'biobio', 'bio-bio', 'bío-bío', 'bío bío'].some(c => city.toLowerCase().includes(c) || region.toLowerCase().includes('bio') || region.toLowerCase().includes('bío'))) {
          nearbyCities.value = ['Todas', 'Concepción', 'Talcahuano', 'San Pedro de la Paz', 'Chillán', 'Los Ángeles'];
        }
      }
    }
  } catch (e) {
    console.warn('Geolocation detection failed:', e);
  }
};

const filteredExploreList = computed(() => {
  return exploreList.value.filter(item => {
    if (selectedCity.value !== 'Todas') {
      if (item.city.toLowerCase() !== selectedCity.value.toLowerCase()) {
        return false;
      }
    }
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      const matchesLocation = item.location?.toLowerCase().includes(query);
      const matchesDescription = item.description?.toLowerCase().includes(query);
      const matchesTag = item.tag?.toLowerCase().includes(query);
      const matchesCity = item.city?.toLowerCase().includes(query);
      return matchesLocation || matchesDescription || matchesTag || matchesCity;
    }
    return true;
  });
});

const newDate = ref({ location: '', city: 'Villa Alemana', date: new Date().toISOString().split('T')[0], tags: [], rating1: 5.0, rating2: 5.0, description: '', photo_url: '' });

const detectNearestCity = () => {
  if (typeof navigator !== 'undefined' && navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`);
          const data = await res.json();
          if (data && data.address) {
            const cityName = data.address.city || data.address.town || data.address.village || data.address.county || data.address.state;
            if (cityName) {
              newDate.value.city = cityName;
            }
          }
        } catch (e) {
          console.warn('Geocoding falló, manteniendo ciudad actual:', e);
        }
      },
      (err) => {
        console.warn('Geolocalización no disponible u omitida:', err);
      },
      { timeout: 5000, maximumAge: 600000 }
    );
  }
};

watch(showDateModal, (isOpen) => {
  if (isOpen) {
    detectNearestCity();
  }
});

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return new Intl.DateTimeFormat('es-CL', { day: 'numeric', month: 'short', year: 'numeric' }).format(d);
};

const formatRelativeTime = (dateStr) => {
  if (!dateStr) return 'Hace un momento';
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Hace un momento';
  if (diffMins < 60) return `Hace ${diffMins} min`;
  if (diffHours < 24) return `Hace ${diffHours} hr`;
  return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
};

const getAvgStars = (r1, r2) => {
  const num1 = parseFloat(r1) || 0;
  const num2 = parseFloat(r2) || 0;
  return ((num1 + num2) / 2).toFixed(1);
};

const toggleTag = (tag) => {
  const i = newDate.value.tags.indexOf(tag);
  i > -1 ? newDate.value.tags.splice(i, 1) : newDate.value.tags.push(tag);
};

// WebSocket connection
let socket = null;

// Haptics Heartbeat trigger (lub-dub tactile heartbeat on sync)
const triggerHeartbeatHaptics = () => {
  try {
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate([100, 50, 100]);
    }
    if (window.Capacitor?.Plugins?.Haptics?.impact) {
      window.Capacitor.Plugins.Haptics.impact({ style: 'heavy' });
      setTimeout(() => {
        window.Capacitor.Plugins.Haptics?.impact({ style: 'heavy' });
      }, 150);
    }
  } catch (e) {
    // Ignored on desktop browsers without vibration support
  }
};

const handleFirstLock = () => {
  if (!userCoupleId.value) return;

  if (doubleLockState.value === 'idle') {
    doubleLockState.value = 'waiting';
    triggerHeartbeatHaptics();
    // Send click to partner via WebSocket
    socket.emit('partner_lock', { coupleId: userCoupleId.value, userId: currentUser.value.id });
  } else if (doubleLockState.value === 'waiting_partner') {
    // Partner was already waiting, so it's a match!
    doubleLockState.value = 'matched';
    showMatchCelebration.value = true;
    triggerHeartbeatHaptics();
    
    // Broadcast the match back to the partner
    socket.emit('partner_lock', { coupleId: userCoupleId.value, userId: currentUser.value.id });

    setTimeout(() => {
      showMatchCelebration.value = false;
      doubleLockState.value = 'idle'; // Reset Persona 2 (matcher) to idle
    }, 1800);
  }
};

const cancelLock = () => {
  doubleLockState.value = 'idle';
  if (socket) {
    socket.emit('clear_lock', userCoupleId.value);
  }
};

const simulatePartnerClick = () => {
  // Local fallback simulation
  if (doubleLockState.value === 'waiting') {
    doubleLockState.value = 'matched';
    showMatchCelebration.value = true;
    setTimeout(() => {
      showMatchCelebration.value = false;
      showDateModal.value = true;
    }, 1800);
  }
};

let tooltipTimeout = null;
const toggleSlotsTooltip = () => {
  showSlotsTooltip.value = !showSlotsTooltip.value;
  if (showSlotsTooltip.value) {
    showStreakTooltip.value = false;
  }
  if (tooltipTimeout) clearTimeout(tooltipTimeout);
  if (showSlotsTooltip.value) {
    tooltipTimeout = setTimeout(() => {
      showSlotsTooltip.value = false;
    }, 3500);
  }
};

const toggleStreakTooltip = () => {
  showStreakTooltip.value = !showStreakTooltip.value;
  if (showStreakTooltip.value) {
    showSlotsTooltip.value = false;
  }
};

const isStreakAtRisk = computed(() => {
  if (previousStreak.value <= 0) return false;
  return loveStreak.value === 0 || loveStreak.value < previousStreak.value;
});

const rescueStreak = async () => {
  if (loadingPayment.value) return;
  try {
    loadingPayment.value = true;
    showPopup('Conectando con MercadoPago para salvar tu racha...');
    const res = await api.createPaymentPreference('slots_2', true);
    if (res && res.init_point) {
      window.location.href = res.init_point;
    } else {
      showPopup('No se obtuvo el link de pago.');
      loadingPayment.value = false;
    }
  } catch (err) {
    loadingPayment.value = false;
    showPopup(err.message || 'Error al iniciar pago.');
  }
};

const claimStreakReward = async (amount = 1) => {
  if (claimingReward.value) return;
  claimingReward.value = true;
  try {
    const res = await api.claimStreakReward(amount);
    showPopup(res.message || '¡Recompensas reclamadas con éxito!');
    await fetchProfile();
  } catch (error) {
    showPopup(error.message || 'Error al reclamar recompensa');
  } finally {
    claimingReward.value = false;
  }
};

const rescueStreakWithRewards = async () => {
  if (rescuingWithRewards.value) return;
  rescuingWithRewards.value = true;
  try {
    const res = await api.rescueStreakWithRewards();
    showPopup(res.message || '¡Racha restaurada con tus ahorros de recompensa!');
    await fetchProfile();
  } catch (error) {
    showPopup(error.message || 'Error al recuperar racha con recompensas');
  } finally {
    rescuingWithRewards.value = false;
  }
};

let qaTooltipTimeout = null;
const toggleQuickActionTooltip = () => {
  showQuickActionTooltip.value = !showQuickActionTooltip.value;
  if (qaTooltipTimeout) clearTimeout(qaTooltipTimeout);
  if (showQuickActionTooltip.value) {
    qaTooltipTimeout = setTimeout(() => {
      showQuickActionTooltip.value = false;
    }, 3500);
  }
};

let triviaTooltipTimeout = null;
const toggleTriviaTooltip = () => {
  showTriviaTooltip.value = !showTriviaTooltip.value;
  if (triviaTooltipTimeout) clearTimeout(triviaTooltipTimeout);
  if (showTriviaTooltip.value) {
    triviaTooltipTimeout = setTimeout(() => {
      showTriviaTooltip.value = false;
    }, 3500);
  }
};

const loadDates = async () => {
  try {
    const dates = await api.getDates();
    datesList.value = dates || [];
  } catch (error) {
    console.error('Error cargando citas:', error.message);
  }
};

const loadExploreDates = async () => {
  try {
    const dates = await api.getExploreDates();
    if (dates && dates.length > 0) {
      exploreList.value = dates.map(date => ({
        id: date.id,
        location: date.location,
        city: date.city,
        tag: date.tags && date.tags.length > 0 ? date.tags[0] : 'Cita',
        avgStars: getAvgStars(date.rating_user_1, date.rating_user_2),
        description: date.description || 'Sin descripción...',
        created_at: date.created_at,
        likes_count: date.likes_count || 0,
        user_liked: !!date.user_liked
      }));
    }
  } catch (error) {
    console.error('Error cargando exploración:', error.message);
  }
};

const getEditTimeLeft = (createdAtStr) => {
  if (!createdAtStr) return null;
  const createdDate = new Date(createdAtStr);
  const fiveDaysInMs = 5 * 24 * 60 * 60 * 1000;
  const expiryTime = createdDate.getTime() + fiveDaysInMs;
  const timeLeftMs = expiryTime - Date.now();
  
  if (timeLeftMs <= 0) return null;
  
  const daysLeft = Math.floor(timeLeftMs / (24 * 60 * 60 * 1000));
  const hoursLeft = Math.floor((timeLeftMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  
  if (daysLeft > 0) {
    return `${daysLeft}d ${hoursLeft}h`;
  }
  return `${hoursLeft}h`;
};

const openEditModal = (date) => {
  editingDate.value = {
    id: date.id,
    location: date.location,
    city: date.city,
    date: (() => {
      const localDate = new Date(date.date_time);
      const y = localDate.getFullYear();
      const m = String(localDate.getMonth() + 1).padStart(2, '0');
      const d = String(localDate.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    })(),
    description: date.description || '',
    rating1: isUser1.value ? (parseFloat(date.rating_user_1) || 5.0) : (parseFloat(date.rating_user_2) || 5.0),
    rating2: isUser1.value ? (parseFloat(date.rating_user_2) || 5.0) : (parseFloat(date.rating_user_1) || 5.0),
    tags: [...(date.tags || [])],
    photo_url: date.photo_url || ''
  };
  showEditModal.value = true;
};

let pressTimer = null;

const startPress = (date) => {
  if (!getEditTimeLeft(date.created_at)) return;
  if (pressTimer) clearTimeout(pressTimer);
  pressTimer = setTimeout(() => {
    openEditModal(date);
    pressTimer = null;
  }, 450);
};

const cancelPress = () => {
  if (pressTimer) {
    clearTimeout(pressTimer);
    pressTimer = null;
  }
};

const closeEditModal = () => {
  showEditModal.value = false;
};

const submitEditDate = async () => {
  if (!editingDate.value.location || !editingDate.value.location.trim()) {
    showPopup('Por favor escribe el título o lugar de la cita.');
    return;
  }
  if (!editingDate.value.description || !editingDate.value.description.trim()) {
    showPopup('Por favor escribe una descripción de la cita para recordar este momento.');
    return;
  }
  
  try {
    const updatedObj = {
      location: editingDate.value.location,
      city: editingDate.value.city,
      date_time: new Date(editingDate.value.date + 'T12:00:00').toISOString(),
      description: editingDate.value.description,
      rating_user_1: isUser1.value ? editingDate.value.rating1 : editingDate.value.rating2,
      rating_user_2: isUser1.value ? editingDate.value.rating2 : editingDate.value.rating1,
      tags: editingDate.value.tags,
      photo_url: editingDate.value.photo_url
    };

    await api.updateDate(editingDate.value.id, updatedObj);
    showEditModal.value = false;
    
    await loadDates();
    await loadExploreDates();
  } catch (error) {
    alert('Error al actualizar la cita: ' + error.message);
  }
};

const deleteDate = async () => {
  const confirmDelete = confirm('¿Estás seguro de que quieres eliminar este recuerdo para siempre?');
  if (!confirmDelete) return;

  try {
    await api.deleteDate(editingDate.value.id);
    showEditModal.value = false;
    
    await loadDates();
    await loadExploreDates();
  } catch (error) {
    alert('Error al eliminar la cita: ' + error.message);
  }
};

const adminDeleteExploreDate = async (id) => {
  const confirmDelete = confirm('[MODERACIÓN ADMIN] ¿Estás seguro de que quieres eliminar esta cita del Muro Público para todos los usuarios?');
  if (!confirmDelete) return;

  try {
    await api.deleteDate(id);
    exploreList.value = exploreList.value.filter(item => item.id !== id);
    showPopup('Cita eliminada por moderación administrativa al instante.');
    await loadExploreDates();
  } catch (error) {
    showPopup('Error al eliminar la cita por moderación: ' + (error.message || error));
  }
};

const handleReportDate = async (id) => {
  try {
    await api.reportDate(id);
    exploreList.value = exploreList.value.filter(item => item.id !== id);
    showPopup('Recuerdo reportado al equipo de moderación. Gracias por cuidar la comunidad.');
  } catch (error) {
    showPopup('Error al reportar: ' + (error.message || error));
  }
};

const createFileInput = ref(null);
const editFileInput = ref(null);

const triggerPhotoUpload = (mode) => {
  if (mode === 'create') {
    createFileInput.value?.click();
  } else {
    editFileInput.value?.click();
  }
};

const compressImage = (file, maxWidth = 1024, maxHeight = 1024, quality = 0.7) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      
      // Fill white background for transparent images
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
      
      ctx.drawImage(img, 0, 0, width, height);

      const dataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(dataUrl);
    };
    img.onerror = (err) => {
      reject(err);
    };
  });
};

const handlePhotoUpload = async (event, mode) => {
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    const compressedBase64 = await compressImage(file);
    if (mode === 'create') {
      newDate.value.photo_url = compressedBase64;
    } else {
      editingDate.value.photo_url = compressedBase64;
    }
  } catch (error) {
    console.error('Error compressing image:', error);
    alert('Error al procesar la imagen.');
  }
};

const buySlots = async (packageOrEvent = 'slots_5') => {
  if (loadingPayment.value) return;
  loadingPayment.value = true;
  showPopup('Conectando de forma segura con MercadoPago...');

  const packageId = typeof packageOrEvent === 'string' ? packageOrEvent : 'slots_5';

  try {
    const res = await api.createPaymentPreference(packageId);
    if (res && res.init_point) {
      window.location.href = res.init_point;
    } else {
      loadingPayment.value = false;
      showPopup(res?.error || 'Error al iniciar pago');
    }
  } catch (error) {
    loadingPayment.value = false;
    showPopup(error.message || 'Error al iniciar pago');
  }
};
const buyPDF = async () => {
  try {
    showPopup('Generando PDF... Se iniciará la descarga en breve.');
    await api.downloadPDF();
  } catch (error) {
    showPopup('Error al generar PDF: ' + error.message);
  }
};

const handleUnpairRequest = async () => {
  if (!userCoupleId.value) return;
  const confirmUnpair = confirm('¿Estás seguro de que quieres solicitar la desvinculación de tu pareja? Tu pareja tendrá 5 días para aceptar.');
  if (!confirmUnpair) return;

  try {
    const res = await api.unpair();
    unpairState.value = 'pending';
    unpairRequestedBy.value = currentUser.value.id;
    unpairDaysLeft.value = 5;
    alert(res.message || 'Solicitud de desvinculación enviada.');
  } catch (error) {
    alert('Error al solicitar desvinculación: ' + error.message);
  }
};

const handleCancelUnpair = async () => {
  try {
    const res = await api.cancelUnpair();
    unpairState.value = 'idle';
    unpairRequestedBy.value = null;
    unpairDaysLeft.value = 0;
    alert(res.message || 'Solicitud cancelada con éxito.');
  } catch (error) {
    alert('Error al cancelar solicitud: ' + error.message);
  }
};

const handleConfirmUnpair = async () => {
  const confirmAction = confirm('¿Estás seguro de que quieres confirmar la desvinculación? Esta acción es definitiva.');
  if (!confirmAction) return;

  try {
    const res = await api.confirmUnpair();
    alert(res.message || 'Te has desvinculado con éxito.');
    router.push('/pair');
  } catch (error) {
    alert('Error al confirmar desvinculación: ' + error.message);
  }
};

const logOut = () => {
  api.logout();
  router.push('/login');
};

const handleDeleteMyAccount = async () => {
  if (!confirm('¿Estás seguro de que deseas eliminar tu cuenta de forma permanente? Tu usuario y datos personales serán borrados, mientras que la bitácora compartida se conservará a salvo para tu pareja.')) return;
  try {
    await api.deleteMyAccount();
    localStorage.clear();
    router.push('/login');
  } catch (error) {
    showPopup('Error al eliminar la cuenta: ' + (error.message || error));
  }
};

const triviaState = ref('idle');
const matchedDailySlots = ref(false);
const timerSeconds = ref(15);
const currentQuestion = ref(null);
let timerInterval = null;

const shuffleArray = (arr) => {
  const originalCorrect = arr[0];
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return {
    options: shuffled,
    correctIndex: shuffled.indexOf(originalCorrect)
  };
};

const generateDynamicTrivia = () => {
  if (datesList.value.length < 3) return [];

  const questions = [];

  // Pregunta 1: Lugar por fecha
  const dateForLoc = datesList.value[Math.floor(Math.random() * datesList.value.length)];
  const formattedDate = formatDate(dateForLoc.date_time);
  const otherLocations = datesList.value
    .map(d => d.location)
    .filter(loc => loc !== dateForLoc.location);
  const fallbackLocs = ['Playa Amarilla', 'Cine Hoyts', 'Jardín Botánico', 'Cakao\'s Coffee Bar', 'Restobar Flor de Chile'];
  const poolLocs = [...new Set([...otherLocations, ...fallbackLocs])].slice(0, 3);
  const optionsLoc = [dateForLoc.location, ...poolLocs];
  const shuffledLoc = shuffleArray(optionsLoc);
  questions.push({
    question: `¿Dónde fue su cita del ${formattedDate}?`,
    options: shuffledLoc.options,
    answerIdx: shuffledLoc.correctIndex
  });

  // Pregunta 2: Nota de la pareja
  const dateForRating = datesList.value[Math.floor(Math.random() * datesList.value.length)];
  const partnerRatingNum = isUser1.value
    ? parseFloat(dateForRating.rating_user_2 || 5.0)
    : parseFloat(dateForRating.rating_user_1 || 5.0);
  const correctRating = `${partnerRatingNum.toFixed(1)}★`;
  const ratingPool = ['3.0★', '3.5★', '4.0★', '4.5★', '5.0★'].filter(r => r !== correctRating);
  const optionsRating = [correctRating, ...ratingPool.slice(0, 3)];
  const shuffledRating = shuffleArray(optionsRating);
  questions.push({
    question: `¿Qué nota le dio ${partnerName.value} a "${dateForRating.location}"?`,
    options: shuffledRating.options,
    answerIdx: shuffledRating.correctIndex
  });

  // Pregunta 3: Ciudad
  const dateForCity = datesList.value[Math.floor(Math.random() * datesList.value.length)];
  const correctCity = dateForCity.city;
  const otherCities = datesList.value
    .map(d => d.city)
    .filter(c => c !== correctCity);
  const fallbackCities = ['Viña del Mar', 'Valparaíso', 'Villa Alemana', 'Quilpué', 'Santiago'];
  const poolCities = [...new Set([...otherCities, ...fallbackCities])].slice(0, 3);
  const optionsCity = [correctCity, ...poolCities];
  const shuffledCity = shuffleArray(optionsCity);
  questions.push({
    question: `¿En qué ciudad fue su cita en "${dateForCity.location}"?`,
    options: shuffledCity.options,
    answerIdx: shuffledCity.correctIndex
  });

  return questions;
};

const handleVisibilityChange = () => { if (document.hidden && triviaState.value === 'active') triggerCheatAnnullment(); };

const startTrivia = () => {
  matchedDailySlots.value = false;
  const dynamicQuestions = generateDynamicTrivia();
  if (dynamicQuestions.length === 0) return;

  currentQuestion.value = dynamicQuestions[Math.floor(Math.random() * dynamicQuestions.length)];
  timerSeconds.value = 15;
  triviaState.value = 'active';
  document.addEventListener('visibilitychange', handleVisibilityChange);
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(async () => { 
    if (timerSeconds.value > 0) {
      timerSeconds.value -= 1; 
    } else { 
      clearInterval(timerInterval); 
      triviaState.value = 'wrong'; 
      document.removeEventListener('visibilitychange', handleVisibilityChange); 
      try {
        await api.playTrivia(false);
      } catch (e) {
        console.warn('Trivia play fail report failed:', e.message);
      }
      currentUser.value.last_trivia_date = new Date().toLocaleDateString('sv-SE');
    } 
  }, 1000);
};

const triggerCheatAnnullment = async () => { 
  if (timerInterval) clearInterval(timerInterval); 
  triviaState.value = 'cheated'; 
  document.removeEventListener('visibilitychange', handleVisibilityChange); 
  try {
    await api.playTrivia(false);
  } catch (e) {
    console.warn('Trivia play fail report failed:', e.message);
  }
  currentUser.value.last_trivia_date = new Date().toLocaleDateString('sv-SE');
};

const selectOption = async (idx) => {
  if (timerInterval) clearInterval(timerInterval);
  document.removeEventListener('visibilitychange', handleVisibilityChange);
  const isCorrect = idx === currentQuestion.value.answerIdx;
  triviaState.value = isCorrect ? 'success' : 'wrong';

  try {
    const res = await api.playTrivia(isCorrect);
    if (res.success) {
      currentUser.value.last_trivia_date = new Date().toLocaleDateString('sv-SE');
      matchedDailySlots.value = res.matchedDailySlots || false;
      if (res.newMaxSlots) {
        maxSlots.value = res.newMaxSlots;
      } else {
        maxSlots.value += 1;
      }
      // Refresh profile to pull new streak state
      await fetchProfile();
    }
  } catch (error) {
    console.warn('Backend trivia failed, using local fallback:', error.message);
    currentUser.value.last_trivia_date = new Date().toLocaleDateString('sv-SE');
    if (isCorrect) {
      maxSlots.value += 1;
    }
  }
};

const restartTrivia = () => { 
  triviaState.value = 'idle'; 
  matchedDailySlots.value = false;
};

const fetchProfile = async () => {
  const profile = await api.getProfile();
  if (!profile || !profile.user || !profile.user.couple_id) {
    router.push('/pair');
    return false;
  }
  currentUser.value = profile.user;
  userCoupleId.value = profile.user.couple_id;
  if (profile) {
    maxSlots.value = profile.maxSlots;
    if (profile.streakCount !== undefined) loveStreak.value = profile.streakCount || 0;
    if (profile.previousStreak !== undefined) previousStreak.value = profile.previousStreak || 0;
    if (profile.lastStreakDate !== undefined) lastStreakDate.value = profile.lastStreakDate || null;
    if (profile.unclaimedStreakRewards !== undefined) unclaimedStreakRewards.value = profile.unclaimedStreakRewards || 0;
  }
  partnerName.value = profile.partnerName || 'Pareja';
  partnerId.value = profile.partnerId || null;
  unpairState.value = profile.unpairState || 'idle';
  unpairRequestedBy.value = profile.unpairRequestedBy || null;
  unpairDaysLeft.value = profile.unpairDaysLeft || 0;
  return true;
};

onMounted(async () => {
  // Auth state verification
  try {
    const profileLoaded = await fetchProfile();
    if (!profileLoaded) return;

    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    const targetTab = urlParams.get('tab');

    if (targetTab === 'settings' || paymentStatus) {
      currentTab.value = 'settings';
    }

    if (paymentStatus === 'success') {
      const slots = urlParams.get('slots') || '';
      showPopup(`¡Pago aprobado! Se han sumado ${slots ? '+' + slots : ''} nuevos cupos a tu bitácora de OurStory.`);
      window.history.replaceState({}, document.title, window.location.pathname);
      await fetchProfile();
    } else if (paymentStatus === 'pending') {
      showPopup('Tu pago está en proceso de verificación por MercadoPago. En cuanto sea confirmado, tus cupos se acreditarán automáticamente.');
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (paymentStatus === 'failure') {
      showPopup('El pago no se completó o fue cancelado. No se ha realizado ningún cobro en tu cuenta.');
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Load actual dates list from Database
    await loadDates();
    await loadExploreDates();
    detectLocation();

    // Subscribe to couple WebSocket channel for real-time clicks
    socket = io(getApiUrl());
    
    socket.on('partner_lock_event', (payload) => {
      if (!payload || payload.userId === null) {
        doubleLockState.value = 'idle';
        return;
      }
      if (payload.userId !== currentUser.value.id) {
        if (doubleLockState.value === 'waiting') {
          // Both clicked! Match!
          doubleLockState.value = 'matched';
          showMatchCelebration.value = true;
          triggerHeartbeatHaptics();
          setTimeout(() => {
            showMatchCelebration.value = false;
            showDateModal.value = true;
          }, 1800);
        } else {
          // Partner is waiting for us
          doubleLockState.value = 'waiting_partner';
          triggerHeartbeatHaptics();
        }
      }
    });

    // Listen for real-time date creation by partner
    socket.on('date_created', () => {
      loadDates();
      loadExploreDates();
      showDateModal.value = false; // Close the modal if it was open
    });

    socket.emit('join_couple', { coupleId: userCoupleId.value, userId: currentUser.value.id });

    socket.on('date_updated', () => {
      loadDates();
      loadExploreDates();
    });

    socket.on('date_deleted', () => {
      loadDates();
      loadExploreDates();
    });

    socket.on('explore_date_deleted', ({ id }) => {
      exploreList.value = exploreList.value.filter(item => item.id !== id);
      loadExploreDates();
    });

  } catch (err) {
    console.error('Initialization error:', err);
    router.push('/login');
  }

  // Anti-cheat window listener
  window.addEventListener('blur', () => { if (triviaState.value === 'active') triggerCheatAnnullment(); });
});

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
  document.removeEventListener('visibilitychange', handleVisibilityChange);
  if (socket) {
    socket.disconnect();
  }
});
</script>

<style>
ion-toolbar { --background: transparent; --border-width: 0; }
.scrollbar-none::-webkit-scrollbar { display: none; }
.scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
</style>

<template>
  <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
    <div @click="$emit('close')" class="absolute inset-0 bg-black/25 backdrop-blur-md"></div>
    <div class="relative w-full max-w-md glass-modal sm:rounded-2xl rounded-t-[2.2rem] shadow-2xl overflow-hidden animate-slide-up max-h-[90vh] flex flex-col">
      <!-- grabber -->
      <div class="w-12 h-1.5 bg-black/10 rounded-full mx-auto my-3 shrink-0"></div>

      <div class="px-5 pb-3 flex justify-between items-center" style="border-bottom: 1px solid var(--border-subtle);">
        <button @click="$emit('close')" class="text-[15px] font-medium transition-all active:scale-95" style="color: var(--text-secondary);">Cerrar</button>
        <div class="flex gap-2">
          <button @click="currentTab = 'couples'" :class="currentTab === 'couples' ? 'bg-black/10 font-bold' : 'text-[var(--text-muted)] font-normal'" class="px-3 py-1 rounded-xl text-[13px] transition-all">Parejas</button>
          <button @click="currentTab = 'reports'" :class="currentTab === 'reports' ? 'bg-red-500/15 text-red-600 font-bold' : 'text-[var(--text-muted)] font-normal'" class="px-3 py-1 rounded-xl text-[13px] transition-all flex items-center gap-1">
            <span>Moderación</span>
            <span v-if="reportedDates.length > 0" class="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">{{ reportedDates.length }}</span>
          </button>
        </div>
        <div class="w-12"></div> <!-- spacer -->
      </div>

      <div class="p-5 overflow-y-auto flex-1 space-y-4">
        <!-- Tab 1: Couples Control -->
        <div v-if="currentTab === 'couples'" class="space-y-4">
          <!-- Search couples -->
          <div class="relative">
            <input v-model="adminSearchQuery" type="text" placeholder="Buscar por email o nombre..." class="input-field w-full pl-10 pr-4 py-2.5 text-[14px] focus:outline-none" />
            <div class="absolute left-3.5 top-3 flex items-center">
              <svg class="w-4 h-4" style="color: var(--text-muted);" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
          </div>

          <!-- Couples List -->
          <div class="space-y-3">
            <div v-for="cp in filteredAdminCouples" :key="cp.id" class="glass rounded-xl p-4 border border-black/5 space-y-3">
              <div class="flex justify-between items-start">
                <div class="flex items-start gap-1.5">
                  <div>
                    <span class="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded">Pareja ID: {{ cp.id }}</span>
                    <p class="text-[11px] text-[var(--text-muted)] mt-1">Registrada: {{ formatDate(cp.created_at) }}</p>
                  </div>
                  <!-- Delete Couple Button -->
                  <button @click="deleteCouple(cp.id)" class="p-1 rounded-lg text-red-500 hover:bg-red-50 active:scale-90 transition-all" title="Eliminar Pareja">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  </button>
                </div>
                <!-- Action: Set 999 slots or 20 slots -->
                <div class="flex flex-col gap-1.5">
                  <div class="flex gap-1.5">
                    <button @click="quickSetSlots(cp.id, 20)" class="px-2 py-1 rounded bg-[var(--accent-soft)] text-[var(--accent)] text-[10px] font-bold active:scale-95 transition-transform">Premium (20)</button>
                    <button @click="quickSetSlots(cp.id, 999)" class="px-2 py-1 rounded bg-amber-100 text-amber-700 text-[10px] font-bold active:scale-95 transition-transform">Tester (999)</button>
                  </div>
                  <div class="flex flex-wrap gap-1.5">
                    <button @click="quickSetStreak(cp.id, 7, 1, 0)" class="px-2 py-1 rounded bg-pink-100 text-pink-700 text-[9.5px] font-bold active:scale-95 transition-transform" title="Poner 7 días de racha + 1 recompensa de ahorro">🎁 Racha 7 días (1🎁)</button>
                    <button @click="quickSetStreak(cp.id, 0, 10, 14)" class="px-2 py-1 rounded bg-red-100 text-red-700 text-[9.5px] font-bold active:scale-95 transition-transform" title="Congelar racha y poner 10 recompensas para rescate">🚑 Probar Rescate (10🎁)</button>
                  </div>
                </div>
              </div>

              <!-- Members -->
              <div class="space-y-1.5 pt-1.5" style="border-top: 1px dashed var(--border-subtle);">
                <div v-for="member in cp.members" :key="member.id" class="text-[12px] flex items-center justify-between">
                  <div class="flex items-center gap-1.5">
                    <span class="text-[9px] font-bold bg-black/5 text-[var(--text-muted)] px-1 rounded">ID: {{ member.id }}</span>
                    <span class="font-semibold" style="color: var(--text-primary);">{{ member.name }}</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <span class="font-mono text-[var(--text-muted)]">{{ member.email }}</span>
                    <!-- Delete User Button -->
                    <button @click="deleteUser(member.id)" class="p-1 rounded text-red-400 hover:bg-red-50 active:scale-90 transition-all" title="Eliminar Usuario">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                  </div>
                </div>
                <div v-if="!cp.members || cp.members.length === 0" class="text-[12px] italic text-[var(--text-muted)]">Sin integrantes vinculados.</div>
              </div>

              <!-- Edit Cupos Base -->
              <div class="flex items-center justify-between pt-2" style="border-top: 1px dashed var(--border-subtle);">
                <span class="text-[12px] font-medium" style="color: var(--text-secondary);">Cupos Base Mensuales:</span>
                <div class="flex items-center gap-2">
                  <input v-model.number="cp.base_slots" type="number" min="0" max="999" class="input-field text-center w-16 py-1 px-2 text-[12px] focus:outline-none" />
                  <button @click="saveCoupleSlots(cp.id, cp.base_slots)" class="btn-primary py-1 px-3 rounded text-[11px] font-bold active:scale-95 transition-transform">Guardar</button>
                </div>
              </div>
            </div>
            
            <div v-if="filteredAdminCouples.length === 0" class="text-center py-6 text-[13px] text-[var(--text-muted)]">
              No se encontraron parejas registradas.
            </div>
          </div>
        </div>

        <!-- Tab 2: Reported Dates Moderation -->
        <div v-else-if="currentTab === 'reports'" class="space-y-3">
          <div v-for="date in reportedDates" :key="date.id" class="glass rounded-xl p-4 border border-red-500/20 space-y-3">
            <div class="flex justify-between items-start gap-2">
              <div>
                <span class="text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2 py-0.5 rounded">Reportada {{ date.reports_count }} vez/veces</span>
                <p class="text-[11px] text-[var(--text-muted)] mt-1 font-semibold">Pareja ID {{ date.couple_id }}: {{ date.author_1 }} y {{ date.author_2 }}</p>
              </div>
              <span class="text-[10px] text-[var(--text-muted)]">{{ formatDate(date.reported_at || date.created_at) }}</span>
            </div>

            <div class="bg-black/5 p-3 rounded-lg space-y-2">
              <p class="text-[13px] font-bold m-0" style="color: var(--text-primary);">{{ date.location }} <span class="text-xs font-normal text-muted">({{ date.city }})</span></p>
              <p v-if="date.description" class="text-[12px] m-0" style="color: var(--text-secondary);">{{ date.description }}</p>
              <div v-if="date.photo_url" class="rounded-md overflow-hidden max-h-36 bg-black/10 mt-2">
                <img :src="date.photo_url" class="w-full h-full object-cover" alt="Recuerdo reportado" />
              </div>
            </div>

            <div class="flex gap-2 pt-1">
              <button @click="dismissReport(date.id)" class="flex-1 py-1.5 px-3 rounded-xl bg-black/5 text-[11px] font-semibold hover:bg-black/10 active:scale-95 transition-all" style="color: var(--text-primary);">
                Descartar Reporte
              </button>
              <button @click="deleteReportedDate(date.id)" class="flex-1 py-1.5 px-3 rounded-xl bg-red-500 text-white text-[11px] font-bold hover:bg-red-600 active:scale-95 transition-all flex items-center justify-center gap-1.5">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                <span>Eliminar Cita</span>
              </button>
            </div>
          </div>

          <div v-if="reportedDates.length === 0" class="text-center py-10 space-y-2">
            <div class="w-10 h-10 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center mx-auto">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
            </div>
            <p class="text-[13px] font-bold text-green-600">Todo limpio en moderación</p>
            <p class="text-[11px] text-[var(--text-muted)]">No hay recuerdos ni citas reportadas por la comunidad en este momento.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// ponytail: Componente modular del Panel de Administración separado de HomeView.vue para simplificar el código base y habilitar carga asíncrona
import { ref, computed, onMounted } from 'vue';
import { api } from '../services/api';
import { usePopup } from '../services/popup';

const props = defineProps({
  userCoupleId: {
    type: [Number, String],
    default: null
  },
  currentUserId: {
    type: [Number, String],
    default: null
  }
});

const emit = defineEmits(['close', 'update-slots']);

const { showPopup } = usePopup();

const currentTab = ref('couples');
const adminSearchQuery = ref('');
const adminCouples = ref([]);
const reportedDates = ref([]);

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-CL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const loadCouples = async () => {
  try {
    const couples = await api.adminGetCouples();
    adminCouples.value = couples || [];
  } catch (error) {
    console.error('Error loading admin couples:', error.message);
    showPopup('Error al cargar panel de administración: ' + error.message);
  }
};

const loadReportedDates = async () => {
  try {
    const reports = await api.adminGetReportedDates();
    reportedDates.value = reports || [];
  } catch (error) {
    console.error('Error loading reported dates:', error.message);
  }
};

onMounted(() => {
  loadCouples();
  loadReportedDates();
});

const filteredAdminCouples = computed(() => {
  return adminCouples.value.filter(cp => {
    if (cp.id && cp.id.toString().includes(adminSearchQuery.value)) {
      return true;
    }
    return cp.members?.some(member => {
      const q = adminSearchQuery.value.toLowerCase();
      return member.name?.toLowerCase().includes(q) || member.email?.toLowerCase().includes(q);
    });
  });
});

const saveCoupleSlots = async (coupleId, slots) => {
  try {
    const res = await api.adminUpdateSlots(coupleId, slots);
    if (res.success) {
      showPopup('Cupos base actualizados con éxito.');
      if (props.userCoupleId === coupleId) {
        emit('update-slots', res.couple.slots);
      }
      await loadCouples();
    }
  } catch (error) {
    alert('Error al guardar cupos: ' + error.message);
  }
};

const quickSetSlots = async (coupleId, slots) => {
  await saveCoupleSlots(coupleId, slots);
};

const quickSetStreak = async (coupleId, streakCount, unclaimedRewards, previousStreak) => {
  try {
    const res = await api.adminUpdateStreakTest(coupleId, streakCount, unclaimedRewards, previousStreak);
    if (res.success) {
      showPopup(res.message);
      await loadCouples();
      if (props.userCoupleId === coupleId) {
        window.location.reload();
      }
    }
  } catch (error) {
    alert('Error al probar racha: ' + error.message);
  }
};

const deleteCouple = async (coupleId) => {
  const confirmDelete = confirm(`¿Estás seguro de que quieres eliminar la pareja ID ${coupleId}? Esto borrará todas sus citas y desvinculará a sus miembros.`);
  if (!confirmDelete) return;

  try {
    const res = await api.adminDeleteCouple(coupleId);
    if (res.success) {
      showPopup('Pareja eliminada con éxito.');
      await loadCouples();
      if (props.userCoupleId === coupleId) {
        window.location.reload();
      }
    }
  } catch (error) {
    alert('Error al eliminar pareja: ' + error.message);
  }
};

const deleteUser = async (userId) => {
  const confirmDelete = confirm(`¿Estás seguro de que quieres eliminar permanentemente al usuario ID ${userId}?`);
  if (!confirmDelete) return;

  try {
    const res = await api.adminDeleteUser(userId);
    if (res.success) {
      showPopup('Usuario eliminado con éxito.');
      await loadCouples();
      if (props.currentUserId && props.currentUserId === userId) {
        window.location.reload();
      }
    }
  } catch (error) {
    alert('Error al eliminar usuario: ' + error.message);
  }
};

const dismissReport = async (dateId) => {
  try {
    const res = await api.adminDismissReportedDate(dateId);
    if (res.success) {
      showPopup('Reporte descartado. El recuerdo se conservará.');
      await loadReportedDates();
    }
  } catch (error) {
    alert('Error al descartar reporte: ' + error.message);
  }
};

const deleteReportedDate = async (dateId) => {
  const confirmDel = confirm('¿Estás seguro de que deseas eliminar permanentemente esta cita reportada de OurStory?');
  if (!confirmDel) return;

  try {
    const res = await api.adminDeleteReportedDate(dateId);
    if (res.success) {
      showPopup('Recuerdo inapropiado eliminado globalmente.');
      await loadReportedDates();
    }
  } catch (error) {
    alert('Error al eliminar cita: ' + error.message);
  }
};
</script>

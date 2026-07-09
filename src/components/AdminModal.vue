<template>
  <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
    <div @click="$emit('close')" class="absolute inset-0 bg-black/25 backdrop-blur-md"></div>
    <div class="relative w-full max-w-md glass-modal sm:rounded-2xl rounded-t-[2.2rem] shadow-2xl overflow-hidden animate-slide-up max-h-[90vh] flex flex-col">
      <!-- grabber -->
      <div class="w-12 h-1.5 bg-black/10 rounded-full mx-auto my-3 shrink-0"></div>

      <div class="px-5 pb-3 flex justify-between items-center" style="border-bottom: 1px solid var(--border-subtle);">
        <button @click="$emit('close')" class="text-[15px] font-medium transition-all active:scale-95" style="color: var(--text-secondary);">Cerrar</button>
        <h3 class="text-[16px] font-bold m-0" style="color: var(--text-primary); font-family: 'Comfortaa', sans-serif;">
          Control de Parejas
        </h3>
        <div class="w-12"></div> <!-- spacer -->
      </div>

      <div class="p-5 overflow-y-auto flex-1 space-y-4">
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
              <div class="flex gap-1.5">
                <button @click="quickSetSlots(cp.id, 20)" class="px-2 py-1 rounded bg-[var(--accent-soft)] text-[var(--accent)] text-[10px] font-bold active:scale-95 transition-transform">Premium (20)</button>
                <button @click="quickSetSlots(cp.id, 999)" class="px-2 py-1 rounded bg-amber-100 text-amber-700 text-[10px] font-bold active:scale-95 transition-transform">Tester (999)</button>
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

const adminSearchQuery = ref('');
const adminCouples = ref([]);

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

onMounted(() => {
  loadCouples();
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
</script>

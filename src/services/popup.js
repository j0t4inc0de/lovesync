import { ref } from 'vue';

const isVisible = ref(false);
const popupMessage = ref('');

export const usePopup = () => {
  const showPopup = (message = 'Próximamente ♡') => {
    popupMessage.value = message;
    isVisible.value = true;
  };

  const hidePopup = () => {
    isVisible.value = false;
  };

  return {
    isVisible,
    popupMessage,
    showPopup,
    hidePopup
  };
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const getApiUrl = () => API_URL;

export const getToken = () => localStorage.getItem('ourstory_token') || localStorage.getItem('lovesync_token');
export const setToken = (token) => localStorage.setItem('ourstory_token', token);
export const removeToken = () => {
  localStorage.removeItem('ourstory_token');
  localStorage.removeItem('lovesync_token');
};

const request = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  const token = getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(url, {
    ...options,
    headers
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Ocurrió un error en la solicitud');
  }
  
  return data;
};

export const api = {
  login: async (email, password) => {
    const data = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (data.token) {
      setToken(data.token);
    }
    return data;
  },
  
  register: async (name, email, password) => {
    return request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
  },
  
  getProfile: async () => {
    return request('/api/profile');
  },
  
  pair: async (inviteCode) => {
    return request('/api/profile/pair', {
      method: 'POST',
      body: JSON.stringify({ inviteCode })
    });
  },
  
  unpair: async () => {
    return request('/api/profile/unpair', {
      method: 'POST'
    });
  },
  
  cancelUnpair: async () => {
    return request('/api/profile/unpair/cancel', {
      method: 'POST'
    });
  },
  
  confirmUnpair: async () => {
    return request('/api/profile/unpair/confirm', {
      method: 'POST'
    });
  },

  deleteMyAccount: () => request('/api/users/me', { method: 'DELETE' }),
  
  downloadPDF: async () => {
    const response = await fetch(`${API_URL}/api/dates/pdf`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    if (!response.ok) throw new Error('Error al generar PDF');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nuestro_album_de_recuerdos.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  },
  
  getDates: async () => {
    return request('/api/dates');
  },

  getExploreDates: async () => {
    return request('/api/dates/explore');
  },
  
  createDate: async (dateData) => {
    return request('/api/dates', {
      method: 'POST',
      body: JSON.stringify(dateData)
    });
  },

  updateDate: async (id, dateData) => {
    return request(`/api/dates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dateData)
    });
  },
  
  deleteDate: async (id) => {
    return request(`/api/dates/${id}`, {
      method: 'DELETE'
    });
  },
  
  likeDate: async (id) => {
    return request(`/api/dates/${id}/like`, {
      method: 'POST'
    });
  },

  reportDate: (id) => request('/api/dates/' + id + '/report', { method: 'POST' }),
  
  addSlots: async (amount) => {
    return request('/api/profile/slots', {
      method: 'POST',
      body: JSON.stringify({ amount })
    });
  },
  
  claimStreakReward: (amount = 1) => request('/api/profile/streak/claim', { method: 'POST', body: JSON.stringify({ amount }) }),
  rescueStreakWithRewards: () => request('/api/profile/streak/rescue-rewards', { method: 'POST' }),
  
  createPaymentPreference: (packageId, streakRescue = false) => request('/api/payments/create-preference', { method: 'POST', body: JSON.stringify({ packageId, streakRescue }) }),
  
  playTrivia: async (correct) => {
    const localDate = new Date().toLocaleDateString('sv-SE');
    return request('/api/trivia/play', {
      method: 'POST',
      body: JSON.stringify({ correct, localDate })
    });
  },
  
  adminGetCouples: async () => {
    return request('/api/admin/couples', {
      method: 'GET'
    });
  },
  
  adminUpdateSlots: async (coupleId, slots) => {
    return request(`/api/admin/couples/${coupleId}/slots`, {
      method: 'PUT',
      body: JSON.stringify({ slots })
    });
  },
  
  adminUpdateStreakTest: async (coupleId, streakCount, unclaimedRewards, previousStreak = 0) => {
    return request(`/api/admin/couples/${coupleId}/streak-test`, {
      method: 'PUT',
      body: JSON.stringify({ streakCount, unclaimedRewards, previousStreak })
    });
  },
  
  adminDeleteCouple: async (coupleId) => {
    return request(`/api/admin/couples/${coupleId}`, {
      method: 'DELETE'
    });
  },
  
  adminDeleteUser: async (userId) => {
    return request(`/api/admin/users/${userId}`, {
      method: 'DELETE'
    });
  },

  adminGetReportedDates: async () => {
    return request('/api/admin/reported-dates', {
      method: 'GET'
    });
  },

  adminDismissReportedDate: async (dateId) => {
    return request(`/api/admin/reported-dates/${dateId}/dismiss`, {
      method: 'POST'
    });
  },

  adminDeleteReportedDate: async (dateId) => {
    return request(`/api/admin/reported-dates/${dateId}`, {
      method: 'DELETE'
    });
  },
  
  logout: () => {
    removeToken();
  }
};

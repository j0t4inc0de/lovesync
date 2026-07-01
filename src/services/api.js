const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const getApiUrl = () => API_URL;

export const getToken = () => localStorage.getItem('lovesync_token');
export const setToken = (token) => localStorage.setItem('lovesync_token', token);
export const removeToken = () => localStorage.removeItem('lovesync_token');

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
  
  addSlots: async (amount) => {
    return request('/api/profile/slots', {
      method: 'POST',
      body: JSON.stringify({ amount })
    });
  },
  
  playTrivia: async (correct) => {
    return request('/api/trivia/play', {
      method: 'POST',
      body: JSON.stringify({ correct })
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
  
  logout: () => {
    removeToken();
  }
};

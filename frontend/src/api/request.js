const BASE = import.meta.env.VITE_API_URL || '';

function getToken() {
  return localStorage.getItem('token');
}

export async function request(path, options = {}) {
  const url = path.startsWith('http') ? path : BASE + path;
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(url, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || res.statusText || '请求失败');
  return data;
}

export const auth = {
  register: (body) => request('/api/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }),
};

export const merchant = {
  getHotels: () => request('/api/merchant/hotels'),
  getHotel: (id) => request(`/api/merchant/hotels/${id}`),
  createHotel: (body) => request('/api/merchant/hotels', { method: 'POST', body: JSON.stringify(body) }),
  updateHotel: (id, body) => request(`/api/merchant/hotels/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  submitHotel: (id) => request(`/api/merchant/hotels/${id}/submit`, { method: 'POST' }),
};

export const admin = {
  getHotels: (params) => {
    const q = new URLSearchParams(params).toString();
    return request('/api/admin/hotels' + (q ? '?' + q : ''));
  },
  approveHotel: (id) => request(`/api/admin/hotels/${id}/approve`, { method: 'POST' }),
  rejectHotel: (id, reason) => request(`/api/admin/hotels/${id}/reject`, { method: 'POST', body: JSON.stringify({ reason }) }),
  offlineHotel: (id) => request(`/api/admin/hotels/${id}/offline`, { method: 'POST' }),
  restoreHotel: (id) => request(`/api/admin/hotels/${id}/restore`, { method: 'POST' }),
};

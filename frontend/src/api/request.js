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

/** 上传图片（FormData），不设置 Content-Type，由浏览器自动带 boundary */
export async function uploadImages(files) {
  const url = BASE + '/api/upload/images';
  const form = new FormData();
  const list = Array.isArray(files) ? files : [files];
  list.forEach((file) => form.append('files', file));
  const token = getToken();
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(url, { method: 'POST', body: form, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || res.statusText || '上传失败');
  return data;
}

export const auth = {
  register: (body) => request('/api/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }),
};

export const merchant = {
  getHotels: (params) => {
    const q = new URLSearchParams(params).toString();
    return request('/api/merchant/hotels' + (q ? '?' + q : ''));
  },
  getHotel: (id) => request(`/api/merchant/hotels/${id}`),
  createHotel: (body) => request('/api/merchant/hotels', { method: 'POST', body: JSON.stringify(body) }),
  updateHotel: (id, body) => request(`/api/merchant/hotels/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  submitHotel: (id) => request(`/api/merchant/hotels/${id}/submit`, { method: 'POST' }),
};

export const admin = {
  getHotels: (params) => {
    const q = new URLSearchParams({ ...params, _t: Date.now() }).toString();
    return request('/api/admin/hotels' + (q ? '?' + q : ''));
  },
  getHotel: (id) => request(`/api/admin/hotels/${id}`),
  approveHotel: (id) => request(`/api/admin/hotels/${id}/approve`, { method: 'POST' }),
  rejectHotel: (id, reason) => request(`/api/admin/hotels/${id}/reject`, { method: 'POST', body: JSON.stringify({ reason }) }),
  offlineHotel: (id) => request(`/api/admin/hotels/${id}/offline`, { method: 'POST' }),
  restoreHotel: (id) => request(`/api/admin/hotels/${id}/restore`, { method: 'POST' }),
  setBanner: (id, body) => request(`/api/admin/hotels/${id}/banner`, { method: 'PUT', body: JSON.stringify(body) }),
};

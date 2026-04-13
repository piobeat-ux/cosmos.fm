const API_URL = 'https://cosmosfm-production.up.railway.app/api';

export async function fetchAPI(endpoint: string, options?: RequestInit) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// Shows
export const showsAPI = {
  getAll: () => fetchAPI('/shows'),
  getCurrent: () => fetchAPI('/shows/current'),
  create: (data: any) => fetchAPI('/shows', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => fetchAPI(`/shows/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchAPI(`/shows/${id}`, { method: 'DELETE' }),
};

// Podcasts
export const podcastsAPI = {
  getAll: () => fetchAPI('/podcasts'),
  create: (data: any) => fetchAPI('/podcasts', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => fetchAPI(`/podcasts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchAPI(`/podcasts/${id}`, { method: 'DELETE' }),
};

// Hosts
export const hostsAPI = {
  getAll: () => fetchAPI('/hosts'),
  create: (data: any) => fetchAPI('/hosts', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => fetchAPI(`/hosts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchAPI(`/hosts/${id}`, { method: 'DELETE' }),
};

// Pages
export const pagesAPI = {
  get: (page: string) => fetchAPI(`/pages/${page}`),
  update: (page: string, data: any) => fetchAPI(`/pages/${page}`, { method: 'PUT', body: JSON.stringify(data) }),
};

// Settings
export const settingsAPI = {
  get: () => fetchAPI('/settings'),
  update: (data: any) => fetchAPI('/settings', { method: 'PUT', body: JSON.stringify(data) }),
};

// Data
export const dataAPI = {
  getAll: () => fetchAPI('/data'),
  update: (data: any) => fetchAPI('/data', { method: 'POST', body: JSON.stringify(data) }),
};
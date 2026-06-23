const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

async function fetchAPI(endpoint: string, options?: RequestInit) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function getDestinations(params?: Record<string, string>) {
  const query = params ? '?' + new URLSearchParams(params).toString() : '';
  return fetchAPI(`/destinations${query}`);
}

export async function getDestination(slug: string) {
  return fetchAPI(`/destinations/${slug}`);
}

export async function getBlogPosts(params?: Record<string, string>) {
  const query = params ? '?' + new URLSearchParams(params).toString() : '';
  return fetchAPI(`/blog${query}`);
}

export async function getBlogPost(slug: string) {
  return fetchAPI(`/blog/${slug}`);
}

export async function createBooking(data: any, token: string) {
  return fetchAPI('/bookings', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
}

export async function getMyBookings(token: string) {
  return fetchAPI('/bookings/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function createReview(data: any, token: string) {
  return fetchAPI('/reviews', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
}

// Admin API calls
export async function adminGetBookings(token: string, params?: Record<string, string>) {
  const query = params ? '?' + new URLSearchParams(params).toString() : '';
  return fetchAPI(`/admin/bookings${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function adminUpdateBookingStatus(token: string, id: string, status: string) {
  return fetchAPI(`/admin/bookings/${id}/status`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ status }),
  });
}

export async function adminCreateDestination(data: any, token: string) {
  return fetchAPI('/admin/destinations', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
}

export async function adminUpdateDestination(id: string, data: any, token: string) {
  return fetchAPI(`/admin/destinations/${id}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
}

export async function adminDeleteDestination(id: string, token: string) {
  return fetchAPI(`/admin/destinations/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function adminUploadImage(formData: FormData, token: string) {
  const res = await fetch(`${API_BASE}/admin/media/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Upload failed' }));
    throw new Error(err.error || 'Upload failed');
  }
  return res.json();
}

export async function adminCreatePost(data: any, token: string) {
  return fetchAPI('/admin/blog', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
}

export async function adminUpdatePost(id: string, data: any, token: string) {
  return fetchAPI(`/admin/blog/${id}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
}

export async function adminDeletePost(id: string, token: string) {
  return fetchAPI(`/admin/blog/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}
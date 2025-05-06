'use client';

export async function login(email, password) {
  const response = await fetch('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Login failed');
  }

  return response.json();
}

export async function logout() {
  await fetch('/api/admin/logout', {
    method: 'POST',
  });
}

export async function checkAuth() {
  try {
    const response = await fetch('/api/admin/check-auth');
    return response.ok;
  } catch {
    return false;
  }
} 
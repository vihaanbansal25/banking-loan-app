// Small fetch wrapper shared by every page.
//
// The backend isn't fully consistent about what it returns - some endpoints
// send back plain text ("Successfully deposited $50...") and others send
// back JSON. Rather than have every page guess, this helper looks at the
// response's content-type and hands back whichever shape it finds, plus the
// ok/status so callers can branch on success vs. failure.

export const API_BASE = 'http://localhost:8080/api';

export async function apiRequest(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE}${path}`, {
      headers: options.body ? { 'Content-Type': 'application/json' } : undefined,
      ...options,
    });
  } catch {
    return {
      ok: false,
      status: 0,
      data: 'Could not reach the server. Is the backend running on localhost:8080?',
    };
  }

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  return { ok: response.ok, status: response.status, data };
}

export function apiGet(path) {
  return apiRequest(path);
}

export function apiPost(path, body) {
  return apiRequest(path, { method: 'POST', body: JSON.stringify(body) });
}

// Pulls a human-readable message out of whatever the backend sent back,
// whether that's a plain string or an { error, message } envelope.
export function messageFrom(data) {
  if (typeof data === 'string') return data;
  if (data && typeof data.message === 'string') return data.message;
  return 'Something went wrong. Please try again.';
}

const DEFAULT_BACKEND = 'http://localhost:4000';

export function getBackendBaseUrl(): string {
  const raw = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BASE_URL || DEFAULT_BACKEND;
  return raw.replace(/\/+$/, '');
}

export async function proxyToBackend(request: Request, backendPath: string) {
  const backendBase = (process.env.BACKEND_URL || DEFAULT_BACKEND).replace(/\/+$/, '');
  const cleanPath = backendPath.startsWith('/') ? backendPath : `/${backendPath}`;
  const url = new URL(request.url);
  const target = `${backendBase}${cleanPath}${url.search}`;

  const headers: Record<string, string> = {};

  const contentType = request.headers.get('content-type');
  if (contentType) {
    headers['Content-Type'] = contentType;
  }

  const authHeader = request.headers.get('authorization');
  if (authHeader) {
    headers['Authorization'] = authHeader;
  }

  const adminSessionHeader = request.headers.get('x-admin-session-token');
  if (adminSessionHeader) {
    headers['X-Admin-Session-Token'] = adminSessionHeader;
  }

  const cookieHeader = request.headers.get('cookie');
  if (cookieHeader) {
    headers['Cookie'] = cookieHeader;
  }

  const isGetOrHead = ['GET', 'HEAD'].includes(request.method);
  const reqBody = isGetOrHead ? undefined : Buffer.from(await request.arrayBuffer());

  try {
    const res = await fetch(target, {
      method: request.method,
      headers,
      body: reqBody,
      // 30s timeout — covers Render free-tier cold starts (~15–25s wake time)
      signal: AbortSignal.timeout(30_000),
    });

    const resBuffer = await res.arrayBuffer();
    const responseHeaders = new Headers();
    res.headers.forEach((val, key) => {
      if (!['transfer-encoding', 'connection'].includes(key.toLowerCase())) {
        responseHeaders.set(key, val);
      }
    });
    if (!responseHeaders.has('content-type')) {
      responseHeaders.set('content-type', 'application/json');
    }

    return new Response(resBuffer, {
      status: res.status,
      headers: responseHeaders,
    });
  } catch (err: any) {
    console.error(`[backend-proxy] Failed to reach ${target}:`, err.message);
    return new Response(
      JSON.stringify({ error: 'Backend service unavailable. Please try again in a moment.', detail: err.message }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

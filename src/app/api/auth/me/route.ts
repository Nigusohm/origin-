import { proxyToBackend } from '@/lib/backend-proxy';

/** Called on client mount to restore a Supabase session from the stored access token. */
export async function GET(request: Request) {
  return proxyToBackend(request, '/api/auth/me');
}

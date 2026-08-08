// frontend/src/app/api/admin/images/route.ts
import { proxyToBackend } from '@/lib/backend-proxy';

export async function POST(request: Request) {
  return proxyToBackend(request, '/api/admin/content/images');
}
import { proxyToBackend } from '@/lib/backend-proxy';

export async function GET(request: Request) {
  return proxyToBackend(request, '/api/admin/notifications');
}

export async function POST(request: Request) {
  return proxyToBackend(request, '/api/admin/notifications/mark-all-read');
}

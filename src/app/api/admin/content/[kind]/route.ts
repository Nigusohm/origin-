import { proxyToBackend } from '@/lib/backend-proxy';

export async function GET(request: Request, { params }: { params: Promise<{ kind: string }> }) {
  const { kind } = await params;
  return proxyToBackend(request, `/api/admin/content/${kind}`);
}

export async function POST(request: Request, { params }: { params: Promise<{ kind: string }> }) {
  const { kind } = await params;
  return proxyToBackend(request, `/api/admin/content/${kind}`);
}

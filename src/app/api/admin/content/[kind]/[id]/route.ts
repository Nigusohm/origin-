import { proxyToBackend } from '@/lib/backend-proxy';

export async function PATCH(request: Request, { params }: { params: Promise<{ kind: string; id: string }> }) {
  const { kind, id } = await params;
  return proxyToBackend(request, `/api/admin/content/${kind}/${id}`);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ kind: string; id: string }> }) {
  const { kind, id } = await params;
  return proxyToBackend(request, `/api/admin/content/${kind}/${id}`);
}

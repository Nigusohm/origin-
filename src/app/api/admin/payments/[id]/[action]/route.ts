import { proxyToBackend } from '@/lib/backend-proxy';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; action: string }> }
) {
  const { id, action } = await params;
  return proxyToBackend(request, `/api/admin/payments/${id}/${action}`);
}

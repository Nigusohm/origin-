import { proxyToBackend } from '@/lib/backend-proxy';

export async function GET(request: Request, { params }: { params: Promise<{ division: string }> }) {
  const { division } = await params;
  return proxyToBackend(request, `/api/payment-account/${division}`);
}

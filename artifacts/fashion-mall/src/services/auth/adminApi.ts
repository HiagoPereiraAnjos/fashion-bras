import { AdminMeResponse, type AdminMe } from '@workspace/api-zod';
import { requestApi } from '@/services/api/request';

export async function fetchAdminProfile(token: string): Promise<AdminMe> {
  return requestApi(
    '/api/admin/me',
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    AdminMeResponse,
  );
}

import { requestApi } from '@/services/api/request';
import {
  CONTACT_REQUEST_STATUSES,
  type ContactRequestDetail,
  type ContactRequestListItem,
  type ContactRequestStatus,
} from '@/types';

type ContactRequestsListResponse = {
  items: ContactRequestListItem[];
};

type UpdateContactRequestInput = {
  status?: ContactRequestStatus;
  internalNotes?: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object';
}

function asString(value: unknown, fieldName: string): string {
  if (typeof value !== 'string') {
    throw new Error(`Invalid ${fieldName}.`);
  }
  return value;
}

function asStatus(value: unknown, fieldName: string): ContactRequestStatus {
  const normalized = asString(value, fieldName);
  if (
    CONTACT_REQUEST_STATUSES.includes(
      normalized as ContactRequestStatus,
    )
  ) {
    return normalized as ContactRequestStatus;
  }
  throw new Error(`Invalid ${fieldName}.`);
}

function parseContactRequestListItem(value: unknown): ContactRequestListItem {
  if (!isRecord(value)) {
    throw new Error('Invalid contact request list item.');
  }

  return {
    id: asString(value.id, 'id'),
    name: asString(value.name, 'name'),
    email: asString(value.email, 'email'),
    phone: asString(value.phone, 'phone'),
    company: asString(value.company, 'company'),
    spaceType: asString(value.spaceType, 'spaceType'),
    segment: asString(value.segment, 'segment'),
    status: asStatus(value.status, 'status'),
    createdAt: asString(value.createdAt, 'createdAt'),
    updatedAt: asString(value.updatedAt, 'updatedAt'),
  };
}

function parseContactRequestDetail(value: unknown): ContactRequestDetail {
  if (!isRecord(value)) {
    throw new Error('Invalid contact request detail.');
  }

  return {
    ...parseContactRequestListItem(value),
    message: asString(value.message, 'message'),
    internalNotes: asString(value.internalNotes, 'internalNotes'),
  };
}

function parseContactRequestsListResponse(
  value: unknown,
): ContactRequestsListResponse {
  if (!isRecord(value) || !Array.isArray(value.items)) {
    throw new Error('Invalid contact requests response.');
  }

  return {
    items: value.items.map((item) => parseContactRequestListItem(item)),
  };
}

export async function fetchAdminContactRequests(params: {
  token: string;
  status?: ContactRequestStatus;
}): Promise<ContactRequestListItem[]> {
  const query = params.status ? `?status=${encodeURIComponent(params.status)}` : '';

  const response = await requestApi(
    `/api/admin/contact-requests${query}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${params.token}`,
      },
    },
    {
      parse: parseContactRequestsListResponse,
    },
  );

  return response.items;
}

export async function fetchAdminContactRequestById(params: {
  token: string;
  id: string;
}): Promise<ContactRequestDetail> {
  return requestApi(
    `/api/admin/contact-requests/${encodeURIComponent(params.id)}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${params.token}`,
      },
    },
    {
      parse: parseContactRequestDetail,
    },
  );
}

export async function patchAdminContactRequest(params: {
  token: string;
  id: string;
  input: UpdateContactRequestInput;
}): Promise<ContactRequestDetail> {
  return requestApi(
    `/api/admin/contact-requests/${encodeURIComponent(params.id)}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.token}`,
      },
      body: JSON.stringify(params.input),
    },
    {
      parse: parseContactRequestDetail,
    },
  );
}


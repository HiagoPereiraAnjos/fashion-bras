import { and, desc, eq } from "drizzle-orm";
import { db, contactRequestsTable } from "@workspace/db";

export const CONTACT_REQUEST_STATUS_VALUES = [
  "novo",
  "em_contato",
  "atendido",
  "arquivado",
] as const;

export type ContactRequestStatus = (typeof CONTACT_REQUEST_STATUS_VALUES)[number];

export type CreateContactRequestInput = {
  name: string;
  email: string;
  phone: string;
  company: string;
  spaceType: string;
  segment: string;
  message: string;
};

export async function createContactRequest(
  input: CreateContactRequestInput,
): Promise<void> {
  await db.insert(contactRequestsTable).values({
    name: input.name,
    email: input.email,
    phone: input.phone,
    company: input.company,
    spaceType: input.spaceType,
    segment: input.segment,
    message: input.message,
  });
}

export type ContactRequestRecord = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  spaceType: string;
  segment: string;
  message: string;
  status: ContactRequestStatus;
  internalNotes: string;
  createdAt: Date;
  updatedAt: Date;
};

export async function listContactRequests(params: {
  status?: ContactRequestStatus;
} = {}): Promise<ContactRequestRecord[]> {
  const whereClause = params.status
    ? and(eq(contactRequestsTable.status, params.status))
    : undefined;

  const rows = await db
    .select()
    .from(contactRequestsTable)
    .where(whereClause)
    .orderBy(desc(contactRequestsTable.createdAt));

  return rows.map((row) => ({
    ...row,
    status: row.status as ContactRequestStatus,
    internalNotes: row.internalNotes ?? "",
  }));
}

export async function findContactRequestById(
  id: string,
): Promise<ContactRequestRecord | null> {
  const [row] = await db
    .select()
    .from(contactRequestsTable)
    .where(eq(contactRequestsTable.id, id))
    .limit(1);

  if (!row) return null;

  return {
    ...row,
    status: row.status as ContactRequestStatus,
    internalNotes: row.internalNotes ?? "",
  };
}

export async function updateContactRequest(params: {
  id: string;
  status?: ContactRequestStatus;
  internalNotes?: string;
}): Promise<ContactRequestRecord | null> {
  const updates: Partial<{
    status: ContactRequestStatus;
    internalNotes: string;
    updatedAt: Date;
  }> = {};

  if (params.status !== undefined) {
    updates.status = params.status;
  }
  if (params.internalNotes !== undefined) {
    updates.internalNotes = params.internalNotes;
  }

  if (Object.keys(updates).length === 0) {
    return findContactRequestById(params.id);
  }

  updates.updatedAt = new Date();

  const [row] = await db
    .update(contactRequestsTable)
    .set(updates)
    .where(eq(contactRequestsTable.id, params.id))
    .returning();

  if (!row) return null;

  return {
    ...row,
    status: row.status as ContactRequestStatus,
    internalNotes: row.internalNotes ?? "",
  };
}

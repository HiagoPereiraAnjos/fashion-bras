import { db, contactRequestsTable } from "@workspace/db";

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

import { Router, type IRouter } from "express";
import { z } from "zod";
import { adminRateLimit } from "../middlewares/adminRateLimit";
import { requireAdmin } from "../middlewares/admin";
import { requireAuth } from "../middlewares/auth";
import { HttpError } from "../lib/httpError";
import {
  CONTACT_REQUEST_STATUS_VALUES,
  findContactRequestById,
  listContactRequests,
  updateContactRequest,
  type ContactRequestRecord,
} from "../repositories/contact/contactRepository";

const ContactRequestStatusSchema = z.enum(CONTACT_REQUEST_STATUS_VALUES);

const ContactRequestListQuery = z.object({
  status: ContactRequestStatusSchema.optional(),
});

const ContactRequestParams = z.object({
  id: z.string().uuid(),
});

const ContactRequestPatchBody = z
  .object({
    status: ContactRequestStatusSchema.optional(),
    internalNotes: z.string().trim().max(3000).optional(),
  })
  .refine(
    (value) => value.status !== undefined || value.internalNotes !== undefined,
    {
      message: "Provide at least one field to update.",
    },
  );

const ContactRequestResponse = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  company: z.string(),
  spaceType: z.string(),
  segment: z.string(),
  message: z.string(),
  status: ContactRequestStatusSchema,
  internalNotes: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const ContactRequestListItem = ContactRequestResponse.omit({
  message: true,
  internalNotes: true,
});

function toDto(record: ContactRequestRecord) {
  return {
    id: record.id,
    name: record.name,
    email: record.email,
    phone: record.phone,
    company: record.company,
    spaceType: record.spaceType,
    segment: record.segment,
    message: record.message,
    status: record.status,
    internalNotes: record.internalNotes,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

const router: IRouter = Router();

router.use(adminRateLimit, requireAuth, requireAdmin);

router.get("/admin/contact-requests", async (request, response, next) => {
  try {
    const { status } = ContactRequestListQuery.parse(request.query);
    const records = await listContactRequests({ status });

    response.json(
      z
        .object({
          items: z.array(ContactRequestListItem),
        })
        .parse({
          items: records.map((record) =>
            ContactRequestListItem.parse(toDto(record)),
          ),
        }),
    );
  } catch (error) {
    next(error);
  }
});

router.get("/admin/contact-requests/:id", async (request, response, next) => {
  try {
    const { id } = ContactRequestParams.parse(request.params);
    const record = await findContactRequestById(id);

    if (!record) {
      throw new HttpError(404, "Not Found", "Contact request not found.");
    }

    response.json(ContactRequestResponse.parse(toDto(record)));
  } catch (error) {
    next(error);
  }
});

router.patch("/admin/contact-requests/:id", async (request, response, next) => {
  try {
    const { id } = ContactRequestParams.parse(request.params);
    const body = ContactRequestPatchBody.parse(request.body ?? {});

    const record = await updateContactRequest({
      id,
      status: body.status,
      internalNotes: body.internalNotes,
    });

    if (!record) {
      throw new HttpError(404, "Not Found", "Contact request not found.");
    }

    response.json(ContactRequestResponse.parse(toDto(record)));
  } catch (error) {
    next(error);
  }
});

export default router;


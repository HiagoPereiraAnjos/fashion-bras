import { Router, type IRouter } from "express";
import { z } from "zod";
import { createContactRequest } from "../repositories/contact/contactRepository";

const ContactRequestBody = z.object({
  name: z.string().trim().min(3).max(120),
  email: z.string().trim().email().max(320),
  phone: z.string().trim().min(8).max(40),
  company: z.string().trim().min(2).max(160),
  spaceType: z.string().trim().min(2).max(120),
  segment: z.string().trim().min(2).max(120),
  message: z.string().trim().min(20).max(3000),
});

const ContactResponse = z.object({
  success: z.literal(true),
});

const router: IRouter = Router();

router.post("/contact", async (request, response, next) => {
  try {
    const payload = ContactRequestBody.parse(request.body);
    await createContactRequest(payload);
    response.status(201).json(ContactResponse.parse({ success: true }));
  } catch (error) {
    next(error);
  }
});

export default router;

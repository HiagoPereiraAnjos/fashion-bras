import { Router, type IRouter } from "express";
import healthRouter from "./health";
import contentRouter from "./content";
import adminContentRouter from "./adminContent";
import contactRouter from "./contact";
import adminContactRequestsRouter from "./adminContactRequests";

const router: IRouter = Router();

router.use(healthRouter);
router.use(contentRouter);
router.use(contactRouter);
router.use(adminContentRouter);
router.use(adminContactRequestsRouter);

export default router;

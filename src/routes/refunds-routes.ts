import { Router } from "express";

import { RefundsController } from "@/controllers/refunds-controller";
import { verifyAuthorization } from "@/middlewares/verify-authorization";

const refundsRoutes = Router();
const refundsController = new RefundsController();

refundsRoutes.post(
  "/",
  verifyAuthorization(["employee"]),
  refundsController.create,
);

export { refundsRoutes };

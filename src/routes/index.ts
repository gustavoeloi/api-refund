import { Router } from "express";

import { userRoutes } from "./users-routes";
import { sessionRoutes } from "./sessions-routes";
import { refundsRoutes } from "./refunds-routes";
import { uploadsRoutes } from "./uploads-routes";

//middleware of authentication
import { ensureAuthentication } from "@/middlewares/ensure-authentication";

const routes = Router();

// routes
routes.use("/users", userRoutes);
routes.use("/sessions", sessionRoutes);

// needs authentication
routes.use(ensureAuthentication);
routes.use("/refunds", refundsRoutes);
routes.use("/uploads", uploadsRoutes);

export { routes };

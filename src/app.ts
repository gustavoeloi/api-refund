import "express-async-errors";

import express from "express";
import cors from "cors";
import { errorHandling } from "./middlewares/error-handling";
import uploadConfig from "@/configs/upload";

// routes
import { routes } from "./routes";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/uploads", express.static(uploadConfig.UPLOADS_FOLDER));

app.use(routes);

app.use(errorHandling);

export { app };

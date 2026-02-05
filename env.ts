import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  AUTH_SECRET: z.string(),
});

export const { AUTH_SECRET } = envSchema.parse(process.env);

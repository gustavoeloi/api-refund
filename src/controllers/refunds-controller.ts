import { Request, Response } from "express";
import { z } from "zod";

import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";

const enumCategory = z.enum([
  "food",
  "others",
  "services",
  "transport",
  "accomodation",
]);

class RefundsController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z
        .string("Name is required")
        .trim()
        .min(3, "Name must have minimum of 3 caracteres"),
      amount: z
        .number("Amount is required")
        .positive("Amount must be higher than 0."),
      category: enumCategory,
      filename: z.string(),
    });

    const { name, amount, category, filename } = bodySchema.parse(request.body);

    if (!request.user) {
      throw new AppError("Unauthorized", 401);
    }

    const refund = await prisma.refunds.create({
      data: {
        name,
        amount,
        category,
        filename,
        userId: request.user.id,
      },
    });

    return response.status(201).json();
  }
}

export { RefundsController };

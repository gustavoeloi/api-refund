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

  async index(request: Request, response: Response) {
    const querySchema = z.object({
      query: z.string().optional().default(""),
      page: z.coerce.number().optional().default(1),
      perPage: z.coerce.number().optional().default(10),
    });

    const { query, page, perPage } = querySchema.parse(request.query);

    const skip = (page - 1) * perPage;

    const refunds = await prisma.refunds.findMany({
      skip,
      take: perPage,
      where: {
        OR: [
          { user: { name: { contains: query.trim() } } },
          { name: { contains: query.trim() } },
        ],
      },
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    });

    // Calcular o total de registros para calcular o número de página.
    const totalRecords = await prisma.refunds.count({
      where: {
        OR: [
          { user: { name: { contains: query.trim() } } },
          { name: { contains: query.trim() } },
        ],
      },
    });

    const totalPages = Math.ceil(totalRecords / perPage);

    return response.json({
      refunds,
      pagination: {
        page,
        perPage,
        totalRecords,
        totalPages: totalPages > 0 ? totalPages : 1,
      },
    });
  }
}

export { RefundsController };

import { Request, Response } from "express";
import { z } from "zod";
import { hash } from "bcrypt";

import { prisma } from "@/database/prisma";
import { UserRole } from "@prisma/client";
import { AppError } from "@/utils/AppError";

class UsersController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z
        .string("Name is required")
        .trim()
        .min(3, "The Name should have a minimum of 3 characters"),
      email: z.email("E-mail is required"),
      password: z
        .string("Password is required")
        .min(6, "Password should have a minimum of 6 characters"),
      role: z.enum([UserRole.employee, UserRole.manager]).default("employee"),
    });

    const { name, email, password, role } = bodySchema.parse(request.body);

    const userWithEmail = await prisma.user.findFirst({ where: { email } });

    if (userWithEmail) {
      throw new AppError("User with email already exists");
    }

    const passwordHashed = await hash(email, 8);

    await prisma.user.create({
      data: {
        name,
        email,
        password: passwordHashed,
        role,
      },
    });

    return response.status(201).json();
  }
}

export { UsersController };

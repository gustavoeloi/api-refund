import { Request, Response } from "express";
import { z } from "zod";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";

import { AppError } from "@/utils/AppError";
import { prisma } from "@/database/prisma";
import { auth } from "@/configs/Auth";

interface IPayload {
  sub: string;
  role?: string;
}

class SessionsController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      email: z.email("Email is required"),
      password: z.string("Password is required"),
    });

    const { email, password } = bodySchema.parse(request.body);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError("Incorrect e-mail or password", 401);
    }

    let matchedPassword = await compare(password, user.password);

    if (!matchedPassword) {
      throw new AppError("Incorrect e-mail or password", 401);
    }

    const { secret, expiresIn } = auth.jwt;

    const token = sign(
      {
        role: user.role,
      },
      secret,
      {
        expiresIn: expiresIn,
        subject: user.id,
      },
    );

    const { password: _, ...userWithoutPassword } = user;

    return response.json({ token, user: userWithoutPassword });
  }
}

export { SessionsController };

import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

import { AppError } from "@/utils/AppError";
import { auth } from "@/configs/Auth";

interface PayloadInterface {
  role: string;
  sub: string;
}

function ensureAuthentication(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new AppError("JWT Invalid.");
    }

    const [_, token] = authHeader.split(" ");

    const { role, sub } = verify(token, auth.jwt.secret) as PayloadInterface;

    request.user = {
      role,
      id: sub,
    };

    next();
  } catch (error) {
    throw new AppError("JWT invalid.");
  }
}

export { ensureAuthentication };

import { AppError } from "@/utils/AppError";
import { UserRole } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

function verifyAuthorization(role: string[]) {
  return (request: Request, response: Response, next: NextFunction) => {
    if (!request.user || !role.includes(request.user.role)) {
      throw new AppError("Unauthorized.", 401);
    }

    next();
  };
}

export { verifyAuthorization };

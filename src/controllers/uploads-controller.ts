import { Request, Response } from "express";

class UploadsController {
  create(request: Request, response: Response) {
    return response.json({ message: "OK" });
  }
}

export { UploadsController };

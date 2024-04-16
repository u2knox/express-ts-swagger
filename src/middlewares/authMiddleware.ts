import { Request, Response } from "express";

import { useTokenService } from "../services/tokenService";
import { useUserService } from "../services/userService";

export const getUserMiddleware = async (
  req: Request,
  res: Response,
  next: () => void
) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    const tokenService = useTokenService();
    const userService = useUserService();

    const userId = await tokenService.verify(token);

    if (userId) {
      const roles = await userService.getUserRoles(userId);
      
      res.locals.userId = userId.toString();
      res.locals.roles = roles.map((role) => role.toString());
    } else {
      res.locals.roles = [];
    }
  }

  next();
};

export const isUserHaveRoles = (
  req: Request,
  res: Response,
  next: () => void,
  acceptRoles: number[] = []
) => {
  if (!req.headers.authorization) {
    return res.sendStatus(403);
  }

  const roles = res.locals.roles;

  if (acceptRoles.length) {
    for (const role of roles) {
      if (!acceptRoles.includes(parseInt(role))) {
        return res.sendStatus(403);
      }
    }
  }

  next();
};

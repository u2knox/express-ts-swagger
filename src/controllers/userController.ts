import express from 'express';

import { useUserService } from '../services/userService';
import { useTokenService } from '../services/tokenService';

import { dtoValidationMiddleware } from '../middlewares/dtoValidationMiddleware';

import { SignUpDTO, SignInDTO } from '../models/dto/userDTO';

export const useUserController = () => {

  const router = express.Router();

  const userService = useUserService();
  const tokenService = useTokenService();

  router.post('/signup', dtoValidationMiddleware(SignUpDTO), async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (await userService.getUser(username)) {
      res.status(409).json({
        message: 'Username already used'
      });
      return;
    }
    const userId = await userService.regUser(username, password);
    res.json(await tokenService.generatePair(userId));
    res.sendStatus(201);
  });

  router.post('/signin', dtoValidationMiddleware(SignInDTO), async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const userId = await userService.checkUser(username, password)
    if (!userId) {
      res.sendStatus(401);
      return;
    }
    res.json(await tokenService.generatePair(userId));
  });

  router.post('/refresh', async (req, res) => {
    const userId = await tokenService.removeTokens(req.body.refresh_token);
    if (!userId) {
      return res.sendStatus(403);
    }
    res.json(await tokenService.generatePair(userId));
  });

  router.post('/logout', async (req, res) => {
    const userId = await tokenService.logOut(req.headers.authorization.split(' ')[1]);
    if (!userId) {
      return res.sendStatus(400);
    }
    res.sendStatus(202);
  })

  return router;
}

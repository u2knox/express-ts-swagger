import express from 'express';

import { useUserService } from '../services/userService';
import { useTokenService } from '../services/tokenService';

export const useUserController = () => {

  const router = express.Router();

  const userService = useUserService();
  const tokenService = useTokenService();

  router.post('/signup', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (await userService.getUser(username)) {
      res.status(401);
      return;
    }
    const userId = await userService.regUser(username, password);
    res.json(await tokenService.generatePair(userId));
  });

  router.post('/signin', async (req, res) => {
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

  return router;
}

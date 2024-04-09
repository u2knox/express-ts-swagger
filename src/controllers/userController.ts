import express from 'express';

import { useUserService } from '../services/userService';

export const useUserController = () => {
  const router = express.Router();

  const userService = useUserService();

  router.post('/signup', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (await userService.getUser(username)) {
      res.status(401);
      return;
    }
    res.json({
      userId: await userService.regUser(username, password)
    });
  });
  router.post('/signin', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const userId = await userService.checkUser(username, password)
    if (!userId) {
      res.sendStatus(401);
      return;
    }
    res.json({
      userId
    });
  });

  return router;
}

import type { Application } from "express";

import { useUserController } from "../controllers/userController";
import { usePostController } from "../controllers/postController";

export default (app: Application) => {
  app.use("/user", useUserController());
  app.use('/post', usePostController());
};

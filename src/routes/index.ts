import type { Application } from "express";

import { useUserController } from "../controllers/userController";
import { usePostController } from "../controllers/postController";
import { userFileService } from "../controllers/fileController";
import { getUserMiddleware } from "../middlewares/authMiddleware";

export default (app: Application) => {
  app.use(getUserMiddleware);
  app.use("/user", useUserController());
  app.use("/post", usePostController());
  app.use("/file", userFileService());
};

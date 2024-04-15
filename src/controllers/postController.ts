import express from "express";
import multer from 'multer';

import { usePostService } from "../services/postService";
import { useFileService } from "../services/fileService";

import { dtoValidationMiddleware } from "../middlewares/dtoValidationMiddleware";

import { Role } from "../const/roles";

import { AddCategoryDTO, AddPostDTO } from "../models/dto/postDTO";

export const usePostController = () => {
  const upload = multer({ dest: 'public/posts/' })
  const router = express.Router();
  const { getPosts, addCategory, getCategories, addPost } = usePostService();
  const { saveInfo } = useFileService();

  router.get("/", async (req, res) => {
    res.json(await getPosts());
  });

  router.post("/add/category", dtoValidationMiddleware(AddCategoryDTO), async (req, res) => {
    if (!req.headers.roles?.includes(Role.ADMIN.toString())) {
      return res.sendStatus(403);
    }
    
    const name = req.body.name;
    const id = await addCategory(name);
    if (id) {
      res.json({
        id,
      });
    } else {
      res.sendStatus(400);
    }
  });

  router.get("/categories", async (req, res) => {
    res.json(await getCategories());
  });

  router.post("/add", upload.single('img'), dtoValidationMiddleware(AddPostDTO), async (req, res) => {

    if (!req.headers.roles?.includes(Role.ADMIN.toString())) {
      return res.sendStatus(403);
    }
    const { title, userId, categoryId, body } = req.body;

    const imgId = await saveInfo(req.file.fieldname, req.file.originalname);

    const post = await addPost(title, parseInt(userId), parseInt(categoryId), body, imgId);
    if (!post) {
      res.sendStatus(400);
      return;
    }
    res.send({
      id: post.id,
    });
  });

  return router;
};

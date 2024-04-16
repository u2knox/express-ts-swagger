import express from "express";
import multer from "multer";

import { usePostService } from "../services/postService";
import { useFileService } from "../services/fileService";

import { dtoValidationMiddleware } from "../middlewares/dtoValidationMiddleware";

import { Role } from "../const/roles";

import { AddCategoryDTO, AddPostDTO, EditPostDTO } from "../models/dto/postDTO";
import { unlink } from "fs";

export const usePostController = () => {
  const upload = multer({ dest: "public/posts/" });
  const router = express.Router();
  const {
    getPost,
    getPosts,
    addCategory,
    getCategories,
    addPost,
    removePost,
    removeCategory,
    editPost,
  } = usePostService();
  const { saveInfo, getLinkToFile } = useFileService();

  router.get("/", async (req, res) => {
    const posts = await getPosts();
    res.json(
      posts.map((post) => ({
        ...post,
        imgUrl: getLinkToFile(post.imgId),
      }))
    );
  });

  router.get("/:id", async (req, res) => {
    try {
      const post = await getPost(parseInt(req.params.id));
      res.json({
        ...post,
        imgUrl: getLinkToFile(post.imgId),
      });
    } catch {
      res.sendStatus(404);
    }
  });

  router.post(
    "/add/category",
    dtoValidationMiddleware(AddCategoryDTO),
    async (req, res) => {
      if (!res.locals.roles?.includes(Role.ADMIN.toString())) {
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
    }
  );

  router.get("/categories", async (req, res) => {
    res.json(await getCategories());
  });

  router.post(
    "/add",
    upload.single("img"),
    dtoValidationMiddleware(AddPostDTO),
    async (req, res) => {
      if (!res.locals.roles?.includes(Role.ADMIN.toString())) {
        if (req.file) {
          unlink(req.file.destination + req.file.filename, () => {});
        }
        return res.sendStatus(403);
      }
      const { title, userId, categoryId, body } = req.body;

      const imgId = await saveInfo(
        req.file.filename,
        req.file.originalname,
        req.file.mimetype,
        req.file.path
      );

      const post = await addPost(
        title,
        parseInt(userId),
        parseInt(categoryId),
        body,
        imgId
      );
      if (!post) {
        if (req.file) {
          unlink(req.file.destination + req.file.filename, () => {});
        }
        res.sendStatus(400);
        return;
      }
      res.send({
        id: post.id,
      });
    }
  );

  router.delete("/remove/:id", async (req, res) => {
    if (!res.locals.roles?.includes(Role.ADMIN.toString())) {
      return res.sendStatus(403);
    }
    if (await removePost(parseInt(req.params.id))) {
      return res.sendStatus(200);
    }
    return res.sendStatus(404);
  });

  router.delete("/category/remove/:id", async (req, res) => {
    if (!res.locals.roles?.includes(Role.ADMIN.toString())) {
      return res.sendStatus(403);
    }
    if (await removeCategory(parseInt(req.params.id))) {
      return res.sendStatus(200);
    }
    return res.sendStatus(404);
  });

  router.post(
    "/edit/:id",
    dtoValidationMiddleware(EditPostDTO),
    async (req, res) => {
      if (!res.locals.roles?.includes(Role.ADMIN.toString())) {
        return res.sendStatus(403);
      }
      const id = parseInt(req.params.id);
      res.json(await editPost(id, req.body));
    }
  );

  return router;
};

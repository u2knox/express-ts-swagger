import express from "express";

import { usePostService } from "../services/postService";

export const usePostController = () => {
  const router = express.Router();
  const { getPosts, addCategory, getCategories, addPost } = usePostService();

  router.get("/", async (req, res) => {
    res.json(await getPosts());
  });

  router.post("/add/category", async (req, res) => {
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

  router.post("/add", async (req, res) => {
    const { title, userId, categoryId, body } = req.body;
    const post = await addPost(title, userId, categoryId, body);
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

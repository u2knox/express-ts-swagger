import { Post, PostCategory, PrismaClient } from "@prisma/client";

export const usePostService = () => {
  const prisma = new PrismaClient();

  const getPosts = async (): Promise<Post[]> => {
    return await prisma.post.findMany();
  };

  const addCategory = async (name: string): Promise<number> => {
    const res = await prisma.postCategory.create({
      data: {
        name,
      },
    });
    return res.id;
  };

  const getCategories = async (): Promise<PostCategory[]> => {
    return await prisma.postCategory.findMany();
  };

  const addPost = async (
    title: string,
    userId: number,
    categoryId: number,
    body: string
  ): Promise<Post> => {
    return await prisma.post.create({
      data: {
        title,
        userId,
        categoryId,
        body,
      },
    });
  };

  return { getPosts, addCategory, getCategories, addPost };
};

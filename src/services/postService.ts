import { Post, PostCategory, Prisma } from "@prisma/client";

import { prisma } from "./prismaService";

export const usePostService = () => {
  const getPosts = async (): Promise<Post[]> => {
    return await prisma.post.findMany();
  };

  const getPost = async (id: number): Promise<Post> => {
    return await prisma.post.findFirst({
      where: { id },
    });
  };

  const addCategory = async (name: string): Promise<number> => {
    const res = await prisma.postCategory.create({
      data: {
        name,
      },
    });
    return res.id;
  };

  const removeCategory = async (id: number): Promise<boolean> => {
    const isFound = await prisma.postCategory.findFirst({ where: { id } });
    if (!isFound) return false;
    const isFoundChildren = await prisma.post.findFirst({
      where: { categoryId: id },
    });
    if (isFoundChildren) return false;
    return !!(await prisma.postCategory.delete({ where: { id } }));
  };

  const getCategories = async (): Promise<PostCategory[]> => {
    return await prisma.postCategory.findMany();
  };

  const addPost = async (
    title: string,
    userId: number,
    categoryId: number,
    body: string,
    imgId: number
  ): Promise<Post> => {
    const isFound = await prisma.postCategory.findFirst({ where: { id: categoryId } });
    if (!isFound) return null;
  
    return await prisma.post.create({
      data: {
        title,
        userId,
        categoryId,
        body,
        imgId,
      },
    });
  };

  const removePost = async (id: number): Promise<boolean> => {
    if (!(await getPost(id))) {
      return false;
    }

    const res = await prisma.post.delete({
      where: {
        id,
      },
    });
    return !!res;
  };

  const editPost = async (id: number, editedField: Prisma.PostUpdateInput) => {

    await prisma.post.update({
      where: {
        id: id,
      },
      data: editedField,
    });
  };

  return {
    getPosts,
    addCategory,
    getCategories,
    addPost,
    removePost,
    removeCategory,
    editPost,
    getPost,
  };
};

import { PrismaClient } from "@prisma/client"

import { prisma } from "./prismaService";

export const useFileService = () => {
  const saveInfo = async (name: string, originalname: string): Promise<number> => {
    const res = await prisma.file.create({
      data: {
        name,
        originalname
      }
    });
    return res.id;
  }

  return { saveInfo };
}
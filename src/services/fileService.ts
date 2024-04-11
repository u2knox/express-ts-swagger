import { PrismaClient } from "@prisma/client"

export const useFileService = () => {
  const prisma = new PrismaClient();

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
import { prisma } from "./prismaService";
import { config } from "dotenv";

const dotenv = config();

export const useFileService = () => {
  const saveInfo = async (
    filename: string,
    originalname: string,
    mimetype: string,
    path: string
  ): Promise<number> => {
    const res = await prisma.file.create({
      data: {
        filename,
        originalname,
        mimetype,
        path,
      },
    });
    return res.id;
  };

  const getFile = async (id: number) => {
    return await prisma.file.findFirst({
      where: { id },
    });
  };

  const getLinkToFile = (id: number) => {
    return `${dotenv.parsed.BASE_URL}/file/${id}`
  }

  return { saveInfo, getFile, getLinkToFile };
};

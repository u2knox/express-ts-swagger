import { createHash } from "crypto";
import { PrismaClient, User } from '@prisma/client';

export const useUserService = () => {
  const prisma = new PrismaClient();

  const regUser = async (username: string, password: string): Promise<number | null> => {
    const hashPass = createHash('sha256').update(password).digest('hex');
    const user = await prisma.user.create({
      data: {
        username,
        password: hashPass
      }
    })
    if (!user) return null;
    return user.id;
  }

  const getUser = async (username: string): Promise<User | null> => {
    const user = await prisma.user.findFirst({
      where: {
        username,
      }
    })
    return user;
  }

  const checkUser = async (username: string, password: string): Promise<number | null> => {
    const hashPass = createHash('sha256').update(password).digest('hex');
    const user = await prisma.user.findFirst({
      where: {
        username,
        password: hashPass
      }
    })
    console.log(user)
    if (!user) return null;
    return user.id;
  }

  return { regUser, getUser, checkUser };
}
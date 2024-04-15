import { createHash } from "crypto";
import { User } from '@prisma/client';

import { prisma } from "./prismaService";

export const useUserService = () => {
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

  const getUserRoles = async (userId: number): Promise<number[]> => {
    const roles = await prisma.userRoles.findMany({
      where: {
        userId
      }
    });
    return roles.map(role => role.roleId);
  }

  const checkUser = async (username: string, password: string): Promise<number | null> => {
    const hashPass = createHash('sha256').update(password).digest('hex');
    const user = await prisma.user.findFirst({
      where: {
        username,
        password: hashPass
      }
    })
    if (!user) return null;
    return user.id;
  }

  return { regUser, getUser, checkUser, getUserRoles };
}
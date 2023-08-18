import type { Password, User } from "@prisma/client";

import bcrypt from "bcryptjs";

import { prisma } from "~/db.server";
import { createUserSession } from "./session.server";
// import { request } from "http";

export type { User } from "@prisma/client";

export async function getUserById(id: User["id"]) {
 
  try {
    return prisma.user.findUnique({ where: { id } });
  } catch (error) {
    throw error;
  }
}

export async function getUserByEmail(email: User["email"]) {
  try {
    return prisma.user.findUnique({ where: { email } });
  } catch (error) {
    throw error;
  }
}

export async function createUser(
  email: User["email"],
  password: string,
  remember: boolean
) {
  //check for existing email
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) throw new Error("A user with that email already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: {
          create: {
            hash: hashedPassword,
          },
        },
      },
    });

    if (!newUser) throw new Error("Could not create user");

    return createUserSession({
      userId: newUser.id,
      remember,
    });
  } catch (error) {
    throw error;
  }
}

export async function deleteUserByEmail(email: User["email"]) {
  try {
    return prisma.user.delete({ where: { email } });
  } catch (error) {
    throw error;
  }
}

export async function verifyLogin(
  email: User["email"],
  password: Password["hash"],
  remember: boolean
) {
  try {
    const userWithPassword = await prisma.user.findUnique({
      where: { email },
      include: {
        password: true,
      },
    });

    if (!userWithPassword || !userWithPassword.password) {
      throw new Error("The provided credentials are invalid");
    }

    const isValid = await bcrypt.compare(
      password,
      userWithPassword.password.hash
    );

    if (!isValid) throw new Error("The provided credentials are invalid");

    const { password: _password, ...userWithoutPassword } = userWithPassword;

    return createUserSession({
      userId: userWithoutPassword.id,
      remember,
    });
  } catch (error) {
    throw error;
  }
}

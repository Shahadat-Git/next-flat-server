import bcrypt from "bcrypt";
import prisma from "../../utils/prisma";
import { User, UserRole, UserStatus } from "@prisma/client";
import { TLoginUser } from "./user.interface";
import config from "../../config";
import { jwtHelper } from "../../helpers/jwtHelper";
import AppError from "../../error/appError";
import httpStatus from "http-status";

// register user
const registerUserIntoDB = async (payload: User) => {
  const isUserExists = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });
  if (isUserExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "This user already exists");
  }

  const hashedPassword = await bcrypt.hash(payload.password, 12);
  payload.password = hashedPassword;

  const result = await prisma.user.create({
    data: payload,
    select: {
      id: true,
      username: true,
      email: true,
      status: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return result;
};

// login user into db
const loginUserIntoDB = async (payload: TLoginUser) => {
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const isPasswordMatched = await bcrypt.compare(
    payload?.password,
    user?.password
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.FORBIDDEN, "Password does not matched");
  }

  const jwtPayload = {
    id: user.id,
    email: user?.email,
    role: user?.role,
  };
  const accessToken = jwtHelper.generateToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );
  return {
    token: accessToken,
  };
};

// get all user from db
const getAllUserFromDB = async () => {
  const result = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      status: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return result;
};

//get user profile
const getUserProfileFromDB = async (userId: string) => {
  const result = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      username: true,
      email: true,
      status: true,
      role: true,
    },
  });

  return result;
};

// change user status
const changeUserStatusIntoDB = async (userId: string, status: UserStatus) => {
  console.log("userId", userId);
  console.log("status", status);
  const userInfo = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!userInfo) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  const result = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      status: status,
    },
  });
  return result;
};

// change user role
const changeUserRoleIntoDB = async (userId: string, role: UserRole) => {
  const userInfo = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!userInfo) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  const result = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      role: role,
    },
  });
  return result;
};

// change password
const changePasswordIntoDB = async (
  userId: string,
  payload: { currentPassword: string; newPassword: string }
) => {
  const userInfo = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!userInfo) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  const isPasswordMatched = await bcrypt.compare(
    payload?.currentPassword,
    userInfo?.password
  );
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.FORBIDDEN, "Password does not matched");
  }
  const hashedPassword = await bcrypt.hash(payload?.newPassword, 12);
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: hashedPassword,
    },
  });

  return null;
};

// edit profile
const updateProfileIntoDB = async (
  userId: string,
  payload: { username: string; email: string }
) => {
  const userInfo = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!userInfo) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not exist");
  }
  const result = await prisma.user.update({
    where: {
      id: userId,
    },
    data: payload,
    select: {
      id: true,
      username: true,
      email: true,
      status: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return result;
};

export const userService = {
  registerUserIntoDB,
  loginUserIntoDB,
  getAllUserFromDB,
  getUserProfileFromDB,
  changeUserStatusIntoDB,
  changeUserRoleIntoDB,
  changePasswordIntoDB,
  updateProfileIntoDB,
};

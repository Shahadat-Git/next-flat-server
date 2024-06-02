import express from "express";
import { userController } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import { userValidation } from "./user.validation";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

// user register
router.post(
  "/register",
  validateRequest(userValidation.createUserValidationSchema),
  userController.registerUser
);

//user login
router.post("/login", userController.loginUser);

// get add user for admin
router.get("/", auth(UserRole.ADMIN), userController.getAllUser);

// get profile
router.get(
  "/profile",
  auth(UserRole.ADMIN, UserRole.USER),
  userController.getUserProfile
);

// change user role
router.patch(
  "/change-status/:userId",
  auth(UserRole.ADMIN),
  userController.changeUserStatus
);

// change user status
router.patch(
  "/change-role/:userId",
  auth(UserRole.ADMIN),
  userController.changeUserRole
);

// change user password
router.post(
  "/change-password",
  auth(UserRole.USER, UserRole.ADMIN),
  userController.changePassword
);

// changer user id and email
router.patch(
  "/update-profile",
  auth(UserRole.USER, UserRole.ADMIN),
  userController.updateProfile
);

export const userRoutes = router;

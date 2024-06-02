import express from "express";
import { flatController } from "./flat.controller";
import validateRequest from "../../middlewares/validateRequest";
import { flatValidation } from "./flat.validation";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
const router = express.Router();

// create flat
router.post(
  "/",
  auth(UserRole.USER),
  validateRequest(flatValidation.createFlatValidationSchema),
  flatController.createFlat
);

// get flats
router.get("/", flatController.getFlats);
// get my flats
router.get("/my-flats", auth(UserRole.USER), flatController.getMyFlats);
// get single flat
router.get("/:flatId", flatController.getSingleFlat);
// update flat
router.put(
  "/:flatId",
  auth(UserRole.USER, UserRole.ADMIN),
  validateRequest(flatValidation.updateFlatValidationSchema),
  flatController.updateFlat
);
// delete flat
router.delete("/:id", auth(UserRole.ADMIN), flatController.deleteFlat);

export const flatRoutes = router;

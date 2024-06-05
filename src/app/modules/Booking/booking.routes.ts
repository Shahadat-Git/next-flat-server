import express from "express";
import auth from "../../middlewares/auth";
import { bookingController } from "./booking.controller";
import validateRequest from "../../middlewares/validateRequest";
import { bookingValidation } from "./booking.validation";
import { UserRole } from "@prisma/client";

const router = express.Router();

// create booking
router.post(
  "/",
  auth(UserRole.USER),
  validateRequest(bookingValidation.createBookingValidationSchema),
  bookingController.createBooking
);
// get my booking
router.get(
  "/my-booking-requests",
  auth(UserRole.USER),
  bookingController.getMyBookingRequests
);

// update booking
router.put(
  "/:bookingId",
  auth(UserRole.USER, UserRole.ADMIN),
  validateRequest(bookingValidation.updateBookingFlatApplicationStatusSchema),
  bookingController.updateBookingFlatApplicationStatus
);

// get all booking
router.get(
  "/all-booking-requests",
  auth(UserRole.ADMIN),
  bookingController.getAllBookingRequests
);
export const bookingRoutes = router;

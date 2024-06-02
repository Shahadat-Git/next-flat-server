import { Booking, BookingStatus } from "@prisma/client";
import prisma from "../../utils/prisma";
import AppError from "../../error/appError";
import httpStatus from "http-status";

const createBookingIntoDB = async (userId: string, payload: Booking) => {
  const flat = await prisma.flat.findUnique({
    where: {
      id: payload.flatId,
    },
  });
  if (!flat) {
    throw new AppError(httpStatus.NOT_FOUND, "Flat not found");
  }
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  payload.userId = userId;
  const result = await prisma.booking.create({
    data: payload,
  });

  return result;
};
// get booking requests from db
const getMyBookingRequestsFromDB = async (userId: string) => {
  const result = await prisma.booking.findMany({
    where: {
      userId,
    },
    include: {
      flat: true,
    },
  });
  return result;
};

// update booking flat application status into db
const updateBookingFlatApplicationStatusIntoDB = async (
  bookingId: string,
  status: BookingStatus
) => {
  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
  });
  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking is not found");
  }
  console.log(status);
  const result = await prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: { status: status },
  });

  return result;
};
export const bookingService = {
  createBookingIntoDB,
  getMyBookingRequestsFromDB,
  updateBookingFlatApplicationStatusIntoDB,
};

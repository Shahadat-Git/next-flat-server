import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { bookingService } from "./booking.service";

// create booking
const createBooking = catchAsync(async (req, res) => {
  const userId = req?.user?.id;
  const result = await bookingService.createBookingIntoDB(userId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Booking requests submitted successfully",
    data: result,
  });
});

// get booking request
const getMyBookingRequests = catchAsync(async (req, res) => {
  const userId = req?.user?.id;
  const result = await bookingService.getMyBookingRequestsFromDB(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Booking requests retrieved successfully",
    data: result,
  });
});

// update booking request status
const updateBookingFlatApplicationStatus = catchAsync(async (req, res) => {
  const bookingId = req.params.bookingId;
  const result = await bookingService.updateBookingFlatApplicationStatusIntoDB(
    bookingId,
    req.body?.status
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Booking request updated successfully",
    data: result,
  });
});

// get booking request
const getAllBookingRequests = catchAsync(async (req, res) => {
  const result = await bookingService.getAllBookingRequestsFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Booking requests retrieved successfully",
    data: result,
  });
});

export const bookingController = {
  createBooking,
  getMyBookingRequests,
  updateBookingFlatApplicationStatus,
  getAllBookingRequests
};

import { Flat, Prisma } from "@prisma/client";
import prisma from "../../utils/prisma";
import { TPaginationOptions } from "../../interface/pagination.interface";
import { TFlatFilterableFields } from "./flat.interface";
import { calculatePagination } from "../../helpers/paginatonHelper";
import { flatSearchableFields } from "./flat.constant";
import AppError from "../../error/appError";
import httpStatus from "http-status";
import convertStringParamsToBoolean from "../../helpers/convertSrtingToBoolean";

// create flat
const createFlatIntoDB = async (userId: string, payload: Flat) => {
  payload.userId = userId;
  const result = await prisma.flat.create({
    data: payload,
  });

  return result;
};

// get flats
const getFlatsFromDB = async (
  query: TFlatFilterableFields,
  options: TPaginationOptions
) => {
  const convertStringToBoolean = convertStringParamsToBoolean(query);
  const { page, limit, skip } = calculatePagination(options);
  const { searchTerm, ...filterData } = convertStringToBoolean;
  console.log(filterData);
  filterData.totalBedrooms = Number(filterData.totalBedrooms);
  filterData.minPrice = Number(filterData.minPrice);
  filterData.maxPrice = Number(filterData.maxPrice);
  const andConditions: Prisma.FlatWhereInput[] = [];

  if (query?.searchTerm) {
    andConditions.push({
      OR: flatSearchableFields.map((field) => ({
        [field]: {
          contains: query?.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (filterData?.totalBedrooms) {
    andConditions.push({
      totalBedrooms: {
        equals: filterData?.totalBedrooms,
      },
    });
  }

  if (filterData.minPrice && !filterData.maxPrice) {
    andConditions.push({
      rentAmount: {
        gte: filterData.minPrice,
      },
    });
  }
  if (!filterData.minPrice && filterData.maxPrice) {
    andConditions.push({
      rentAmount: {
        lte: filterData.maxPrice,
      },
    });
  }
  if (filterData.minPrice && filterData.maxPrice) {
    andConditions.push({
      rentAmount: {
        lte: filterData.maxPrice,
        gte: filterData.minPrice,
      },
    });
  }
  const whereConditions: Prisma.FlatWhereInput = { AND: andConditions };
  console.dir(whereConditions, { depth: "infinity" });
  const result = await prisma.flat.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options?.sortOrder
        ? {
            [options?.sortBy]: options?.sortOrder,
          }
        : {
            createdAt: "desc",
          },
  });
  const total = await prisma.flat.count({
    where: whereConditions,
  });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// get single flat
const getSingleFlatFromDB = async (flatId: string) => {
  const flat = await prisma.flat.findUnique({
    where: {
      id: flatId,
    },
  });
  if (!flat) {
    throw new AppError(httpStatus.NOT_FOUND, "Flat not found");
  }
  return flat;
};

// get my flats
const getMyFlatsFromDB = async (userId: string) => {
  const result = await prisma.flat.findMany({
    where: {
      userId,
    },
  });
  return result;
};

// update flat into db
const updateFlatIntoDB = async (flatId: string, payload: Partial<Flat>) => {
  const flat = await prisma.flat.findUnique({
    where: {
      id: flatId,
    },
  });
  if (!flat) {
    throw new AppError(httpStatus.NOT_FOUND, "Flat not found");
  }
  const result = await prisma.flat.update({
    where: {
      id: flatId,
    },
    data: payload,
  });

  return result;
};

// delete flat
const deleteFlatFromDB = async (id: string) => {
  const flat = await prisma.flat.findUnique({
    where: {
      id,
    },
  });
  if (!flat) {
    throw new AppError(httpStatus.NOT_FOUND, "Flat not found");
  }

  const result = await prisma.$transaction(async (transactionClient) => {
    const deleteBooking = await transactionClient.booking.deleteMany({
      where: {
        flatId: id,
      },
    });

    const deleteFlat = await transactionClient.flat.delete({
      where: {
        id,
      },
    });
  });
  return result;
};

export const flatService = {
  createFlatIntoDB,
  getFlatsFromDB,
  getMyFlatsFromDB,
  getSingleFlatFromDB,
  updateFlatIntoDB,
  deleteFlatFromDB,
};

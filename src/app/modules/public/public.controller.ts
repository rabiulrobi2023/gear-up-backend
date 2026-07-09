import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PublicService } from "./public.service";


const getAllGear = catchAsync(async (req, res, next) => {
  const result = await PublicService.getAllGearFromDB(req.query);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message:
      result.length > 0 ? "Gears retrieved successfully" : "No items found",
    data: result,
  });
});

const getSingleGear = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const result = await PublicService.getSingleGearFromDB(id as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: result ? "Gear retrieved successfully" : "No gear found",
    data: result,
  });
});

const getAllCategories = catchAsync(async (req, res, next) => {
  const result = await PublicService.getAllCategoriesFromDB();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message:
      result.length > 0
        ? "Categories retrieved successfully"
        : "No categories found",
    data: result,
  });
});

export const PublicController = {
  getAllGear,
  getSingleGear,
  getAllCategories,
};

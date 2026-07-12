import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AdminService } from "./admin.service";

const createCategory = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await AdminService.createCategoryIntoDB(payload);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Category created successfully",
    data: result,
  });
});

const getAllUsers = catchAsync(async (req, res, next) => {
  const result = await AdminService.getAllUser(req.query);
    sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Users retrieved successfully",
    data: result,
  });
});

export const AdminController = {
  createCategory,getAllUsers
};

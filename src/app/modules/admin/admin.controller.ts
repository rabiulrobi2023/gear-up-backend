import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AdminService } from "./admin.service";
import { UserStatus } from "../../../../generated/prisma/enums";

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

const getAllOrders = catchAsync(async (req, res, next) => {
  const result = await AdminService.getAllOrder();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message:
      result.length > 0
        ? "Order retrieved successfully"
        : "There is no any order",
    data: result,
  });
});

const updateUserStatus = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const selfId = req.user.id;
  const payload = req.body;

  const result = await AdminService.updateUserStatus(
    id as string,
    selfId as string,
    payload,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: `User ${result.status === UserStatus.ACTIVE ? "activated" : "suspended"} successfully`,
    data: result,
  });
});

export const AdminController = {
  createCategory,
  getAllUsers,
  getAllOrders,
  updateUserStatus,
};

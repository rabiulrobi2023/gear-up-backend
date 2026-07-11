import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { OrderService } from "./order.service";

const createOrder = catchAsync(async (req, res, next) => {
  const payload = req.body;
  const customerId = req.user.id;
  const result = await OrderService.createOrderFromDB(customerId, payload);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Order created successfully",
    data: result,
  });
});

const getOrders = catchAsync(async (req, res, next) => {
  const id = req.user.id;
  const result = await OrderService.getOrdersFromDB(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Order created successfully",
    data: result,
  });
});

export const OrderController = {
  createOrder,
  getOrders
};

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
  const customerId = req.user.id;
  const result = await OrderService.getAllOrdersFromDB(customerId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: result.length>0?"Orders retrieved successfully":"There is no any order",
    data: result,
  });
});

const getSingleOrder = catchAsync(async (req, res, next) => {
  const customerId = req.user.id;
  const orderId = req.params.id
  const result = await OrderService.getSingleOrderFromDB(customerId, orderId as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Orders retrieved successfully",
    data: result,
  });
});


export const OrderController = {
  createOrder,
  getOrders,
  getSingleOrder
};

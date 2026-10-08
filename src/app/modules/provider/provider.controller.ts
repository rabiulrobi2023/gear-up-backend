import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ProviderService } from "./provider.service";

const addItem = catchAsync(async (req, res, next) => {
  const payload = req.body;
  const userId = req.user.id;
  const result = await ProviderService.addItem(userId, payload);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Item added successfully",
    data: result,
  });
});

const updateItem = catchAsync(async (req, res, next) => {
  const itemId = req.params.itemId;
  const providerId = req.user.id;
  const payload = req.body;
  const result = await ProviderService.updateItem(
    itemId as string,
    providerId,
    payload,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Gear updated successfully",
    data: result,
  });
});
const getMyGears = catchAsync(async (req, res, next) => {
  const providerId = req.user.id;
  const result = await ProviderService.getMyGears(providerId as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Gear retrieved successfully",
    data: result,
  });
});

const getMyAllOrders = catchAsync(async (req, res, next) => {
  const providerId = req.user.id;
  
  const result = await ProviderService.getMyGears(providerId as string);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Order retrieved successfully",
    data: result,
  });
});
const getMyPendingOrders = catchAsync(async (req, res, next) => {
  const providerId = req.user.id;
  const result = await ProviderService.getMyPendingOrdersFromDB(
    providerId as string,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Order retrieved successfully",
    data: result,
  });
});

const updateOrderStatus = catchAsync(async (req, res, next) => {

  const orderId = req.params.id;

  const payload = req.body;

  const result = await ProviderService.updateOrderStatusIntoDB(
    orderId as string,
    payload,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Order status updated successfully",
    data: result,
  });
});

const deleteGear = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const providerId = req.user.id
  const result = await ProviderService.deleteGearFromDB(id as string, providerId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Gear deleted successfully",
    data: result,
  });
});

const getProviderItemStatistics = catchAsync(async (req, res, next) => {
  const providerId = req.user.id;
  const result = await ProviderService.getProviderItemStatistics(providerId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Provider gear statistics retrieved successfully",
    data: result,
  });
});

export const ProviderController = {
  addItem,
  updateItem,
  deleteGear,
  getMyGears,
  getMyAllOrders,
  getMyPendingOrders,
  updateOrderStatus,
  getProviderItemStatistics,
};

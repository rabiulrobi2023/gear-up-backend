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

export const ProviderController = {
    addItem
};

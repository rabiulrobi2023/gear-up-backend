import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthService } from "./auth.service";

const registerUser = catchAsync(async (req, res, next) => {
  const payload = req.body;
  const result = await AuthService.registerUserIntoDB(payload);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: "User registered successfully",
    data: result,
  });
});
export const AuthController = {
  registerUser,
};

import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthService } from "./auth.service";
import {
  setAccessTokenIntoCookie,
  setRefreshTokenIntoCookie,
} from "../../utils/cookie";


const registerUser = catchAsync(async (req, res, next) => {
  const payload = req.body;
  const result = await AuthService.registerUserIntoDB(payload);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: "User registered successfully",
    data: result,
  });
});

const loginUser = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const result = await AuthService.loginUserIntoDB(email, password);
  setAccessTokenIntoCookie(res, result.accessToken);
  setRefreshTokenIntoCookie(res, result.refreshToken);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "User login successfully",
    data: result,
  });
});

const getMe = catchAsync(async (req, res, next) => {
  const id = req.user?.id;
  const result = await AuthService.getMeFromDB(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "User retrieved successfully",
    data: result,
  });
});
export const AuthController = {
  registerUser,
  loginUser,
  getMe,
};

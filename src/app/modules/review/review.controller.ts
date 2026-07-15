import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ReviewService } from "./review.service";

const createReview = catchAsync(async (req, res, next) => {
  const customerId = req.user?.id;
  const payload = req.body;
  const result = await ReviewService.createReview(customerId, payload);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Review created successfully",
    data: result,
  });
});

export const ReviewController = {
  createReview,
};

import catchAsync from "../utils/catchAsync";
import { ZodObject } from "zod";

const validationRequest = (zodSchema: ZodObject) => {
  return catchAsync(async (req, res, next) => {
    if (req.body.data) {
      req.body = req.body(JSON.parse(req.body.dada));
    }

    await zodSchema.parseAsync(req.body);
    next();
  });
};

export default validationRequest;

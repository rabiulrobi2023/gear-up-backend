import { Response } from "express";
interface IMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}
interface IResponse<T> {
  statusCode: number;
  message: string;
  data?: T;
  meta?: IMeta;
}

const sendResponse = <T>(res: Response, data: IResponse<T>) => {
  res.status(data.statusCode).json({
    success: true,
    message: data.message,
    data: data.data,
    meta: data.meta,
  });
};

export default sendResponse;

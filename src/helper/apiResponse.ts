import { NextApiResponse } from "next";

interface ApiResponse {
  meta: {
    status: number;
    message: string;
  };
  data?: any;
}

export const Response = (
  res: NextApiResponse<ApiResponse>,
  status: number,
  message: string,
  data?: any
) => {
  res.status(status).json({
    meta: {
      status,
      message,
    },
    data,
  });
};

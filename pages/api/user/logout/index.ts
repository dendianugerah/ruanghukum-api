import { NextApiRequest, NextApiResponse } from "next";
import { Response } from "@/src/helper/apiResponse";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method === "GET") {
    return Response(res, 200, "Logout success", {
      type: "user - logout",
    });
  }
}

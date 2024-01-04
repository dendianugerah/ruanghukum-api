import { NextApiRequest, NextApiResponse } from "next";
import { Response } from "@/src/helper/apiResponse";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method === "GET") {
    res.setHeader("Set-Cookie", `token=; path=/; HttpOnly`);
    return Response(res, 200, "Logout success", {
      type: "user - logout",
    });
  }
}

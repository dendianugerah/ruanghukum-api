import { NextApiRequest, NextApiResponse } from "next";
import verifyToken from "@/src/helper/verifyToken";

export default function withAuth(handler: any) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const token = (req.headers.authorization || "").split("Bearer ").at(1);

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const decoded = verifyToken(token);
      req.userId = decoded.userId;
      req.email = decoded.email;

      return handler(req, res);
    } catch (error) {
      console.error("Error in withAuth:", error);
      return res.status(401).json({ message: "Unauthorized" });
    }
  };
}

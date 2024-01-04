import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

const verifyToken = (token: string): { userId: string; email: string } => {
  return jwt.verify(token, process.env.JWT_SECRET as string) as {
    userId: string;
    email: string;
  };
};

export default function withAuth(handler: any) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.cookies.token;

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

import jwt from "jsonwebtoken";

const verifyToken = (token: string): { userId: string; email: string } => {
  return jwt.verify(token, process.env.JWT_SECRET as string) as {
    userId: string;
    email: string;
  };
};

export default verifyToken;
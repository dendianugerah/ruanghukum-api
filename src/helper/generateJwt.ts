import jwt from "jsonwebtoken";

export default function generateJwt(userId: string, email: string) {
  const token = jwt.sign({ userId, email }, process.env.JWT_SECRET as string, {
    expiresIn: "1h",
  });

  return token;
}

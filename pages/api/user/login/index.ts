import { NextApiRequest, NextApiResponse } from "next";
import db, { user } from "@/src/config/db";
import compareHash from "@/src/helper/compareHash";
import { sql } from "drizzle-orm";
import { Response } from "@/src/helper/apiResponse";

interface LoginApiRequest extends NextApiRequest {
  body: {
    email: string;
    password: string;
  };
}

export default async function handler(
  req: LoginApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    try {
      if (!email || !password) {
        return res.status(400).json({ message: "Please fill all fields" });
      }

      const query = await db
        .execute(
          sql`SELECT email, password FROM ${user} WHERE email = ${email}`
        )
        .catch((error) => {
          throw error;
        });

      if (query.length === 0) {
        return res.status(400).json({ message: "User not found" });
      }

      const isPasswordMatch = await compareHash(
        password,
        query[0]?.password as string
      );

      if (!isPasswordMatch) {
        return res.status(400).json({ message: "Password not match" });
      }

      return Response(res, 200, "Login success", {
        type: "user - login",
        payload: {
          email: email,
        },
      });
    } catch (error) {
      console.error("Error in login:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}

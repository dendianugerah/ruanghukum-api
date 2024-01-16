import { NextApiRequest, NextApiResponse } from "next";
import db, { user } from "@/src/config/db";
import compareHash from "@/src/helper/compareHash";
import { sql } from "drizzle-orm";
import { Response } from "@/src/helper/apiResponse";
import generateJwt from "@/src/helper/generateJwt";
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

      const [userRecord] = await db
        .execute(
          sql`SELECT id, email, fullname, address, phone_number, gender, job_title, id_card_number, birth_date, profile_picture, password FROM ${user} WHERE email = ${email}`
        )
        .catch((error) => {
          throw error;
        });

      if (!userRecord) {
        return res.status(400).json({ message: "User not found" });
      }

      const isPasswordMatch = await compareHash(
        password,
        userRecord.password as string
      );

      if (!isPasswordMatch) {
        return res.status(400).json({ message: "Password not match" });
      }

      const token = generateJwt(userRecord.id as string, email);

      return Response(res, 200, "Login success", {
        type: "user - login",
        token: token,
        payload: {
          fullname: userRecord.fullname,
          email: email,
          address: userRecord.address,
          phone_number: userRecord.phone_number,
          gender: userRecord.gender,
          job_title: userRecord.job_title,
          id_card_number: userRecord.id_card_number,
          birth_date: userRecord.birth_date,
          profile_picture: userRecord.profile_picture,
        },
      });
    } catch (error) {
      console.error("Error in login:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}

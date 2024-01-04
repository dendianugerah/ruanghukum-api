import type { NextApiRequest, NextApiResponse } from "next";
import db, { user } from "@/src/config/db";
import hashAndSalt from "@/src/helper/hashAndSalt";
import { v4 as uuid } from "uuid";
import { Response } from "@/src/helper/apiResponse";

interface RegisterApiRequest extends NextApiRequest {
  body: {
    fullname: string;
    email: string;
    password: string;
    address: string;
    phoneNumber: string;
    gender: string;
    jobTitle: string;
    idCardNumber: string;
    birthDate: string;
  };
}

export default async function handler(
  req: RegisterApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method == "POST") {
    const {
      fullname,
      email,
      password,
      address,
      phoneNumber,
      gender,
      jobTitle,
      idCardNumber,
      birthDate,
    } = req.body;

    try {
      if (
        !fullname ||
        !email ||
        !password ||
        !address ||
        !gender ||
        !phoneNumber ||
        !jobTitle ||
        !idCardNumber ||
        !birthDate
      ) {
        return res.status(400).json({ message: "Please fill all fields" });
      }

      await db.insert(user).values({
        id: uuid(),
        fullname: fullname,
        email: email,
        password: hashAndSalt(password),
        address: address,
        phoneNumber: phoneNumber,
        gender: gender as "male" | "female",
        jobTitle: jobTitle,
        idCardNumber: idCardNumber,
        birthDate: birthDate,
      });

      return Response(res, 200, "success", {
        type: "user - register",
        payload: {
          fullname: fullname,
          email: email,
        },
      });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}

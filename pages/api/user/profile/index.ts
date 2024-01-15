import { NextApiRequest, NextApiResponse } from "next/types";
import { upload } from "@/src/helper/multer";
import { Response } from "@/src/helper/apiResponse";
import { bucket } from "@/src/config/gcs";
import fs from "fs";
import db from "@/src/config/db";
import { sql } from "drizzle-orm";
import withAuth from "@/middleware";

interface ProfileApiRequest extends NextApiRequest {
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
    profilePicture: string;
  };
  file: {
    filename: string;
    path: string;
  };
}

export const config = {
  api: {
    bodyParser: false,
  },
};

async function handler(req: ProfileApiRequest, res: NextApiResponse<any>) {
  if (req.method === "PATCH") {
    try {
      upload.single("profilePicture")(req as any, res as any, async () => {
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

        if (req.file) {
          const profilePictureFileName = req.file.filename;
          const profilePicturePath = `/tmp/${profilePictureFileName}`;
          await fs.promises.rename(req.file?.path, profilePicturePath);

          const remotePath = `profile-images/${profilePictureFileName}`;
          await bucket.upload(profilePicturePath, {
            destination: remotePath,
          });
        }

        let query = `UPDATE public.user SET`;

        if (fullname !== undefined) {
          query += ` fullname = '${req.body.fullname}',`;
        }

        if (email !== undefined) {
          query += ` email = '${email}',`;
        }

        if (password !== undefined) {
          query += ` password = '${password}',`;
        }

        if (address !== undefined) {
          query += ` address = '${address}',`;
        }

        if (phoneNumber !== undefined) {
          query += ` phone_number = '${phoneNumber}',`;
        }

        if (gender !== undefined) {
          query += ` gender = '${gender}',`;
        }

        if (jobTitle !== undefined) {
          query += ` job_title = '${jobTitle}',`;
        }

        if (idCardNumber !== undefined) {
          query += ` id_card_number = '${idCardNumber}',`;
        }

        if (birthDate !== undefined) {
          query += ` birth_date = '${birthDate}',`;
        }

        if (req.file !== undefined) {
          query += ` profile_picture = 'https://storage.googleapis.com/bebasss/profile-images/${req.file.filename}',`;
        }

        query = query.slice(0, -1);

        query += ` WHERE id = '${req.userId}' AND email = '${req.email}'`;

        const final = sql.raw(query);

        await db.execute(final);
        return Response(res, 200, "Success", {
          type: "user - update",
          payload: {
            fullname: fullname,
            email: req.email,
          },
        });
      });
    } catch (error) {
      return Response(res, 500, "Internal Server Error", {
        error: error,
      });
    }
  }
}

export default withAuth(handler);

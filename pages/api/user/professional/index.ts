import { NextApiRequest, NextApiResponse } from "next/types";
import db from "@/src/config/db";
import { eq, sql } from "drizzle-orm";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method === "GET") {
    try {
      const query = sql.raw(
        `SELECT
          u.fullname,
          u.email,
          u.address,
          u.profile_picture,
          p.about,
          p.experience,
          p.chat_consultation_fee,
          p.video_consultation_fee,
          e.name as expertise
        FROM 
          public.user u
        INNER JOIN
          public.professional p
        ON
          u.professional_id = p.id
        INNER JOIN
          public.professional_expertise pe
        ON
          p.id = pe.professional_id
        INNER JOIN
          public.expertise e
        ON
          pe.expertise_id = e.id
          WHERE
            u.professional_id IS NOT NULL
            `
      );

      const result = await db.execute(query);

      const payload = result.map((row) => ({
        fullname: row.fullname,
        email: row.email,
        address: row.address,
        profile_picture: row.profile_picture,
        professional: {
          about: row.about,
          experience: row.experience,
          chat_consultation_fee: row.chat_consultation_fee,
          video_consultation_fee: row.video_consultation_fee,
        },
        expertise: row.expertise,
      }));

      return res.status(200).json({
        message: "Success",
        data: {
          type: "user - get professional expert",
          payload: payload,
        },
      });
    } catch (error) {
      console.error("Error getting professional expert:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

import { NextApiRequest, NextApiResponse } from "next/types";
import db, {
  expertise,
  professional,
  professional_expertise,
  user,
} from "@/src/config/db";
import { eq, sql } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import withAuth from "@/middleware";

interface ProfileExpertApiRequest extends NextApiRequest {
  body: {
    about: string;
    experience: string;
    chatConsultationFee: string;
    videoConsultationFee: string;
    competence: {
      name: string;
    };
  };
  query: {
    userId: string;
  };
}

async function handler(
  req: ProfileExpertApiRequest,
  res: NextApiResponse<any>
) {
  const {
    about,
    experience,
    chatConsultationFee,
    videoConsultationFee,
    competence,
  } = req.body;

  const { userId } = req.query;
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
            u.id = '${userId}'`
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
  } else if (req.method === "POST") {
    try {
      const expert = await db.transaction(async (trx) => {
        const id = uuid();

        await trx.insert(professional).values({
          id: id,
          about: about,
          experience: experience,
          chatConsultationFee: chatConsultationFee,
          videoConsultationFee: videoConsultationFee,
        });

        await trx
          .update(user)
          .set({ professionalId: id })
          .where(eq(user.id, userId));

        let checkExpertise = await trx
          .select()
          .from(expertise)
          .where(sql`LOWER(name) LIKE LOWER(${competence.name})`);

        let expertiseId;

        if (checkExpertise.length > 0) {
          expertiseId = checkExpertise[0].id;
        } else {
          const expertiseQuery = await trx
            .insert(expertise)
            .values({
              id: uuid(),
              name: competence.name,
            })
            .returning();

          expertiseId = expertiseQuery[0].id;
        }

        await trx.insert(professional_expertise).values({
          id: uuid(),
          professionalId: id,
          expertiseId: expertiseId,
        });
      });

      return res.status(200).json({
        message: "Success",
        data: {
          type: "user - create professional expert",
          payload: expert,
        },
      });
    } catch (error) {
      console.error("Error creating professional expert:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}

export default withAuth(handler);

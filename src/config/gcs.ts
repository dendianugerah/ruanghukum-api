import { Storage } from "@google-cloud/storage";

const b64_priv_key = process.env.GOOGLE_PRIVATE_KEY;
const buff = Buffer.from(b64_priv_key as string).toString("base64");

export const googleStorage = new Storage({
  projectId: "hackfest-bebasss",
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: `${buff}`,
  },
});

export const bucket = googleStorage.bucket("bebasss");

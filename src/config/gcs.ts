import { Storage } from "@google-cloud/storage";

export const googleStorage = new Storage({
  projectId: "hackfest-bebasss",
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY,
  },
});

export const bucket = googleStorage.bucket("bebasss");

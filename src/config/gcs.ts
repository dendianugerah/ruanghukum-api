import { Storage } from "@google-cloud/storage";

export const googleStorage = new Storage({
  projectId: "hackfest-bebasss",
  credentials: {
    client_email: process.env.CLIENT_EMAIL,
    private_key: process.env.PRIVATE_KEY,
  },
});

export const bucket = googleStorage.bucket("bebasss");

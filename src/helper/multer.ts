import multer from "multer";
import { v4 as uuid } from "uuid";

export const storage = multer.diskStorage({
  destination: "/tmp",
  filename: (req, file, cb) => {
    const uniqueFileName = `${uuid()}-${file.originalname}`;
    cb(null, uniqueFileName);
  },
});

export const upload = multer({ storage });

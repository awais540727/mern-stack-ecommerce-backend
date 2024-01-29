import multer from "multer";
import fs from 'fs'
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import { fileURLToPath } from "url";

export const productPicture= (fileurl) => {
    cloudinary.config({
  cloud_name: "dt7u3luv3",
  api_key: "729451759945431",
  api_secret: "p_KrzWFXaN8Kc8UuBW6LQgXne7o",
});

const storage = multer.memoryStorage()
const upload = multer({ storage })

const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    
}
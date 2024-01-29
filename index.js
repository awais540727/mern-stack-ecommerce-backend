import multer from "multer";
import fs from "fs";
import env from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { v2 as cloudinary } from "cloudinary";
import express from "express";
import productPicture from "./models/productPicture.js";
import morgan from "morgan";
import connectDB from "./config/db.js";

// configure env
env.config();

// database connection
connectDB();
const app = express();

app.use(express.json());
app.use(morgan("dev"));

cloudinary.config({
  cloud_name: "dt7u3luv3",
  api_key: "729451759945431",
  api_secret: "p_KrzWFXaN8Kc8UuBW6LQgXne7o",
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.post("/upload-file", upload.single("pic"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(404).send({
        success: false,
        message: "No such file found",
      });
    }
    const tempFilePath = path.join(
      __dirname,
      "uploads/profile",
      req.file.originalname
    );
    console.log("path : " + tempFilePath);
    fs.writeFileSync(tempFilePath, req.file.buffer);
    const result = await cloudinary.uploader.upload(
      tempFilePath,
      { resource_type: "auto" },
      function (error, result) {
        console.log(result);
      }
    );
    const newPicture = new productPicture({
      pic: {
        filename: req.file.originalname,
        url: result.secure_url,
      },
    });
    await newPicture.save();
    res.status(200).send({
      success: true,
      message: "Picture uploaded Successfully",
      url: result.secure_url,
    });
    fs.unlinkSync(tempFilePath);
  } catch (error) {
    console.log(error);
  }
});

app.get("/", (req, res) => {
  res.send("<h1>Hello Welcome To Ecommerce</h1>");
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${process.env.PORT}`.bgCyan.white);
});

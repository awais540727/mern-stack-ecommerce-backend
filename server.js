import express from "express";
import env from "dotenv";
import colors from "colors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoute from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import productPicture from "./models/productPicture.js";
// import mongoose from "mongoose";
// configure env
env.config();

// database connection
connectDB();

// rest object
const app = express();

app.use(cors());

// middleware
app.use(express.json());
app.use(morgan("dev"));

// import express from "express";

// const router = express.Router();
// import router from "./../routes/productRoutes";
cloudinary.config({
  cloud_name: "dt7u3luv3",
  api_key: "729451759945431",
  api_secret: "p_KrzWFXaN8Kc8UuBW6LQgXne7o",
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.post("/upload", upload.single("pic"), async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "No file uploaded", success: false });
    }

    const tempFilePath = path.join(__dirname,"uploads/",req.file.originalname
    );
    console.log(tempFilePath);
    fs.writeFileSync(tempFilePath, req.file.buffer);

    const result = await cloudinary.uploader.upload(tempFilePath,{ resource_type: "auto" },
      function (error, result) {
        console.log(result);
      }
    );

    const newFile = new productPicture({
      pic: {
        filename: req.file.originalname,
        url: result.secure_url,
      },
    });
    await newFile.save();
    fs.unlinkSync(tempFilePath);
    res.status(200).send({ success: true, url: result.secure_url });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// routes

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);

app.get("/", (req, res) => {
  res.send("<h1>Hello Welcome To Ecommerce</h1>");
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${process.env.PORT}`.bgCyan.white);
});

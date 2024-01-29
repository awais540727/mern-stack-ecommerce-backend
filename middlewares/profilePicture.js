import express from "express";

import fs from "fs";
import path from "path";

import mongoose from "mongoose";

import multer from "multer";
 const router = express.Router();
// import router from "./../routes/productRoutes";

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/upload", upload.single("pic"), async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "No such Picture Found", success: false });
    }
  } catch (error) {
    console.log(error);
  }
  const tempFilePath = path.join(__dirname, "upload/", req.pic.orignalname);
  fs.writeFileSync(tempFilePath, req.pic.buffer);
});

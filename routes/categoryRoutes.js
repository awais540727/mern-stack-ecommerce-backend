import express from "express";
import { isAdmin, requireSignin } from "../middlewares/authMiddleware.js";
import {
  createCategoryController,
  getAllCategoryController,
  getSingleCategoryController,
  updateCategoryController,
  deleteCategoryController,
} from "../controllers/categoryController.js";

const router = express.Router();

router.post(
  "/create-category",
  requireSignin,
  isAdmin,
  createCategoryController
);

router.put(
  "/update-category/:id",
  requireSignin,
  isAdmin,
  updateCategoryController
);

router.get("/all-category", getAllCategoryController);

router.get("/single-category/:slug", getSingleCategoryController);

router.delete(
  "/delete-category/:id",
  requireSignin,
  isAdmin,
  deleteCategoryController
);

export default router;

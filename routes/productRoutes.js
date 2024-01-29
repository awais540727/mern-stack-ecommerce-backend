import express from "express";
import { isAdmin, requireSignin } from "../middlewares/authMiddleware.js";
import {
  createProductController,
  // deleteProductController,
  deleteSingleProductController,
  filterProductController,
  getAllProductController,
  getSingleProductController,
  productCountController,
  productListController,
  productPhotoController,
  updateProductController,
} from "../controllers/productController.js";
import formidable from "express-formidable";
const router = express.Router();

router.post(
  "/create-product",
  requireSignin,
  isAdmin,
  formidable(),
  createProductController
);

router.put(
  "/update-product/:id",
  requireSignin,
  isAdmin,
  formidable(),
  updateProductController
);

router.get("/get-all-products", getAllProductController);

router.get("/single-product/:slug", getSingleProductController);

router.delete(
  "/delete-product/:id",
  requireSignin,
  isAdmin,
  deleteSingleProductController
);

router.get("/product-photo/:pid", productPhotoController);

router.post("/product-filter", filterProductController);

router.get("/products-count", productCountController)

router.get("/product-list/:page", productListController);


// router.delete("/product-delete/:id", deleteProductController);

export default router;

import express from "express";
import { isAdmin, requireSignin } from "../middlewares/authMiddleware.js";
import {
  brainTreePaymentController,
  brainTreeTokenController,
  categoryProductController,
  changeOrderStatus,
  createProductController,
  // deleteProductController,
  deleteSingleProductController,
  filterProductController,
  getAllProductController,
  getSingleProductController,
  productCountController,
  productListController,
  productPhotoController,
  realtedProductController,
  searchProductController,
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

router.get("/products-count", productCountController);

// load more button controller
router.get("/product-list/:page", productListController);

// search controller
router.get("/search/:keyword", searchProductController);
// router.delete("/product-delete/:id", deleteProductController);

// related product

router.get("/related-product/:pid/:cid", realtedProductController);

// get products by category

router.get("/category-products/:slug", categoryProductController);

// PAYMENTS

// TOKEN
router.get("/token", brainTreeTokenController);

// PAYMENT

router.post("/payment", requireSignin, brainTreePaymentController);

// CHANGE ORDERS STATUS

router.put(
  "/change-status/:orderId",
  requireSignin,
  isAdmin,
  changeOrderStatus
);

export default router;

import express from "express";
import {
  loginUserController,
  registerUserController,
  forgetPasswordController,
  test,
  updateProfileController,
  getUserOrderController,
  getAllAdminOrderController,
} from "../controllers/authController.js";
import { isAdmin, requireSignin } from "../middlewares/authMiddleware.js";

// router object
const router = express.Router();

// ROUTING

// REGISTER USER
router.post("/register", registerUserController);

// LOGIN USER

router.post("/login", loginUserController);

// Forget Password

router.post("/forgot-password", forgetPasswordController);

// PROTECTED USER ROUTE

router.get("/auth-route", requireSignin, (req, res) => {
  res.status(200).send({ ok: true });
});

// PROTECTED USER ROUTE

router.get("/admin-route", requireSignin, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

// update profile

router.put("/update-profile", requireSignin, updateProfileController);

// GET USER ORDERS

router.get("/user-orders", requireSignin, getUserOrderController);

// GET ALL ADMIN ORDERS

router.get(
  "/all-admin-orders",
  requireSignin,
  isAdmin,
  getAllAdminOrderController
);

// TEST
router.get("/test", requireSignin, isAdmin, test);

export default router;

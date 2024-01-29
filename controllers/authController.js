import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "../utils/authPasswordHelper.js";
import JWT from "jsonwebtoken";

// REGISTER NEW USER
export const registerUserController = async (req, res) => {
  try {
    const { name, email, phone, password, address, answer } = req.body;
    if (!name) {
      return res.send({ message: "Name is required" });
    }
    if (!answer) {
      return res.send({ message: "Answer is required" });
    }
    if (!email) {
      return res.send({ message: "Email is required" });
    }
    if (!phone) {
      return res.send({ message: "phone no is required" });
    }
    if (!password) {
      return res.send({ message: "password is required" });
    }
    if (!address) {
      return res.send({ message: "address is required" });
    }
    // existing user
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(200).send({
        message: "user already register please login",
        success: false,
      });
    }
    // hashing password
    const hashedPassword = await hashPassword(password);
    // Register new user
    const user = await new userModel({
      name,
      email,
      phone,
      password: hashedPassword,
      address,
      answer,
    }).save();
    res.status(201).send({
      success: true,
      message: "Register Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error while Registration",
      success: false,
      error,
    });
  }
};

// LOGIN USER

// export const loginUserController = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     // Validation
//     if (!email || !password) {
//       return res.status(404).send({
//         success: false,
//         message: "invalid email or password",
//       });
//     }
//     // Find User from database

//     const user = await userModel.findOne({ email });
//     if (!user) {
//       return res.status(404).send({
//         success: false,
//         message: "email not found",
//       });
//     }
//     const match = await comparePassword(password, user.password);
//     if (!match) {
//       return res.status(200).send({
//         success: false,
//         message: "password did not match",
//       });
//     }
//     // Assigning token
//     const token = await JWT.sign({ id: user._id }, process.env.SECRET_KEY, {
//       expiresIn: "7d",
//     });
//     res.status(200).send({
//       success: true,
//       message: "Login Successfully",
//       user: {
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         phone: user.phone,
//         address: user.address,
//       },
//       token,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "Error in Login",
//       error,
//     });
//   }
// };

export const loginUserController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    //check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registerd",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }
    //token
    const token = JWT.sign({ _id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "Login successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
    // console.log(user);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

// Forget Password

export const forgetPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      res.status(400).send({ success: false, message: "Email is required" });
    }
    if (!answer) {
      res.status(400).send({ success: false, message: "Answer is required" });
    }
    if (!newPassword) {
      res
        .status(400)
        .send({ success: false, message: "New Password is required" });
    }
    const user = await userModel.findOne({ email, answer });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong email or answer",
      });
    }
    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password Update Successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};
// test

export const test = (req, res) => {
  res.send("Protected route");
};

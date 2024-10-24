import express from "express";
import env from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoute from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Configure env
env.config();

// Database connection
connectDB();

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
//   {
//   origin: ["https://mern-stack-ecommerce-project.vercel.app"],
//   methods: ["POST", "GET"],
//   credentials: true,
// }
// );

// // Serve static files from the build directory
// const __dirname = path.dirname(fileURLToPath(import.meta.url));
// app.use(express.static(path.join(__dirname, "ecom/build")));

// Define routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);

// // // For any other route, serve the index.html file
// app.get("*", function (req, res) {
//   res.sendFile(path.join(__dirname, "ecom/build/index.html"));
// });

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import path from "path";
import authRoutes from "./routes/auth";
import productRoutes from "./routes/products";
import categoryRoutes from "./routes/categories";
import cartRoutes from "./routes/cart";
import orderRoutes from "./routes/orders";
import reviewRoutes from "./routes/reviews";
import wishlistRoutes from "./routes/wishlist";
import adminRoutes from "./routes/admin";
import uploadRoutes from "./routes/uploads";
import { errorHandler } from "./middleware/error";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true
  })
);
app.use(express.json());
app.use(morgan("dev"));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200
  })
);

app.use("/uploads", express.static(path.resolve("uploads")));

app.get("/", (_req, res) => {
  res.json({ message: "AdCoderWEB API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/uploads", uploadRoutes);

app.use(errorHandler);

export default app;

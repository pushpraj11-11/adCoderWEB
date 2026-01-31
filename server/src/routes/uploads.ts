import { Router } from "express";
import multer from "multer";
import path from "path";
import { requireAuth } from "../middleware/auth";
import { requireRole } from "../middleware/role";
import { Role } from "@prisma/client";

const router = Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "uploads/");
  },
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${file.originalname}`;
    cb(null, unique);
  }
});

const upload = multer({ storage });

router.post(
  "/",
  requireAuth,
  requireRole(Role.ADMIN),
  upload.single("image"),
  (req, res) => {
    const filePath = req.file ? `/uploads/${req.file.filename}` : null;
    return res.json({ url: filePath });
  }
);

export default router;

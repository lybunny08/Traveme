import { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer for local storage fallback
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const uploadDir = path.join(__dirname, "..", "..", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (JPEG, PNG, GIF, WebP, SVG) are allowed"));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

export const uploadImage = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    const filePath = req.file.path;

    // Try Cloudinary first
    try {
      const cloudinaryResult = await cloudinary.uploader.upload(filePath, {
        folder: "traveme",
        transformation: [{ quality: "auto", fetch_format: "auto" }],
      });

      // Clean up local file after Cloudinary upload
      fs.unlink(filePath, (err) => {
        if (err) console.error("Failed to delete local file after Cloudinary upload:", err);
      });

      res.json({
        url: cloudinaryResult.secure_url,
        public_id: cloudinaryResult.public_id,
      });
      return;
    } catch (cloudinaryErr) {
      console.error("Cloudinary upload failed, falling back to local storage:", cloudinaryErr);

      // Fallback: return local URL
      const localUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
      res.json({
        url: localUrl,
        public_id: `local_${req.file.filename}`,
      });
    }
  } catch (err) {
    console.error("uploadImage error:", err);
    res.status(500).json({ error: "Failed to upload image" });
  }
};

import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), "uploads", "claims");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Create claim-specific folder
    const claimId = req.params.id || "temp";
    const claimUploadDir = path.join(uploadDir, claimId);

    if (!fs.existsSync(claimUploadDir)) {
      fs.mkdirSync(claimUploadDir, { recursive: true });
    }

    cb(null, claimUploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}_${timestamp}${ext}`);
  },
});

// File filter - allow only specific file types
const fileFilter = (req: any, file: any, cb: any) => {
  const allowedMimes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/gif",
    "application/msword", // .doc
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    "application/vnd.ms-excel", // .xls
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type not supported: ${file.mimetype}`));
  }
};

// Create multer instance
export const uploadClaim = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
});

// Middleware for handling single file uploads
export const singleClaimUpload = uploadClaim.single("file");

// Middleware for handling multiple file uploads
export const multipleClaimUploads = uploadClaim.array("files", 10); // Max 10 files

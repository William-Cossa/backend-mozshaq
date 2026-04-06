import { Router } from "express";
import { uploadController } from "../../controllers/admin/upload.controller.js";
import { authenticate, authenticatePortal } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import multer from "multer";

const router = Router();

// Auth: admin portal, ADMIN ou MANAGER
router.use(authenticate, authenticatePortal("admin"), authorize("ADMIN", "MANAGER"));

// Multer — memoryStorage, apenas imagens, max 5 MB
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Apenas imagens JPEG, PNG ou WebP são aceites."));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

// POST /api/admin/upload — upload de imagem genérico
router.post("/", upload.single("image"), uploadController.uploadImage);

export default router;

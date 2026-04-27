import multer from "multer";
const ALLOWED_MIMES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const storage = multer.memoryStorage();
function fileFilter(_req, file, cb) {
    if (ALLOWED_MIMES.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error("Apenas imagens JPEG, PNG ou WebP são aceites."));
    }
}
/**
 * Middleware Multer para upload de um único ficheiro no campo "paymentProof".
 */
export const uploadPaymentProof = multer({
    storage,
    fileFilter,
    limits: { fileSize: MAX_FILE_SIZE },
}).single("paymentProof");

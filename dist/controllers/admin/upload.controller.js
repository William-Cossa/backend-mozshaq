import { uploadPaymentProof } from "../../lib/cloudinary.js";
import { v7 as uuidv7 } from "uuid";
export const uploadController = {
    /**
     * Upload genérico de imagem para Cloudinary.
     * Recebe o campo "image" via multipart/form-data.
     * Opcionalmente aceita "folder" no body para organizar por pasta.
     */
    async uploadImage(req, res) {
        try {
            if (!req.file) {
                res.status(400).json({ success: false, message: "Ficheiro de imagem é obrigatório." });
                return;
            }
            const folder = req.body.folder || "mozshaq/imagens";
            const uniqueName = `${uuidv7()}_${req.file.originalname.replace(/\s+/g, "_")}`;
            // Reutiliza o helper de upload do Cloudinary (que usa upload_stream)
            const { v2: cloudinary } = await import("cloudinary");
            const url = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream({
                    folder,
                    public_id: uniqueName,
                    resource_type: "image",
                    overwrite: true,
                }, (error, result) => {
                    if (error)
                        return reject(error);
                    if (!result)
                        return reject(new Error("Upload falhou — sem resultado."));
                    resolve(result.secure_url);
                });
                stream.end(req.file.buffer);
            });
            res.status(200).json({ success: true, url });
        }
        catch (err) {
            console.error("Cloudinary upload error:", err);
            res.status(500).json({ success: false, message: err.message || "Erro ao fazer upload da imagem." });
        }
    },
};

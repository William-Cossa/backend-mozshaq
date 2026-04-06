import { v2 as cloudinary } from "cloudinary";

// ─── Configuração Cloudinary ────────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDNARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDNARY_API_KEY || "",
  api_secret: process.env.CLOUDNARY_API_SECRET || "",
});

/**
 * Faz upload de um buffer de imagem para o Cloudinary.
 * Devolve o URL seguro (HTTPS) da imagem.
 */
export async function uploadPaymentProof(
  fileBuffer: Buffer,
  fileName: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "mozshaq/pagamentos",
        public_id: fileName,
        resource_type: "image",
        overwrite: true,
      },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error("Upload falhou — sem resultado."));
        resolve(result.secure_url);
      }
    );

    uploadStream.end(fileBuffer);
  });
}

export default cloudinary;

import { v2 as cloudinary } from "cloudinary";
/**
 * Faz upload de um buffer de imagem para o Cloudinary.
 * Devolve o URL seguro (HTTPS) da imagem.
 */
export declare function uploadPaymentProof(fileBuffer: Buffer, fileName: string): Promise<string>;
export default cloudinary;

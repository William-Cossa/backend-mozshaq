import type { Request, Response } from "express";
export declare const uploadController: {
    /**
     * Upload genérico de imagem para Cloudinary.
     * Recebe o campo "image" via multipart/form-data.
     * Opcionalmente aceita "folder" no body para organizar por pasta.
     */
    uploadImage(req: Request, res: Response): Promise<void>;
};

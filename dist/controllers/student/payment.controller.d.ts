import type { Request, Response } from "express";
export declare const studentPaymentController: {
    /**
     * O aluno submete o comprovativo de pagamento (imagem) para um curso
     * em que já está inscrito.
     *
     * Body (multipart/form-data):
     *  - courseId: string
     *  - paymentProof: File (imagem)
     */
    submitPayment(req: Request, res: Response): Promise<void>;
    /**
     * Listar pagamentos do próprio aluno.
     */
    getMyPayments(req: Request, res: Response): Promise<void>;
};

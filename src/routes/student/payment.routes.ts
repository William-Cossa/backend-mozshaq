import { Router } from "express";
import { studentPaymentController } from "../../controllers/student/payment.controller.js";
import { authenticate, authenticatePortal } from "../../middleware/authenticate.js";
import { uploadPaymentProof } from "../../middleware/upload.js";

const router = Router();

// Todas as rotas requerem autenticação no portal "student"
router.use(authenticate, authenticatePortal("student"));

// POST /api/student/payments — submeter comprovativo de pagamento (imagem)
router.post("/", uploadPaymentProof, studentPaymentController.submitPayment);

// GET  /api/student/payments — listar pagamentos do aluno
router.get("/", studentPaymentController.getMyPayments);

export default router;

import type { Request, Response } from "express";
import { uploadPaymentProof } from "../../lib/cloudinary.js";
import { paymentService } from "../../services/admin/payment.service.js";
import { prisma } from "../../lib/prisma.js";
import { v7 as uuidv7 } from "uuid";

export const studentPaymentController = {
  /**
   * O aluno submete o comprovativo de pagamento (imagem) para um curso
   * em que já está inscrito.
   *
   * Body (multipart/form-data):
   *  - courseId: string
   *  - paymentProof: File (imagem)
   */
  async submitPayment(req: Request, res: Response): Promise<void> {
    try {
      const studentId = req.user!.sub;
      const { courseId } = req.body;

      if (!courseId) {
        res.status(400).json({ success: false, message: "courseId é obrigatório." });
        return;
      }

      if (!req.file) {
        res.status(400).json({ success: false, message: "Comprovativo de pagamento (imagem) é obrigatório." });
        return;
      }

      // ── Verificar que a inscrição existe ────────────────────────────────
      const enrollment = await prisma.enrollment.findUnique({
        where: { studentId_courseId: { studentId, courseId } },
      });

      if (!enrollment) {
        res.status(404).json({ success: false, message: "Inscrição não encontrada. Inscreva-se no curso primeiro." });
        return;
      }

      // ── Verificar se já existe pagamento pendente / aprovado ───────────
      const existingPayment = await prisma.payment.findFirst({
        where: {
          studentId,
          courseId,
          status: { in: ["PENDING", "APPROVED"] },
        },
      });

      if (existingPayment) {
        const label = existingPayment.status === "APPROVED" ? "aprovado" : "pendente";
        res.status(409).json({
          success: false,
          message: `Já existe um pagamento ${label} para este curso.`,
        });
        return;
      }

      // ── Buscar dados do aluno e curso ──────────────────────────────────
      const [student, course] = await Promise.all([
        prisma.student.findUnique({ where: { id: studentId } }),
        prisma.course.findUnique({ where: { id: courseId } }),
      ]);

      if (!student || !course) {
        res.status(404).json({ success: false, message: "Aluno ou curso não encontrado." });
        return;
      }

      // ── Upload para Cloudinary ─────────────────────────────────────────
      const uniqueName = `${uuidv7()}_${req.file.originalname.replace(/\s+/g, "_")}`;
      const imageUrl = await uploadPaymentProof(req.file.buffer, uniqueName);

      // ── Criar pagamento ────────────────────────────────────────────────
      const payment = await paymentService.create({
        studentId,
        courseId,
        studentName: student.name,
        courseName: course.title,
        amount: course.price,
        paymentProof: imageUrl,
      });

      res.status(201).json({ success: true, payment });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * Listar pagamentos do próprio aluno.
   */
  async getMyPayments(req: Request, res: Response): Promise<void> {
    try {
      const studentId = req.user!.sub;
      const result = await paymentService.getAll({ ...req.query, studentId });
      res.status(200).json({ success: true, ...result });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
};

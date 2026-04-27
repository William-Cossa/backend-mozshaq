import type { Request, Response } from "express";
import { dashboardService } from "../../services/admin/dashboard.service.js";

export const dashboardController = {
  async getOverview(req: Request, res: Response): Promise<void> {
    try {
      const period = req.query.period as string | undefined;
      const result = await dashboardService.getOverview(period);
      res.status(200).json({ success: true, ...result });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
};

import { dashboardService } from "../../services/admin/dashboard.service.js";
export const dashboardController = {
    async getOverview(req, res) {
        try {
            const period = req.query.period;
            const result = await dashboardService.getOverview(period);
            res.status(200).json({ success: true, ...result });
        }
        catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
};

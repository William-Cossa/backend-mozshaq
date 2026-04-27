import { Router } from "express";
import { dashboardController } from "../../controllers/admin/dashboard.controller.js";
import { authenticate, authenticatePortal } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";

const router = Router();

router.use(authenticate, authenticatePortal("admin"), authorize("ADMIN", "MANAGER"));

router.get("/", dashboardController.getOverview);

export default router;

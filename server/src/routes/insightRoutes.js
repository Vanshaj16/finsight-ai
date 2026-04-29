import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getInsights } from "../controllers/insightsController.js";

const router = Router();

router.get("/", protect, getInsights);

export default router;

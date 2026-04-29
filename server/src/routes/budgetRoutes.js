import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import validate from "../middleware/validate.js";
import { setBudget, getBudgets, getBudgetSummary } from "../controllers/budgetController.js";
import { budgetValidator } from "../validators/budgetValidators.js";

const router = Router();

router.use(protect);
router.post("/", budgetValidator, validate, setBudget);
router.get("/", getBudgets);
router.get("/summary", getBudgetSummary);

export default router;

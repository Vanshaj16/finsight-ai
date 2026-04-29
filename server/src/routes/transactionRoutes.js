import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import validate from "../middleware/validate.js";
import {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transactionController.js";
import {
  transactionCreateValidator,
  transactionUpdateValidator,
} from "../validators/transactionValidators.js";

const router = Router();

router.use(protect);
router.post("/", transactionCreateValidator, validate, createTransaction);
router.get("/", getTransactions);
router.put("/:id", transactionUpdateValidator, validate, updateTransaction);
router.delete("/:id", deleteTransaction);

export default router;

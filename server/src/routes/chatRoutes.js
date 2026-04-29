import { Router } from "express";
import { body } from "express-validator";
import { protect } from "../middleware/authMiddleware.js";
import validate from "../middleware/validate.js";
import { chatWithAssistant } from "../controllers/chatController.js";

const router = Router();

router.post(
  "/",
  protect,
  body("message").trim().notEmpty().withMessage("Message is required."),
  validate,
  chatWithAssistant,
);

export default router;

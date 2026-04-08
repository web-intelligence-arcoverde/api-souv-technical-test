import { Router } from "express";
import { makeAuthController } from "./factories/auth.factory";

const router = Router();
const authController = makeAuthController();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/users", authController.listUsers);
router.patch("/account/:uid", authController.updateAccount);
router.delete("/account/:uid", authController.deleteAccount);

export default router;

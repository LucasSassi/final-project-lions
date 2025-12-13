import { Router } from "express";
import userController from "../controllers/user.controller.js";
import { ensureValidId } from "../middlewares/validate.middleware.js";
import { authMiddleware, requireRole, Role } from "../middlewares/auth-middleware.js";
const router = Router();

router.post("/users", userController.create);
router.get("/users", authMiddleware(), requireRole(Role.ADMIN), userController.list);
router.get("/users/hello", authMiddleware(), userController.hello);
router.get("/users/:id", ensureValidId, userController.get);
router.put("/users/:id", ensureValidId, userController.update);
router.delete("/users/:id", authMiddleware(), requireRole(Role.ADMIN), userController.remove);
router.post("/users/login", userController.login);

export default router;

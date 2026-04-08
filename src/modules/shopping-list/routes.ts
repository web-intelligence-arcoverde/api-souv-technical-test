import { Router } from "express";
import { makeShoppingListController } from "./factories/shopping-list.factory";

const router = Router();
const listController = makeShoppingListController();

router.post("/", listController.create);
router.get("/", listController.list);

export default router;

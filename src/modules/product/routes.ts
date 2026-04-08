import express from "express";
import {
	makeCreateProductController,
	makeDeleteProductController,
	makeListProductController,
	makeToggleCheckedProductController,
} from "./factories/product.factory";

const router = express.Router();

const listProductController = makeListProductController();
const createProductController = makeCreateProductController();
const toggleCheckedProductController = makeToggleCheckedProductController();
const deleteProductController = makeDeleteProductController();

router.delete("/:id", deleteProductController.handle);
router.get("/", listProductController.handle);
router.post("/", createProductController.handle);
router.patch("/:id/toggle-checked", toggleCheckedProductController.handle);

export default router;

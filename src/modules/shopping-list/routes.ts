import { Router } from "express";
import { cacheMiddleware } from "../../middlewares/cache.middleware";
import { makeShoppingListController } from "./factories/shopping-list.factory";

const publicRouter = Router();
const privateRouter = Router();
const listController = makeShoppingListController();

publicRouter.get(
	"/:id",
	cacheMiddleware((req) => `list:shared:${req.params.id}`, 300),
	listController.getById,
);

privateRouter.post("/", listController.create);

privateRouter.get(
	"/",
	cacheMiddleware(
		(req) =>
			`lists:user:${req.user?.uid}:page:${req.query.page || 1}:limit:${req.query.limit || 10}:cat:${req.query.category || "all"}:sh:${req.query.shared || "all"}:var:${req.query.variant || "all"}`,
		600,
	),
	listController.list,
);

privateRouter.get(
	"/:id",
	cacheMiddleware(
		(req) => `list:detail:${req.params.id}:user:${req.user?.uid}`,
		300,
	),
	listController.getById,
);

privateRouter.patch("/:id", listController.update);
privateRouter.delete("/:id", listController.delete);

export { publicRouter as sharedShoppingListRouter };
export default privateRouter;

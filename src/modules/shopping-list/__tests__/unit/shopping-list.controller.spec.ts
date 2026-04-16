import { jest } from "@jest/globals";
import type { Request, Response } from "express";
import { setupControllerTest } from "../helpers/shopping-list.controller.setup";

describe("ShoppingListController", () => {
	let setup: ReturnType<typeof setupControllerTest>;

	beforeEach(() => {
		setup = setupControllerTest();
	});

	describe("create", () => {
		it("should create a list and return 201", async () => {
			const mockUser = { uid: "user-1", email: "test@test.com" };
			(setup.req as any).user = mockUser;
			setup.req.body = {
				items: [
					{
						name: "Item 1",
						price: 5,
						category: "Test",
						marketName: "Test Market",
						quantity: 1,
						unit: "un",
						checked: false,
					} as any,
				],
				title: "New List",
				category: "Food",
				variant: "primary",
			};

			const mockResult = { id: "list-1", ...setup.req.body };
			setup.mockCreateUseCase.execute.mockResolvedValue(mockResult as any);

			await setup.controller.create(
				setup.req as Request,
				setup.res as Response,
				setup.next,
			);

			expect(setup.res.status).toHaveBeenCalledWith(201);
			expect(setup.res.json).toHaveBeenCalledWith(mockResult);
		});
	});

	describe("list", () => {
		it("should list filtered results and return 200", async () => {
			(setup.req as any).user = { uid: "user-1" };
			setup.req.query = { category: "Food", shared: "true" };

			const mockLists = [{ id: "list-1", title: "List 1" }];
			setup.mockListUseCase.execute.mockResolvedValue(mockLists as any);

			await setup.controller.list(
				setup.req as Request,
				setup.res as Response,
				setup.next,
			);

			expect(setup.mockListUseCase.execute).toHaveBeenCalledWith(
				expect.objectContaining({
					userId: "user-1",
					category: "Food",
					shared: true,
				}),
			);
			expect(setup.res.status).toHaveBeenCalledWith(200);
			expect(setup.res.json).toHaveBeenCalledWith(mockLists);
		});
	});

	describe("delete", () => {
		it("should delete list and return 200", async () => {
			setup.req.params = { id: "list-1" };
			setup.mockDeleteUseCase.execute.mockResolvedValue(undefined);

			await setup.controller.delete(
				setup.req as Request,
				setup.res as Response,
				setup.next,
			);

			expect(setup.mockDeleteUseCase.execute).toHaveBeenCalledWith("list-1");
			expect(setup.res.status).toHaveBeenCalledWith(200);
			expect(setup.res.json).toHaveBeenCalledWith({
				message: "Lista deletada com sucesso",
			});
		});
	});
});

import type { Request, Response } from "express";
import { setupAuthControllerTest } from "../../test-helpers/auth.controller.setup";

describe("AuthController - Register", () => {
	let setup: ReturnType<typeof setupAuthControllerTest>;

	beforeEach(() => {
		setup = setupAuthControllerTest();
	});

	describe("register", () => {
		it("should register a user successfully and return 201", async () => {
			const userData = {
				email: "test@example.com",
				password: "password123",
				name: "Test User",
			};
			setup.req.body = userData;
			const expectedResult = { id: "123", ...userData };
			setup.mockRegisterUseCase.execute.mockResolvedValue(
				expectedResult as any,
			);

			await setup.authController.register(
				setup.req as Request,
				setup.res as Response,
				setup.next,
			);

			expect(setup.res.status).toHaveBeenCalledWith(201);
			expect(setup.res.json).toHaveBeenCalledWith(expectedResult);
		});

		it("should call next with error if registration fails", async () => {
			setup.req.body = { email: "invalid" }; // Will fail zod validation
			await setup.authController.register(
				setup.req as Request,
				setup.res as Response,
				setup.next,
			);
			expect(setup.next).toHaveBeenCalled();
		});
	});
});

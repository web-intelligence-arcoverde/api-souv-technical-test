import type { Request, Response } from "express";
import { setupAuthControllerTest } from "../helpers/auth.controller.setup";

describe("AuthController - Login", () => {
	let setup: ReturnType<typeof setupAuthControllerTest>;

	beforeEach(() => {
		setup = setupAuthControllerTest();
	});

	describe("login", () => {
		it("should login successfully and return 200", async () => {
			const loginData = {
				email: "test@example.com",
				password: "password123",
			};
			setup.req.body = loginData;
			const expectedResult = {
				token: "access-token",
				refreshToken: "refresh-token",
			};
			setup.mockLoginUseCase.execute.mockResolvedValue(expectedResult as any);

			await setup.authController.login(
				setup.req as Request,
				setup.res as Response,
				setup.next,
			);

			expect(setup.res.status).toHaveBeenCalledWith(200);
			expect(setup.res.json).toHaveBeenCalledWith(expectedResult);
		});

		it("should call next with error if login fails", async () => {
			setup.req.body = {};
			await setup.authController.login(
				setup.req as Request,
				setup.res as Response,
				setup.next,
			);
			expect(setup.next).toHaveBeenCalled();
		});
	});
});

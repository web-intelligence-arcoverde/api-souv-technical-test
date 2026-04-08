import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

interface FirebaseError extends Error {
	errorInfo?: {
		code: string;
		message: string;
	};
	codePrefix?: string;
	code?: number | string;
	details?: string;
}

const errorHandler = (
	err: FirebaseError,
	_req: Request,
	res: Response,
	_next: NextFunction,
): void => {
	console.error("Error path:", _req.path);
	console.error("Error details:", err);

	// 0. Axios / Identity Toolkit REST API Errors
	const axiosError = err as any;
	if (axiosError.isAxiosError && axiosError.response?.data?.error) {
		const { message, code } = axiosError.response.data.error;
		let status = axiosError.response.status || 400;

		// Map common Identity Toolkit messages to standard status codes
		if (message === "EMAIL_NOT_FOUND" || message === "INVALID_PASSWORD") {
			status = 401;
		} else if (message === "USER_DISABLED") {
			status = 403;
		} else if (message === "TOO_MANY_ATTEMPTS_TRY_LATER") {
			status = 429;
		}

		res.status(status).json({
			error: "Authentication Error",
			code: message,
			message: message.replace(/_/g, " ").toLowerCase(),
		});
		return;
	}

	// 1. Zod Validation Errors
	if (err instanceof ZodError) {
		res.status(400).json({
			error: "Validation Error",
			issues: err.issues.map((issue) => ({
				path: issue.path.join("."),
				message: issue.message,
			})),
		});
		return;
	}

	// 2. Firebase Auth Errors (FirebaseAuthError)
	if (err.errorInfo && err.codePrefix === "auth") {
		const { code, message } = err.errorInfo;
		let status = 400;

		switch (code) {
			case "auth/email-already-exists":
				status = 409;
				break;
			case "auth/user-not-found":
				status = 404;
				break;
			case "auth/wrong-password":
				status = 401;
				break;
			case "auth/too-many-requests":
				status = 429;
				break;
			default:
				status = 400;
		}

		res.status(status).json({
			error: "Authentication Error",
			code,
			message,
		});
		return;
	}

	// 3. Firestore / Google Cloud Errors (often have 'code' and 'details' or 'reason')
	if (err.code !== undefined && typeof err.code === "number") {
		// gRPC status codes
		let status = 500;
		const message = err.details || err.message;

		switch (err.code) {
			case 3: // INVALID_ARGUMENT
				status = 400;
				break;
			case 5: // NOT_FOUND
				status = 404;
				break;
			case 7: // PERMISSION_DENIED
				status = 403;
				break;
			case 16: // UNAUTHENTICATED
				status = 401;
				break;
			default:
				status = 500;
		}

		res.status(status).json({
			error: "Database Error",
			code: err.code,
			message,
		});
		return;
	}

	// Default: Internal Server Error
	res.status(500).json({
		error: "Internal Server Error",
		message: err.message || "An unexpected error occurred",
	});
};

export default errorHandler;

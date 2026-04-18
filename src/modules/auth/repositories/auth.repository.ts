import axios from "axios";
import { auth, db, firebaseConfig } from "../../../infra/firestore";
import logger from "../../../infra/logger/logger";
import type { IAuthRepository, IAuthUser } from "./auth.repository.interface";

export type { IAuthRepository };

export class AuthRepository implements IAuthRepository {
	private readonly collectionName = "users";

	async register(
		email: string,
		password: string,
		name: string,
	): Promise<IAuthUser> {
		const userSnapshot = await db
			.collection(this.collectionName)
			.where("email", "==", email)
			.get();

		if (!userSnapshot.empty) {
			const error = new Error(
				"The email address is already in use by another account.",
			);
			Object.assign(error, {
				errorInfo: {
					code: "auth/email-already-exists",
					message: error.message,
				},
				codePrefix: "auth",
			});
			throw error;
		}

		const userRecord = await auth.createUser({
			email,
			password,
			displayName: name,
		});

		await db.collection(this.collectionName).doc(userRecord.uid).set({
			uid: userRecord.uid,
			email: userRecord.email,
			name: name,
			createdAt: new Date(),
		});

		return await this.login(email, password);
	}

	async login(email: string, password: string): Promise<IAuthUser> {
		const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseConfig.apiKey}`;

		const response = await axios.post(url, {
			email,
			password,
			returnSecureToken: true,
		});

		const { localId, idToken, refreshToken, displayName } = response.data;

		return {
			uid: localId,
			email,
			name: displayName || "",
			token: idToken,
			refreshToken: refreshToken,
		};
	}

	async refresh(
		refreshToken: string,
	): Promise<{ idToken: string; refreshToken: string }> {
		const url = `https://securetoken.googleapis.com/v1/token?key=${firebaseConfig.apiKey}`;

		const params = new URLSearchParams();
		params.append("grant_type", "refresh_token");
		params.append("refresh_token", refreshToken);

		const response = await axios.post(url, params.toString(), {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		});

		return {
			idToken: response.data.id_token,
			refreshToken: response.data.refresh_token,
		};
	}

	async logout(): Promise<void> {
		return;
	}

	async resetPassword(email: string): Promise<void> {
		const link = await auth.generatePasswordResetLink(email);

		logger.info(`Password reset link generated for ${email}: ${link}`);
	}

	async update(
		uid: string,
		data: { name?: string; email?: string },
	): Promise<void> {
		await auth.updateUser(uid, {
			displayName: data.name,
			email: data.email,
		});

		const updateData: Record<string, string> = {};
		if (data.name) updateData.name = data.name;
		if (data.email) updateData.email = data.email;

		await db.collection(this.collectionName).doc(uid).update(updateData);
	}

	async delete(uid: string): Promise<void> {
		const listsSnapshot = await db
			.collection("shopping-lists")
			.where("ownerId", "==", uid)
			.get();

		for (const listDoc of listsSnapshot.docs) {
			const itemsSnapshot = await db
				.collection("products")
				.where("listId", "==", listDoc.id)
				.get();

			for (const itemDoc of itemsSnapshot.docs) {
				await itemDoc.ref.delete();
			}
			await listDoc.ref.delete();
		}
		await db.collection(this.collectionName).doc(uid).delete();
		await auth.deleteUser(uid);
	}

	async findAll(): Promise<Omit<IAuthUser, "token" | "refreshToken">[]> {
		const snapshot = await db.collection(this.collectionName).get();
		const users: Omit<IAuthUser, "token" | "refreshToken">[] = [];

		for (const doc of snapshot.docs) {
			const data = doc.data();
			users.push({
				uid: doc.id,
				email: data.email,
				name: data.name,
			});
		}

		return users;
	}
}

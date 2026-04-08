import axios from "axios";
import { auth, db, firebaseConfig } from "../../../infra/firestore";
import type { IAuthRepository, IAuthUser } from "./auth.repository.interface";

export class AuthRepository implements IAuthRepository {
	async register(
		email: string,
		password: string,
		name: string,
	): Promise<IAuthUser> {
		// 1. Create user in Firebase Auth using Admin SDK
		const userRecord = await auth.createUser({
			email,
			password,
			displayName: name,
		});

		// 2. Create user document in Firestore
		await db.collection("users").doc(userRecord.uid).set({
			uid: userRecord.uid,
			email: userRecord.email,
			name: name,
			createdAt: new Date(),
		});

		// 3. Since Admin SDK won't give us an ID token directly for a password session,
		// we sign in via REST API to get the token, or return a custom token.
		// For consistency with typical flows, we'll use the REST API.
		return await this.login(email, password);
	}

	async login(email: string, password: string): Promise<IAuthUser> {
		const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseConfig.apiKey}`;

		const response = await axios.post(url, {
			email,
			password,
			returnSecureToken: true,
		});

		const { localId, idToken, displayName } = response.data;

		return {
			uid: localId,
			email,
			name: displayName || "",
			token: idToken,
		};
	}

	async logout(): Promise<void> {
		// Admin SDK doesn't have a "sign out" session on the server.
		// In a backend API, logout is usually handled by the client discarding the token.
		// We could revoke tokens here if we implemented a session store.
		return;
	}

	async resetPassword(email: string): Promise<void> {
		const link = await auth.generatePasswordResetLink(email);
		// Note: Usually you'd send this link via email.
		// Firebase Client SDK has sendPasswordResetEmail which does both.
		// Admin SDK only generates the link. For now we just generate it.
		console.log(`Password reset link generated for ${email}: ${link}`);
	}

	async update(
		uid: string,
		data: { name?: string; email?: string },
	): Promise<void> {
		// 1. Update Firebase Auth
		await auth.updateUser(uid, {
			displayName: data.name,
			email: data.email,
		});

		// 2. Update Firestore document
		const updateData: Record<string, string> = {};
		if (data.name) updateData.name = data.name;
		if (data.email) updateData.email = data.email;

		await db.collection("users").doc(uid).update(updateData);
	}

	async delete(uid: string): Promise<void> {
		// 1. Cascading deletion: Delete all lists and their product items
		const listsSnapshot = await db
			.collection("lists")
			.where("ownerId", "==", uid)
			.get();

		for (const listDoc of listsSnapshot.docs) {
			const itemsSnapshot = await listDoc.ref.collection("items").get();
			for (const itemDoc of itemsSnapshot.docs) {
				await itemDoc.ref.delete();
			}
			await listDoc.ref.delete();
		}

		// 2. Delete Firestore user document
		await db.collection("users").doc(uid).delete();

		// 3. Delete from Firebase Auth
		await auth.deleteUser(uid);
	}

	async findAll(): Promise<Omit<IAuthUser, "token">[]> {
		const snapshot = await db.collection("users").get();
		const users: Omit<IAuthUser, "token">[] = [];

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

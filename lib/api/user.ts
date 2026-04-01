import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types/database";

export type User = {
	id: string;
	email?: string;
};

export type UserWithProfile = User & {
	profile: Profile | null;
};

/**
 * Get the current authenticated user
 */
export async function getCurrentUser(): Promise<User | null> {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) return null;

	return {
		id: user.id,
		email: user.email,
	};
}

/**
 * Get the current user's profile
 */
export async function getUserProfile(userId: string): Promise<Profile | null> {
	const supabase = createClient();
	const { data, error } = await supabase
		.from("profiles")
		.select("*")
		.eq("id", userId)
		.single();

	if (error) throw error;
	return data;
}

/**
 * Get current user with their profile
 */
export async function getCurrentUserWithProfile(): Promise<UserWithProfile | null> {
	const user = await getCurrentUser();
	if (!user) return null;

	const profile = await getUserProfile(user.id);
	return {
		...user,
		profile,
	};
}

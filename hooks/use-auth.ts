"use client";

import { createClient } from "@/lib/supabase/client";

export function useAuth() {
	const signInWithGoogle = async (redirectTo: string = "/") => {
		const supabase = createClient();
		const { error } = await supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
			},
		});

		return { error };
	};

	return {
		signInWithGoogle,
	};
}

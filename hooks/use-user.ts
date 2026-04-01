import { useQuery } from "@tanstack/react-query";
import { getCurrentUser, getCurrentUserWithProfile } from "@/lib/api/user";

/**
 * Hook to get the current authenticated user
 */
export const useUser = () => {
	return useQuery({
		queryKey: ["user"],
		queryFn: getCurrentUser,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
};

/**
 * Hook to get the current user with their profile
 */
export const useUserWithProfile = () => {
	return useQuery({
		queryKey: ["user", "profile"],
		queryFn: getCurrentUserWithProfile,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
};

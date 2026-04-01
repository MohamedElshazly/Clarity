import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "@/lib/api/dashboard";
import { useUser } from "./use-user";

/**
 * Hook to get dashboard statistics
 */
export const useGetDashboardStats = () => {
	const { data: user } = useUser();
	const userId = user?.id;

	return useQuery({
		queryKey: ["dashboard-stats", userId],
		queryFn: () => getDashboardStats(userId!),
		enabled: !!userId,
		staleTime: 60 * 1000, // 1 minute
	});
};

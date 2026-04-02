import { useQuery } from "@tanstack/react-query";
import { getInsightsData, type Period } from "@/lib/api/insights";
import { useUser } from "./use-user";

/**
 * Hook to get insights data for a given period
 */
export const useGetInsightsData = (period: Period = "monthly") => {
	const { data: user } = useUser();
	const userId = user?.id;

	return useQuery({
		queryKey: ["insights", userId, period],
		queryFn: () => getInsightsData(userId!, period),
		enabled: !!userId,
		staleTime: 60 * 1000, // 1 minute
	});
};

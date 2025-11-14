"use server";
import { actionClient } from "@/lib/safe-action";
import { getCachedDashboardStats } from "@/lib/cache";

export const getDashboardStats = actionClient
  .metadata({ actionName: "get-dashboard-stats" })
  .action(async () => {
    const stats = await getCachedDashboardStats();
    return { stats };
  });

import type { AppType } from "../app";
import type { FiguresResponse } from "../../../shared/src/types/api/models";

export const figures = (app: AppType) => {
  return app.get("/figures", async ({ supabase }): Promise<FiguresResponse> => {
    const { data, error } = await supabase
      .from("figures")
      .select("*")
      .eq("is_active", true)
      .order("popularity_score", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch figures: ${error.message}`);
    }

    return {
      success: true,
      data,
      error: null,
      message: "Figures retrieved successfully",
      timestamp: new Date().toISOString(),
    };
  });
};

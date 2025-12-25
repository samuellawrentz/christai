import type { AppType } from "../app";

export const figures = (app: AppType) => {
  return app.get("/figures", async ({ supabase }) => {
    const { data, error } = await supabase
      .from("figures")
      .select("*")
      .eq("is_active", true)
      .order("popularity_score", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch figures: ${error.message}`);
    }

    return data;
  });
};

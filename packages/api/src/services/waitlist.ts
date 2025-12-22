import { validateEmail } from "@christianai/shared/utils/index";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { WaitlistInsert } from "../models/waitlist";

export class WaitlistService {
  async addToWaitlist(
    supabase: SupabaseClient,
    data: WaitlistInsert,
  ): Promise<{ success: boolean }> {
    const emailError = validateEmail(data.email);
    if (emailError) {
      throw new Error(emailError);
    }

    const { error } = await supabase
      .from("waitlist")
      .insert({ email: data.email.toLowerCase().trim(), source: data.source });

    if (error && !error.message.includes("duplicate")) {
      throw new Error("Failed to join waitlist");
    }

    return { success: true };
  }
}

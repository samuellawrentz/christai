import type { AppType } from "../app";
import { waitlistModels } from "../models/waitlist";
import { WaitlistService } from "../services/waitlist";

const service = new WaitlistService();

export const root = (rootApp: AppType) => {
  return rootApp.use(waitlistModels).post(
    "/waitlist",
    async ({ supabase, body }) => {
      return service.addToWaitlist(supabase, body);
    },
    {
      body: "waitlistInsert",
    },
  );
};

import { t } from "elysia";

export const figureModels = {
  figure: t.Object({
    id: t.Number(),
    slug: t.String(),
    display_name: t.String(),
    description: t.Optional(t.String()),
    avatar_url: t.Optional(t.String()),
    category: t.Optional(t.String()),
    is_active: t.Boolean(),
    requires_pro: t.Boolean(),
    popularity_score: t.Number(),
    created_at: t.String(),
  }),
};

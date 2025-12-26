import { t } from "elysia";

const userPreferencesSchema = t.Object({
  pronouns: t.Optional(
    t.Union([t.Literal("he/him"), t.Literal("she/her"), t.Literal("they/them")]),
  ),
  age_group: t.Optional(
    t.Union([t.Literal("child"), t.Literal("teen"), t.Literal("adult"), t.Literal("senior")]),
  ),
  tone: t.Optional(t.Union([t.Literal("formal"), t.Literal("conversational"), t.Literal("warm")])),
  bible_translation: t.Optional(
    t.Union([
      t.Literal("NIV"),
      t.Literal("ESV"),
      t.Literal("KJV"),
      t.Literal("NLT"),
      t.Literal("MSG"),
    ]),
  ),
});

export const userModels = {
  user: t.Object({
    id: t.String(),
    email: t.String(),
    username: t.Optional(t.String()),
    first_name: t.Optional(t.String()),
    preferences: t.Optional(userPreferencesSchema),
  }),

  userUpdate: t.Object({
    username: t.Optional(t.String()),
    first_name: t.Optional(t.String()),
    preferences: t.Optional(userPreferencesSchema),
  }),
};

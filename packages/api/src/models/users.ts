import { t } from "elysia";

export const userModels = {
  user: t.Object({
    id: t.String(),
    email: t.String(),
    username: t.Optional(t.String()),
    first_name: t.Optional(t.String()),
    preferences: t.Optional(t.Record(t.String(), t.Any())),
  }),

  userUpdate: t.Object({
    username: t.Optional(t.String()),
    first_name: t.Optional(t.String()),
    preferences: t.Optional(t.Record(t.String(), t.Any())),
  }),
};

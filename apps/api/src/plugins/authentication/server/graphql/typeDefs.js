// plugins/authentication/server/nexus/uiPrefsTypes.js
import { enumType, objectType, extendType, stringArg, nonNull } from "nexus";

export const Role = enumType({
  name: "Role",
  members: ["STUDENT", "TEACHER", "INSTITUTION_ADMIN", "DEAN", "ADMIN"],
});

export const User = objectType({
  name: "User",
  definition(t) {
    t.nonNull.id("id");
    t.nonNull.string("email");
    t.string("displayName");
    t.nonNull.list.nonNull.field("roles", { type: "Role" });
  },
});

export const Ok = objectType({
  name: "Ok",
  definition(t) {
    t.nonNull.boolean("ok");
  },
});

export const UiPrefsQuery = extendType({
  type: "Query",
  definition(t) {
    t.string("myUiPrefs", {
      async resolve(_, __, ctx) {
        // Example: fetch from DB or local cache
        return JSON.stringify({ darkMode: true, layout: "compact" });
      },
    });
  },
});

export const UiPrefsMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("setMyUiPrefs", {
      type: "Ok",
      args: {
        json: nonNull(stringArg()),
      },
      async resolve(_, { json }, ctx) {
        // Example: save to DB
        console.log("Saving prefs:", json);
        return { ok: true };
      },
    });
  },
});

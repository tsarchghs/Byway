import { objectType } from "nexus"

export const UiPrefsResult = objectType({
  name: "UiPrefsResult",
  definition(t) {
    t.boolean("ok")
  },
})

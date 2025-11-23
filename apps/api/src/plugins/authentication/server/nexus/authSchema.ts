import { makeSchema } from "nexus"
import { join, dirname } from "path"
import { fileURLToPath } from "url"
import * as authTypes from "./authTypes.js"
import * as institutionTypes from "./institutionTypes.js"
import * as scalars from "./scalars.js"
// ADD THESE
import * as uiPrefsQueries from "./uiPrefs/uiPrefsQueries.js"
import * as uiPrefsMutations from "./uiPrefs/uiPrefsMutations.js"
import * as uiPrefsTypes from "./uiPrefs/uiPrefsTypes.js"

const __dirname = dirname(fileURLToPath(import.meta.url))

export const schema = makeSchema({
types: [
  ...Object.values(authTypes),
  ...Object.values(institutionTypes),
  ...Object.values(scalars),
  ...Object.values(uiPrefsQueries),
  ...Object.values(uiPrefsMutations),
  ...Object.values(uiPrefsTypes),
],
  outputs: {
    schema: join(__dirname, "../generated/schema.graphql"),
    typegen: join(__dirname, "../generated/nexus-typegen.d.ts"),
  },
})

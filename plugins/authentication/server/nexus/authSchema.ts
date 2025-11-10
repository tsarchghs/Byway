import { makeSchema } from "nexus"
import { join, dirname } from "path"
import { fileURLToPath } from "url"
import * as authTypes from "./authTypes.js"
import * as institutionTypes from "./institutionTypes.js"
import * as scalars from "./scalars.js"
const __dirname = dirname(fileURLToPath(import.meta.url))

export const schema = makeSchema({
  types: [authTypes, institutionTypes, scalars], // ✅ correct key
  outputs: {
    schema: join(__dirname, "../generated/schema.graphql"),
    typegen: join(__dirname, "../generated/nexus-typegen.d.ts"),
  },
})

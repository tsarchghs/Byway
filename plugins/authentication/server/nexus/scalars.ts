import { scalarType } from "nexus"

export const DateTime = scalarType({
  name: "DateTime",
  asNexusMethod: "dateTime", // optional if you want t.dateTime()
  description: "ISO 8601 date-time scalar",
  parseValue(value) {
    return new Date(value)
  },
  serialize(value) {
    return new Date(value).toISOString()
  },
})

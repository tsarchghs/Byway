// This is a non-destructive Prisma patch suggestion.
// Merge into plugins/authentication/server/db/schema.prisma if you don't already have 'roles' and 'displayName'.
//
// model User {
//   id               String   @id @default(cuid())
//   email            String   @unique
//   password         String
//   firstName        String?
//   lastName         String?
//   // NEW (SQLite supports Json as TEXT in Prisma)
//   roles            Json     @default("[]")
//   // Optional convenience
//   displayName      String?
//   createdAt        DateTime @default(now())
//   updatedAt        DateTime @updatedAt
// }

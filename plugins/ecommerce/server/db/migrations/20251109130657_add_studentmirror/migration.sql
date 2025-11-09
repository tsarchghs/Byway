-- CreateTable
CREATE TABLE "StudentMirror" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "displayName" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "email" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "subtotal" REAL NOT NULL DEFAULT 0,
    "discount" REAL NOT NULL DEFAULT 0,
    "total" REAL NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Order_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "StudentMirror" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("createdAt", "currency", "discount", "email", "id", "status", "studentId", "subtotal", "total", "updatedAt") SELECT "createdAt", "currency", "discount", "email", "id", "status", "studentId", "subtotal", "total", "updatedAt" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
CREATE INDEX "Order_studentId_idx" ON "Order"("studentId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "StudentMirror_userId_idx" ON "StudentMirror"("userId");

-- CreateIndex
CREATE INDEX "OrderItem_courseId_idx" ON "OrderItem"("courseId");

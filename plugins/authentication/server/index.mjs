import express from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import { z } from "zod";
import { PrismaClient } from "./db/generated/index.js";
import { schema } from "./nexus/authSchema.ts";
import { createContext } from "./nexus/context.js";
import { sdk } from "../../../apps/api/src/sdk/index.js";
import { mergeUiPrefs } from "./graphql/merge.uiPrefs.js";
import {
  loadPrefsTypeDefs,
  prefsResolversExport,
  mergeResolvers,
} from "./graphql/prefs.merge.mjs";
import { authUiResolvers } from "./graphql/resolvers.mjs";
import { authUiTypeDefs } from "./graphql/typeDefs.mjs";

// --- Zod route validators ---
export const ZUserCreate = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  teacherProfileId: z.string().optional(),
});

export const ZUserUpdate = z.object({
  id: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  teacherProfileId: z.string().optional(),
});

// --- Prisma client (singleton) ---
const prisma = new PrismaClient();

// --- Express Router ---
export async function register(app) {
  const router = express.Router();

  // ✅ Security / Middleware
  router.use(cors({ origin: process.env.CORS_ORIGIN || "*", credentials: true }));
  router.use(helmet());
  router.use(compression());
  router.use(express.json({ limit: "1mb" }));

  // ✅ Apollo GraphQL
  const isDev = process.env.NODE_ENV !== "production";
  const apollo = new ApolloServer({
    schema,
    context: ({ req }) => createContext({ req }),
    introspection: isDev,
    playground: isDev,
    formatError: (err) => ({
      message: err.message,
      code: err.extensions?.code || "INTERNAL_SERVER_ERROR",
      path: err.path,
    }),
  });

  await apollo.start();
  apollo.applyMiddleware({
    app: router,
    path: "/graphql",
    bodyParserConfig: false,
  });

  // ✅ Health check
  router.get("/health", (_, res) =>
    res.json({
      ok: true,
      plugin: "authentication",
      environment: process.env.NODE_ENV,
      version: process.env.BYWAY_VERSION || "dev",
    })
  );

  // ✅ REST: Users
  router.get("/users", async (_, res, next) => {
    try {
      const users = await prisma.user.findMany();
      res.json({
        success: true,
        data: users.map((u) => ({ ...u, password: undefined })),
      });
    } catch (err) {
      next(err);
    }
  });

  router.get("/users/:id", async (req, res, next) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.params.id },
      });
      if (!user)
        return res.status(404).json({ success: false, error: "User not found" });
      res.json({ success: true, data: { ...user, password: undefined } });
    } catch (err) {
      next(err);
    }
  });

  router.post("/users", async (req, res, next) => {
    try {
      const parsed = ZUserCreate.parse(req.body);
      const created = await prisma.user.create({ data: parsed });
      res.status(201).json({
        success: true,
        data: { ...created, password: undefined },
      });
    } catch (err) {
      next(err);
    }
  });

  router.put("/users/:id", async (req, res, next) => {
    try {
      const parsed = ZUserUpdate.parse(req.body);
      const updated = await prisma.user.update({
        where: { id: req.params.id },
        data: parsed,
      });
      res.json({
        success: true,
        data: { ...updated, password: undefined },
      });
    } catch (err) {
      next(err);
    }
  });

  router.delete("/users/:id", async (req, res, next) => {
    try {
      await prisma.user.delete({ where: { id: req.params.id } });
      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  });

  // ✅ Error handler (after all routes)
  router.use((err, req, res, _next) => {
    console.error("[auth:error]", err);
    const status = err.name === "ZodError" ? 400 : 500;
    res.status(status).json({
      success: false,
      error: err.message || "Internal Server Error",
    });
  });

  // ✅ Mount plugin router
  app.use("/api/authentication", router);

  // ✅ Graceful shutdown
  process.on("SIGINT", async () => {
    await prisma.$disconnect();
    console.log("🧹 [auth] Prisma disconnected cleanly.");
    process.exit(0);
  });

  console.log(
    `[auth] GraphQL ready at /api/authentication/graphql  (${isDev ? "dev" : "prod"})`
  );
}

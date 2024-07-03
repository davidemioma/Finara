import { Hono } from "hono";
import { logger } from "hono/logger";
import { serveStatic } from "hono/bun";
import { authRoute } from "./routes/auth";
import { userRoute } from "./routes/user";
import { bankRoute } from "./routes/bank";
import { transactionRoute } from "./routes/transaction";

const app = new Hono();

app.use("*", logger());

const apiRoutes = app
  .basePath("/api")
  .route("/auth", authRoute)
  .route("/user", userRoute)
  .route("/bank", bankRoute)
  .route("/transaction", transactionRoute);

// Frontend. it's displays the client code if no API endpoint.
app.get("*", serveStatic({ root: "./client/dist" }));

app.get("*", serveStatic({ path: "./client/dist/index.html" }));

export default app;

export type ApiRoutesType = typeof apiRoutes;

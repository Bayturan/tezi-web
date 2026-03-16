import Fastify from "fastify";
import view from "@fastify/view";
import formbody from "@fastify/formbody";
import staticFiles from "@fastify/static";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import ejs from "ejs";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = Fastify({ logger: true });

await app.register(formbody);
await app.register(staticFiles, {
  root: join(__dirname, "..", "public"),
  prefix: "/public/",
});
await app.register(view, {
  engine: { ejs },
  root: join(__dirname, "..", "views"),
  layout: "layout",
  options: { filename: join(__dirname, "..", "views") },
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

app.get("/", async (_req, reply) => {
  return reply.view("home", { title: "Tezi Web" });
});

app.get("/privacy", async (_req, reply) => {
  return reply.view("privacy", { title: "Privacy Policy – Tezi Web" });
});

app.get("/requests/users/delete", async (_req, reply) => {
  return reply.view("delete-request", {
    title: "Request Account Deletion – Tezi Web",
    submitted: false,
    errors: [],
  });
});

app.post("/requests/users/delete", async (req, reply) => {
  const { name, email, reason, confirm } = req.body as {
    name?: string;
    email?: string;
    reason?: string;
    confirm?: string;
  };

  const errors: string[] = [];
  if (!name || name.trim() === "") errors.push("Full name is required.");
  if (!email || !EMAIL_RE.test(email.trim()))
    errors.push("A valid email address is required.");
  if (confirm !== "yes")
    errors.push("You must confirm that you understand account deletion is permanent.");

  if (errors.length > 0) {
    return reply.view("delete-request", {
      title: "Request Account Deletion – Tezi Web",
      submitted: false,
      errors,
      name,
      email,
      reason,
    });
  }

  return reply.view("delete-request", {
    title: "Request Submitted – Tezi Web",
    submitted: true,
    errors: [],
  });
});

const PORT = parseInt(process.env.PORT ?? "8080", 10);

try {
  await app.listen({ port: PORT, host: "0.0.0.0" });
  console.log(`Server running on http://localhost:${PORT}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}

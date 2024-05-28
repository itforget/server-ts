import fastify from "fastify";
import { routes } from "./routes/routes";
import { ZodError } from "zod";

export const app = fastify();

app.register(routes);

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: "Validation error.", issues: error.format() });
  }
});

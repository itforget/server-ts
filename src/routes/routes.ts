import { FastifyInstance } from "fastify";
import { register } from "../controllers/userController";
import { login } from "../controllers/authController";
import { authenticate } from "../middlewares/auth";

export async function routes(fastify: FastifyInstance) {
  fastify.post("/register", register);
  fastify.post("/login", login);

  // Rotas protegidas
  fastify.get(
    "/protected",
    { preHandler: [authenticate] },
    async (request, reply) => {
      if (!request.user) {
        console.log("Usuário não autenticado");
        return reply.status(401).send({ error: "Usuário não autenticado" });
      }
      return reply.send({
        message: "Esta é uma rota protegida",
      });
    }
  );
}

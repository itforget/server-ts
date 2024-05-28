import { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";
import { jwtConfig } from "../utils/jwt";

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return reply.status(401).send({ error: "Token não fornecido" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return reply.status(401).send({ error: "Token inválido" });
    }

    const decoded = jwt.verify(token, jwtConfig.secret) as { userId: string };

    request.user = { id: decoded.userId };
  } catch (err) {
    return reply.status(401).send({ error: "Token inválido" });
  }
}

import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import db from "../db/db";
import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import { jwtConfig } from "../utils/jwt";

// Schema de validação de login
const loginBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Função para gerar token JWT
function generateToken(userId: string, email: string, name: string) {
  return jwt.sign(
    { userId, email, name },
    jwtConfig.secret,
    jwtConfig.signOptions
  );
}

// Controlador de login
export async function login(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { email, password } = loginBodySchema.parse(request.body);

    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return reply.status(401).send({ error: "Credenciais inválidas" });
    }
    const password_hash = user.password_hash;
    const isPasswordValid = await compare(password, password_hash);

    if (!isPasswordValid) {
      return reply
        .status(401)
        .send({ error: "Credenciais inválidas", password });
    }

    const token = generateToken(user.id, user.email, user.name);

    return reply.status(200).send({ token });
  } catch (err: any) {
    return reply
      .status(400)
      .send({ error: "Erro ao fazer login", message: err.message });
  }
}

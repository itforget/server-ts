import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import db from "../db/db";
import { hash } from "bcryptjs";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  try {
    const registerBodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(6),
      avatar: z.string(),
    });

    const { name, email, password, avatar } = registerBodySchema.parse(
      request.body
    );

    const password_hash = await hash(password, 6);

    const userWithSameEmail = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (userWithSameEmail) {
      throw new Error("E-mail already exists.");
    }

    const newUser = await db.user.create({
      data: {
        name,
        email,
        password_hash: password_hash,
        avatar,
      },
    });

    return reply
      .status(201)
      .send({ message: "Usuario criado com sucesso", user: newUser });
  } catch (err: any) {
    return reply
      .status(409)
      .send({ error: "Error ao criar usuario", message: err.message });
  }
}

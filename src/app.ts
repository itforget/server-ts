import fastify from 'fastify'
import { appRoutes } from './http/controllers/router'

export const app = fastify()

app.register(appRoutes)

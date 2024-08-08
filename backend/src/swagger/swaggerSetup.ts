
import fastifyExpress from '@fastify/express';
import FastifySwagger from '@fastify/swagger';
import FastifySwaggerUI from '@fastify/swagger-ui';
import { FastifyInstance } from 'fastify';
import fs from 'fs';
import path from 'path';


export const swagger  = async (server: FastifyInstance) => {

  const swaggerFilePath = './src/swagger/swagger.json';
  const swaggerFileContent = fs.readFileSync(swaggerFilePath, 'utf-8');
  const swaggerDocument = JSON.parse(swaggerFileContent);

  await server.register(FastifySwagger, {
    swagger: swaggerDocument,
  });

  await server.register(FastifySwaggerUI, {
    routePrefix: '/api',
    uiConfig: {
      docExpansion: 'none',
      deepLinking: false
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject, request, reply) => { return swaggerObject },
    transformSpecificationClone: true
  });
  await server.register(fastifyExpress);
};

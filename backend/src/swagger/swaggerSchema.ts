const fastify = require('fastify')({ logger: true });
const fs = require('fs');
import { FastifyInstance } from "fastify";
const path = require('path');
const swagger = require('fastify-swagger');


const swaggerFilePath = path.resolve(__dirname, 'swagger.json');
const swaggerFileContent = fs.readFileSync(swaggerFilePath, 'utf-8');
const swaggerDocument = JSON.parse(swaggerFileContent);

// Register Swagger to serve the API documentation
    // Register Swagger to serve the API documentation
fastify.register(swagger, {
    swagger: swaggerDocument
});
  

// Function to extract schema from Swagger definitions
export const getSchemaFromSwagger = (ref: string) => {
  if (typeof ref !== 'string') {
        throw new Error('Reference must be a string');
    }    
  const definition = ref.replace('#/definitions/', '');
  return swaggerDocument.definitions[definition];
};

// Define the schema using the Swagger definition
export const addRoomSchema = {
  body: getSchemaFromSwagger('#/definitions/addRoomDef'),
  headers: {
    type: 'object',
    required: ['authorization'],
    properties: {
      authorization: { type: 'string' }
    }
  }
};

export const addSensorSchema = {
    body: getSchemaFromSwagger('#/definitions/addSensorsDesc'),
    headers: {
      type: 'object',
      required: ['authorization'],
      properties: {
        authorization: { type: 'string' }
      }
    }
  };

export const sensorReportSchema = {
    body: getSchemaFromSwagger('#/definitions/sensorReport'),
    headers: {
        type: 'object',
        required: ['authorization'],
        properties: {
        authorization: { type: 'string' }
        }
    }
};

export const sensorDeleteSchema = {
    body: getSchemaFromSwagger('#/definitions/sensorDelete'),
    headers: {
        type: 'object',
        required: ['authorization'],
        properties: {
        authorization: { type: 'string' }
        }
    }
};

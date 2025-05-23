import swaggerJsdoc from "swagger-jsdoc";
import { PORT } from "./constants";
import { Todo } from "../models/todo.model";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Todo API",
      version: "1.0.0",
      description: "Todo API with Swagger documentation",
    },
    
    servers: [{ url: `http://localhost:${PORT}` }],
    
    components: {
      schemas: {
        Todo: {
          type: "object",
          properties: {
            id: { type: "integer", format: "int64", readOnly: true },
            title: { type: "string" },
            completed: { type: "boolean" },
          },
          required: ["title", "completed"],
        },
      },
    },
    
  },
  apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);

import express, { Request, Response, Application } from "express";
import cors from "cors";
import { swaggerSpec } from "./swagger";
import swaggerUi from "swagger-ui-express";

export const createApp = (): Application => {
  const app = express();
  
  app.use(cors());
  app.use(express.json());
  
  // Swagger
  // app.get("/swagger.json", (req, res) => res.json(swaggerSpec));
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  
  return app;
};


import express, { Request, Response, Application } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import path from "path";
import cors from "cors";
import { readTodos, writeTodos, createFile } from "./io";

const app: Application = express();
const port = 3000;
export const DATA_FILE = path.join(__dirname, "todos.json");


interface Todo {
    id: number;
    title: string;
    completed: boolean;
}

// Swagger конфигурация
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Todo API",
            version: "1.0.0",
            description: "Simple Todo API with Swagger documentation",
        },
        servers: [
            {
                url: `http://localhost:${port}`,
                description: "Local server",
            },
        ],
    },
    apis: ["./src/app.ts"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use(cors());
app.use(express.json());

// Добавляем endpoint для получения сырой спецификации
app.get("/swagger.json", (req: Request, res: Response) => {
    res.send(swaggerSpec);
});

// Настраиваем Swagger UI с явным указанием URL
app.use("/docs", 
    swaggerUi.serve, swaggerUi.setup(swaggerSpec, 
        {
            swaggerOptions: {
                url: `/swagger.json`,
            },
        }
    )
);

/**
 * @swagger
 * /todos:
 *   get:
 *     summary: Get all todos
 *     responses:
 *       200:
 *         description: Success
 */
app.get("/todos", async (req: Request, res: Response<Todo[]>) => {
    try {
        const todos = await readTodos();
        console.log(todos);
        res.json(todos);
    } catch (error) {
        res.status(500).json([]);
    }
});

// Запуск сервера
createFile()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
      console.log(`Docs available at http://localhost:${port}/docs`);
    });
  })
  .catch(error => {
    console.error("Failed to initialize:", error);
  });

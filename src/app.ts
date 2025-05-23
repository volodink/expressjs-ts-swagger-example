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
    components: {
      schemas: {
        Todo: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              format: "int64",
              readOnly: true,
            },
            title: {
              type: "string",
            },
            completed: {
              type: "boolean",
            },
          },
          required: ["title", "completed"],
        },
      },
    },
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
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      url: `/swagger.json`,
    },
  })
);

/**
 * @swagger
 * /todos:
 *   get:
 *     tags:
 *       - Todos
 *     summary: Получить все задачи
 *     responses:
 *       200:
 *         description: Успешный ответ
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Todo'
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

/**
 * @swagger
 * /todos:
 *   post:
 *     tags:
 *       - Todos
 *     summary: Создать новую задачу
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Todo'
 *     responses:
 *       201:
 *         description: Задача создана
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       400:
 *         description: Неверные данные
 */
app.post("/todos", async (req: Request, res: Response) => {
  try {
    const { title, completed } = req.body;

    if (!title || typeof completed !== "boolean") {
      res.status(400).json({ error: "Неверные данные" });
      return
    }

    const todos: Todo[] = await readTodos();

    const newTodo: Todo = {
      id: todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1,
      title: title,
      completed: completed
    };

    await writeTodos([...todos, newTodo]);
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ error: "Ошибка сервера" });
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
  .catch((error) => {
    console.error("Failed to initialize:", error);
  });

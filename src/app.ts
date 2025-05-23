import { createApp } from "./config/express";
import { PORT } from "./config/constants";
import { TodoRepository } from "./repositories/todo.repository";
import todoRoutes from "./routes/todo.routes";

const app = createApp();

// Роуты
app.use("/todos", todoRoutes);

// Инициализация и запуск сервера 
TodoRepository.findAll() // Инициализация файла
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Сервер запущен на http://localhost:${PORT}`);
      console.log(`Документация доступна на http://localhost:${PORT}/docs`);
    });
  })
  .catch((error) => {
    console.error("Ошибка инициализации:", error);
    process.exit(1);
  });


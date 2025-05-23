import { NextFunction, Request, Response } from "express";
import { Todo } from "../models/todo.model";
import { TodoService } from "../services/todo.service";

export const TodoController = {
  getAll: async (req: Request, res: Response<Todo[]>) => {
    try {
      res.json(await TodoService.getAllTodos());
    } catch (error) {
      res.status(500).json([]);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { title, completed } = req.body;
      
      if (!title || typeof completed !== "boolean") {
        res.status(400).json({ error: "Invalid data" });
        return;
      }

      const newTodo = await TodoService.createTodo({ title, completed });
      res.status(201).json(newTodo);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  },
};

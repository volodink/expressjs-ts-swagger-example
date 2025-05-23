import { Todo } from "../models/todo.model";
import { TodoRepository } from "../repositories/todo.repository";

export const TodoService = {
  getAllTodos: async (): Promise<Todo[]> => await TodoRepository.findAll(),
  createTodo: async (todoData: Omit<Todo, "id">): Promise<Todo> => {
    const todos = await TodoRepository.findAll();
    const newTodo = { id: TodoRepository.getNextId(todos), ...todoData };
    await TodoRepository.saveAll([...todos, newTodo]);
    return newTodo;
  },
};


import { Router } from "express";
import { TodosController } from "./controllers";


export class TodoRoutes {

    static get routes(): Router {

        const toDoController = new TodosController();
        const router = Router();
        router.get('/', (req, res) => toDoController.getTodos(req, res))
        router.get('/:id', (req, res) => toDoController.getTodoById(req, res))
        router.post('/', (req, res) => toDoController.createTodo(req, res))
        router.put('/:id', (req, res) => toDoController.updateTodo(req, res))
        router.delete('/:id', (req, res) => toDoController.deleteTodo(req, res))
        return router;
    }
}
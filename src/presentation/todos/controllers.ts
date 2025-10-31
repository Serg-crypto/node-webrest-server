import {Request, Response} from 'express';


const todos = [
  {id:1, text:'Buy milk', completedAt: new Date()}, 
  {id:2, text:'Buy Soda', completedAt: null},
  {id:3, text:'Buy Apples', completedAt: new Date()},
];



//  El controller es la capa que maneja la lógica de las peticiones HTTP.
export class TodosController {

    constructor(){}

    getTodos = (req:Request, res:Response) => {
      return res.json(todos);
    }



    getTodoById = (req:Request, res:Response) => {

      const id = +req.params.id;

      if (isNaN(id)) return  res.status(400).json({error: 'ID argument is not a number'}); 
      
      const todo = todos.find(todo => todo.id === id);
      (todo) ? res.json(todo) : res.status(404).json({error: `TODO with id: ${id} not found`});
    }



    createTodo = (req:Request, res:Response) => {

      const text = req.body.text;
      if (!text) return res.status(400).json({error: 'Text property is required'});

      const newTodo = {
        id: todos.length + 1,
        text: text,
        completedAt: new Date()
      };

      todos.push(newTodo);

      res.json(newTodo);
    }


  updateTodo = (req:Request, res:Response) => { 
    
    const id = +req.params.id;
    if (isNaN(id)) return res.status(400).json({error: 'ID argument is not a number'});

    const todo = todos.find(todo => todo.id === id);
    if (!todo) return res.status(404).json({error: `Todo with id: ${id} not found`});

    const { text, completedAt } = req.body;
    ( completedAt === "null" ) 
      ? todo.completedAt = null 
      : todo.completedAt = new Date( completedAt || todo.completedAt );


    todo.text = text || todo.text;
    res.json(todo);
   }




   deleteTodo = (req:Request, res:Response) => { 

    const id = +req.params.id;
    if (isNaN(id)) return res.status(400).json({error: 'ID argument is not a number'});
    const todo = todos.find((todo)=>todo.id === id);
    if(!todo) return res.status(404).json({error: `Todo with id: ${id} not found`});
    
    todos.splice(todos.indexOf(todo), 1);
    return res.status(200).json(todo);
   }
    
    
}
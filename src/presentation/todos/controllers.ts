import {Request, Response} from 'express';
import { prisma } from '../../data/postgres';
import { CreateTodoDto, UpdateTodoDto } from '../../domain/dtos';


//  El controller es la capa que maneja la lógica de las peticiones HTTP.
export class TodosController {

    constructor(){}

    getTodos = async (req:Request, res:Response) => {
      try{
        const todos = await prisma.todo.findMany();

        if(todos.length === 0){ 
          console.log("There are no items");
          return res.json([]);
        }

        console.log("Items fetched");
        return res.json(todos);

      }catch(error){
        console.error("Error fetching items:", error);
        return res.status(500).json({error: 'Internal server error'});
      }
      
    }


    getTodoById = async (req:Request, res:Response) => {
      try{
        const id = +req.params.id;

        if (isNaN(id)) return  res.status(400).json({error: 'ID argument is not a number'}); 
        const todoItem = await prisma.todo.findUnique({where:{id}});
        
        if(!todoItem){
          console.log(`The item with id: ${id} has not been found`);
          return res.status(404).json({error:'Item not found'});
        }
          
        console.log(`The item with id: ${id} has been fetched`);
        return res.json(todoItem);

      }catch(error){
        console.error("Error fetching item:", error);
        return res.status(500).json({error: 'Internal server error'});
      }
    }


    createTodo = async (req:Request, res:Response) => {
     
      try{
        const [error, createTodoDto] = CreateTodoDto.create(req.body);
        if(error) return res.status(400).json({error});
        
        const todo = await prisma.todo.create({data:createTodoDto!});

        console.log("Item created");
        return res.json(todo);

      }catch(error){
        console.error("Error creating item:", error);
        return res.status(500).json({error: 'Internal server error'});
      }
      
    }


  updateTodo = async(req:Request, res:Response) => { 
    try{
      const id = +req.params.id;
      const [error, updateTodoDto] = UpdateTodoDto.create({...req.body, id});
      if(error) return res.status(400).json({error});


      const updatedTodo = await prisma.todo.update(
        { where:{id}, 
           data: updateTodoDto!.values
        });
    
      console.log(`Item #${id} updated`);
      return res.json(updatedTodo);

    }catch(error:any){
      
      if(error?.code === 'P2025'){
          console.log("The item to be updated has not been found");
          return res.status(404).json({error: "Item not found"})
        }

      console.error("Error updating item:", error);
      return res.status(500).json({error: 'Internal server error'});
    }  
   }


   deleteTodo = async (req:Request, res:Response) => { 
    try {
      const id = +req.params.id;
      if (isNaN(id)) return res.status(400).json({error: 'ID argument is not a number'});

      const itemDeleted = await prisma.todo.delete({where:{id}});
      console.log("Item deleted");
      return res.json(itemDeleted);

    } catch (error: any){

      if(error?.code === 'P2025'){ 
        console.log("The item to be deleted has not been found");
        return res.status(404).json({error: 'Item not found'}); 
      }

      console.error("Error deleting item:", error);
      return res.status(500).json({error: 'Internal server error'});
    }
   }
    
}
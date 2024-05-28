import express from 'express';
import mongoose from 'mongoose';
//import moment from 'moment';
//const express = require('express')
const app = express();
//PORT
const port = 3005;

//MONGODB URL
const MongoDBURL = "mongodb+srv://sreelekshmiu30:oVb2Ro7jG823W40T@todos.leh48ta.mongodb.net/?retryWrites=true&w=majority&appName=todos";
//Middleware
app.use(express.json());


// todoList Schema
const todoListSchema = new mongoose.Schema({
  content: {
  type: String,
  required: true
  },
  date: {
    type: Date, // Change type to Date
    default: Date.now // Optionally, set a default value
  
  }
  },
  {
    timestamps: true
}
);
 const TodoList= mongoose.model('TodoList',todoListSchema);

//Route to get single todo
app.get('/todos/:id',async(req, res) => {
  try{
    const id = req.params.id;
    const todos =  await TodoList.findById(id);
    if(!todos){
      res.status(404).send("Todos not found");
    }else{
      res.status(201).send(todos);
    }
  }catch(error){
    console.log(error);
    res.status(500).send({message:error.message});
  }
  
});

//Route to get todos

app.get('/todos',async(req, res) => {
  try{
    const id = req.params.id;
    const todos =  await TodoList.find();
    if(!todos){
      res.status(404).send("Todos not found");
    }else{
      res.status(201).send(todos);
    }
  }catch(error){
    console.log(error);
    res.status(500).send({message:error.message});
  }
   
});

//Route to create todos
app.post('/todos',async(req,res) =>{
  try{
    
    if(!req.body.content || !req.body.date){
      res.status(400).send({message:"send all required fields : content,date"});
}else{
  const  content = req.body.content;
  const newDate =  Date.parse(req.body.date);

  // Date parsing successful, proceed with saving the todo item
  const newTodos = {
    content: content,
    date: newDate
  };
  // Proceed with saving the todo item


    const todo = await TodoList.create( newTodos);
    return res.status(201).send(todo);
}
  }catch(error){
    console.log(error);
    res.status(500).send({message:error.message});
  }

});
//Route to update todos
app.put('/todos/:id',async(req, res) => {
  try{
    const id = req.params.id;
    const updatedTodos =await TodoList.findByIdAndUpdate(id,req.body);
    res.status(200).json({message:`Updated todos for ${req.params.id}`} + updatedTodos);
  }catch(error){
    console.log(error);
    res.status(500).send({message:error.message});
  }

});
//Route to delete a todo
app.delete('/todos/:id',async(req, res) => {
  try{
    const id = req.params.id;
    const deletedTodos =  await TodoList.findByIdAndDelete(id);
    if(!deletedTodos){
      res.status(404).send("Todos not found");
    }else{
      res.status(201).send(deletedTodos);
    }
  }catch(error){
    console.log(error);
    res.status(500).send({message:error.message});
  }
  
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

mongoose.connect(MongoDBURL).then(() =>{
  console.log("App connected to database");
}).catch((error) =>{
  console.log(error);
})
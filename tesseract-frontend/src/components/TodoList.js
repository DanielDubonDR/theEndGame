import React, { useState } from "react";
import TodoForm from "./TodoForm";
import Todo from "./Todo";
import { useEffect } from "react";
import {createTodo, actualizar, eliminar, } from "./conection";



//Crear To Do list
function TodoList() {
  const [todos, setTodos] = useState([]);
  
  const getRequest = async () => {
    const respuesta = await fetch('http://localhost:4000/v1/to-dos');
    const respuestaJson = await respuesta.json();
    console.log("acaaaaaaaaaaa",respuestaJson.todos);
    setTodos(respuestaJson.todos);
  };

  useEffect(() => {
    getRequest();
  }, []);

  //Añadir elementos al To Do List
  const addTodo = async  (todo) => {
   
    if (!todo.text || /^\s*$/.test(todo.text)) {
      return ;
    }
    console.log("acaaaaa2",todo)
    const temp = {
      title: todo.text,
      description: todo.description,
      is_done:todo.is_done
    }
    const todoId = await createTodo(todo);
    todo.id = todoId.id;
 //   console.log(todo)
    const newTodos = [temp, ...todos];

    setTodos(newTodos);
    console.log(...todos);
  };

  //Mostrat la descripción
  const showDescription = (todoId) => {
    let updatedTodos = todos.map((todo) => {
      if (todo.id === todoId) {
        todo.showDescription = !todo.showDescription;
      }
      return todo;
    });
    setTodos(updatedTodos);
  };

  
  //Actualizar Elementos en el To Do List
  const updateTodo = (todoId, newValue) => {
   actualizar(todoId,newValue)
    if (!newValue.text || /^\s*$/.test(newValue.text)) {
      return;
    }
    setTodos((prev) =>
      prev.map((item) => (item.id === todoId ? newValue : item))
      );
     console.log(todoId)
  };



  //Eliminar Elementos del To Do List
  const removeTodo = (id) => {
    eliminar(id);
    const removedArr = [...todos].filter((todo) => todo.id !== id);

    setTodos(removedArr);
  };

  //Marcar como "Done"
  const completeTodo = (id) => {

    let updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        todo.is_done = !todo.is_done;
      }
     actualizar(id,todo)
     console.log("assssssssssssssssssssssssss",todo);
      return todo;
      
    });
    setTodos(updatedTodos);

  };

  return (
    <>
      <h1>What's the Plan for Today?</h1>
      <TodoForm onSubmit={addTodo} />
      <Todo
        todos={todos}
        completeTodo={completeTodo}
        removeTodo={removeTodo}
        updateTodo={updateTodo}
        showDescription={showDescription}
      />
    </>
  );
}

export default TodoList;

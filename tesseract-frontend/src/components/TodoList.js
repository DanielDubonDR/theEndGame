import React, { useState } from "react";
import TodoForm from "./TodoForm";
import Todo from "./Todo";
import { useEffect } from "react";
import { createTodo, updateToDo, updateIsDone, deleteTodo, } from "./requests";



//Crear To Do list
function TodoList() {
  const [todos, setTodos] = useState([]);

  const getTodos = async () => {
    const respuesta = await fetch('http://localhost:4000/v1/to-dos');
    const respuestaJson = await respuesta.json();
    respuestaJson.todos.forEach(element => {
      element.is_done = Boolean(element.is_done);
    });
    setTodos(respuestaJson.todos);
  };


  useEffect(() => {
    getTodos();
  }, []);

  //Añadir elementos al To Do List
  const addTodo = async (todo) => {

    if (!todo.text || /^\s*$/.test(todo.text)) {
      return;
    }
    console.log("acaaaaa2", todo)
    const temp = {
      title: todo.text,
      description: todo.description,
      is_done: todo.is_done
    }
    const todoId = await createTodo(todo);
    todo.id = todoId.id;
    const newTodos = [temp, ...todos];

    getTodos();
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
    updateToDo(todoId, newValue);
    getTodos();
    getTodos();
    if (!newValue.text || /^\s*$/.test(newValue.text)) {
      return;
    }
  };

  //Eliminar Elementos del To Do List
  const removeTodo = (id) => {
    deleteTodo(id);
    const removedArr = [...todos].filter((todo) => todo.id !== id);

    setTodos(removedArr);
  };

  //Marcar como "Done"
  const completeTodo = (id) => {
    updateIsDone(id);
    getTodos();
    getTodos();

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

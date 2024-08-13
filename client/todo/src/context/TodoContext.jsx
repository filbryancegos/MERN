import { useContext, createContext, useReducer, useEffect } from "react";
import { todoReducer } from "../reducer/todo";
const TodoContext = createContext();
import { useNavigate } from 'react-router-dom';

import HttpService from "../services/AuthServices";

const TodoProvider = ({ children }) => {

  const [state, dispatch] = useReducer(todoReducer, {
    tasks: [],
    notification: {
      message: '',
      isNotified: ''
    },
    loading: false,
  })

  const getTasks = async () => {
    try {
      const res = await HttpService.getTasks();
      dispatch({
        type: 'GET_TODO',
        payload: res.data,
      })
      return Promise.resolve(res);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  const completeTask = async (id) => {
    try {
      const res = await HttpService.completeTask(id);
      if (res.data.success) {
        dispatch({
          type: 'COMPLETE_TODO',
          payload: id,
        })
        getTasks()
      }
      return Promise.resolve(res);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  const deleteTask = async (id) => {
    try {
      const res = await HttpService.deleteTask(id);
     
      if (res.data.success) {
        dispatch({
          type: 'DELETE_TODO',
          payload: id,
        })
        getTasks()
      }
      return Promise.resolve(res);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  const createTask = async (task) => {
    try {
      const res = await HttpService.createTasks(task);
      console.log(res);
      return Promise.resolve(res);
    } catch (error) {
      console.log(error);
      return Promise.reject(error);
    }
  }

  const updateTask = async (id, data) => {
    try {
      const res = await HttpService.updateTask(id, data);
      console.log(res);
      return Promise.resolve(res);
    } catch (error) {
      console.log(error);
      return Promise.reject(error);
    }
  }
  
  return (
    <TodoContext.Provider
      value={{
        name: 'Eking',
        ...state,
        getTasks,
        dispatch,
        completeTask,
        deleteTask,
        createTask,
        updateTask
      }}
    >
      {children}
    </TodoContext.Provider>
  )
}

export const useTodoContext = () => {
  return useContext(TodoContext)
}


export { TodoContext, TodoProvider}
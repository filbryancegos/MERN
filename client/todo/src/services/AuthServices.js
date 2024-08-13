import http from "../http-common";

const login = (data) => {
  return http.post(`/login`, data);
};

const register = (data) => {
  return http.post(`/register`, data);
};

const getUsers = (data) => {
  return http.get(`/users`);
};

const findByUserId = (id) => {
  return http.get(`/users/${id}`);
};

const deleteByUserId = (id) => {
  return http.delete(`/users/${id}`);
};

const createTasks = (task) => {
  const data = {
    task,
    complete: 0
  }
  return http.post(`/tasks`, data);
};

const getTasks = () => {
  return http.get(`/tasks`);
};

const updateTask = ({id, task, complete}) => {
  const data = {
    task,
    complete,
  }
  return http.put(`/tasks/${id}`, data);
};

const deleteTask = (id) => {
  return http.delete(`/tasks/${id}`);
};

const completeTask = (id) => {
  return http.put(`/tasks/${id}/complete`);
};

const HttpService = {
  login,
  register,
  getUsers,
  findByUserId,
  deleteByUserId,
  createTasks,
  getTasks,
  updateTask,
  deleteTask,
  completeTask
}

export default HttpService
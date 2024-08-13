export const todoReducer = ( state, action) => {
  console.log(action.payload);
  switch (action.type) {
    
    case 'GET_TODO':
      return {
        ...state,
        tasks: action.payload,
      }
    case 'DELETE_TODO':
      const filterTasks = state.tasks.filter((t, index) => t.id !== action.payload)
      return {
        ...state,
        tasks: filterTasks,
      }
    case 'UPDATE_TODO':
      return {
        ...state,
        tasks: action.payload,
      }
    case 'IS_NOTIFICATION':
      return {
        ...state,
        notification: {
          message: action.payload.message,
          isNotified: action.payload.isNotified,
          type: action.payload.type
        },
      }
    case 'COMPLETE_TODO':
      const newTask = state.tasks.map((t, index) => {
        if (t.id === Number(action.payload)) {
          return {...t, complete: t.complete === 1 ? 0 : 1}
        }
        return t
      })
      return {
        ...state,
        tasks: newTask,
      }
    default:
      return state;
  }
}
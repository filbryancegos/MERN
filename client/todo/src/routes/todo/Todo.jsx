import React, { useEffect, useState } from 'react'
import { useTodoContext } from '../../context/TodoContext';
import { useAuthContext } from '../../context/AuthContext';
import { FiEdit, FiTrash2 } from "react-icons/fi";

function Todo() {
  const { getTasks, dispatch, tasks, completeTask, deleteTask, createTask, updateTask } = useTodoContext()
  const { handleNotification } = useAuthContext()
  const [task, setTask] = useState('')
  const [isUpdate, setIsUpdate] = useState(false)
  const [currentTask, setCurrentTask] = useState({})

  const fetchTask = async () => {
    try {
      const res =  await getTasks()
      dispatch({
        type: 'GET_TODO',
        payload: res.data,
      })
    } catch (error) {
      console.log(error);
    }
   }

  useEffect(() => {
   fetchTask()
  }, [])

  const handleComplete = async (id) => {
    try {
      const res = await(completeTask(id))
      if (res.data.success) {
        handleNotification(res.data.message, 'success')
      } else {
        handleNotification(res.data.message, 'error')
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleCheckboxChange = (e) => {
    const taskId = Number(e.target.id)
    handleComplete(taskId)
  }

  const handleDelete = async (id) => {
    try {
      const res = await deleteTask(id)
      if (res.data.success) {
        handleNotification(res.data.message, 'success')
      } else {
        handleNotification(res.data.message, 'error')
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!task) {
      handleNotification('please input task', 'error')
      return;
    }
    if (isUpdate) {
      handleUpdateTask()
    } else {
      try {
        const res = await createTask(task)
        console.log(res);
        if (res.data.success) {
          setTask('')
          handleNotification(res.data.message, 'success')
          fetchTask()
        }
  
      } catch (error) {
        console.log(error);
      }
    }
  }

  const handleUpdateTask =  async () => {
    const { id, complete } = currentTask
    const data = {
      task,
      complete,
      id
    }
    try {
      const res = await updateTask(data)
      if (res.data.success) {
        setCurrentTask({})
        setIsUpdate(false)
        handleNotification(res.data.message, 'success')
        fetchTask()
        setTask('')
      }

    } catch (error) {
      console.log(error);
    }
  }

  const handleEdit = async (param) => {
    setIsUpdate(true)
    setCurrentTask(param)
    setTask(param.task)
  }
  
  return (
    <div> 
        <h2 className='text-2xl text-center'>Add Todo</h2>
        <form onSubmit={handleSubmit}>
          <div className='w-1/2 flex m-auto mt-4'>
            <div className='w-1/2'>
              <button type='submit' className='bg-slate-500 p-2 text-white w-full'>Submit</button>
            </div>
            <div className='w-1/2'>
              <input name="task" type="text" value={task} onChange={(e) => setTask(e.target.value)}  class="block w-full" placeholder="" />
            </div>
          </div>
        </form>
        <table className='w-full mt-6'>
          <thead>
            <tr className='border border-slate-600'>
              <th className='text-left border border-slate-600 p-2'>Tasks</th>
              <th className='text-left border border-slate-600 p-2'>Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks?.map((task, index) => (
              <tr key={task.id} className='border border-slate-600'>
                <td className='border border-slate-600 p-2'><span><input
                  type="checkbox"
                  id={task.id}
                  checked={task.complete === 1 ? true : false}
                  onChange={handleCheckboxChange}
                /></span> <span className={task.complete === 1 ? 'line-through' : ''}>{task.task}</span></td>
                <td className='border border-slate-600 p-2'>
                  <div className='flex gap-2 items-center justify-end'>
                  <div><FiEdit onClick={() => handleEdit(task)} className={task.complete === 1 ? 'pointer-events-none text-gray-400' : ''} /></div>
                  <div ><FiTrash2 onClick={() => handleDelete(task.id)} /></div>
                  </div>
                 
                </td>
              </tr>
            ))}
          </tbody>
        </table>
    </div>
  )
}

export default Todo
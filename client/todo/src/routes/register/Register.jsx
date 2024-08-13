import React, { useState } from 'react'
import { Loader } from '../../components'
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';

function Register() {
  const { register, dispatch, loading } = useAuthContext()
  const navigate = useNavigate()

  const [errors, setErrors] = useState({
    email: '',
    username: '',
    password: '',
  })

  const [fields, setFields] = useState({
    email: '',
    username: '',
    password: '',
  })

  const handleNotification = (payload, type) => {
    dispatch({
      type: 'IS_NOTIFICATION',
      payload: {
        message: payload,
        isNotified: true,
        type,
      },
    })

    setTimeout(() => {
      dispatch({
        type: 'IS_NOTIFICATION',
        payload: {
          message: '',
          isNotified: false,
          type: ''
        },
      })
    }, 3000);
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch({
      type: 'IS_LOADING',
      payload: true,
    })
    dispatch({
      type: 'IS_NOTIFICATION',
      payload: {
        message: '',
        isNotified: false,
        type: ''
      },
    })
    try {
      const res = await register(fields);
      if (res.data.success) {
        setErrors({})
        dispatch({
          type: 'IS_LOADING',
          payload: false,
        })
        localStorage.setItem('user', JSON.stringify(res.data.user))
        localStorage.setItem('token', JSON.stringify(res.data.token))
        dispatch({
          type: 'LOGIN',
          payload: res.data.user,
        })

        handleNotification(res.data.message, 'success')
        navigate('/eking')
     
      }
    } catch (error) {
      if (!error.response.data.success && error.response.data.message) {
        handleNotification(error.response.data.message, 'error')
        setErrors({})
      } else if (!error.response.data.success && error.response.data.errors) {
        setErrors(error.response.data.errors ? error.response.data.errors : {})
        dispatch({
          type: 'IS_NOTIFICATION',
          payload: {
            message: '',
            isNotified: false,
            type: 'error'
          },
        })
      }
      dispatch({
        type: 'IS_LOADING',
        payload: false,
      })
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <form onSubmit={handleSubmit}> 
      <div className="mt-8 max-w-md m-auto">
        <div className="grid grid-cols-1 gap-6">
          <label className="block">
            <span className={`${errors?.username ? 'text-red-500' : 'text-gray-700'}`}>Username</span>
            <input name="username" value={fields.username} onChange={handleChange} type="text" className={`${errors?.username ? 'border border-red-500' : ''} mt-1 block w-full`} placeholder="" />
            {errors?.username && <span className="text-red-500 text-base">{errors?.username}</span>}
          </label>
          <label className="block">
            <span className={`${errors?.email ? 'text-red-500' : 'text-gray-700'}`}>Email</span>
            <input  name="email" value={fields.email} onChange={handleChange} type="text" className={`${errors?.email ? 'border border-red-500' : ''} mt-1 block w-full`} placeholder="" />
            {errors?.email && <span className="text-red-500 text-base">{errors?.email}</span>}
          </label>
          <label className="block">
            <span className={`${errors?.password ? 'text-red-500' : 'text-gray-700'}`}>Password</span>
            <input name="password" value={fields.password} onChange={handleChange} type="password" className={`${errors?.password ? 'border border-red-500' : ''} mt-1 block w-full`}/>
            {errors?.password && <span className="text-red-500 text-base">{errors?.password}</span>}
          </label>           
          <div className="block">
            <div className="mt-2">
              <div>
                <button type='submit' className='bg-blue-400 p-2 text-white w-full flex justify-center items-center gap-2'>
                  <span>Submit</span>
                  { loading && 
                    <Loader />
                  }
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <p>Already have an account? <span className='text-blue-400' onClick={() => navigate('/login')}>Login</span></p>
          </div>
        </div>
      </div>
    </form>
  )
}

export default Register
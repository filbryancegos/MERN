import { useContext, createContext, useReducer, useEffect } from "react";
import { authReducer } from "../reducer/auth";
import HttpService from "../services/AuthServices";

const AuthContext = createContext();
const AuthContextProvider = ({ children }) => {

  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    notification: {
      message: '',
      isNotified: ''
    },
    loading: false,
  })

  const fetchUsers = async () => {
    try {
      const res = await HttpService.getUsers();
      console.log(res);
    } catch (error) {
    }
  }

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user) {
      dispatch({
        type: 'LOGIN',
        payload: user,
      })
    }
    fetchUsers()
  }, [])


  const register = async (data) => {
    try {
      const res = await HttpService.register(data);
      return Promise.resolve(res);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  const login = async (data) => {
    try {
      const res = await HttpService.login(data);
      return Promise.resolve(res);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  const handleReset = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    dispatch({
      type: 'LOGOUT',
      payload: null
    })
    dispatch({
      type: 'IS_LOADING',
      payload: false
    })
    dispatch({
      type: 'IS_NOTIFICATION',
      payload: {
        message: '',
        isNotified: false
      }
    })
  }
  
  const getTasks = async () => {
    try {
      const res = await HttpService.getTasks();
      return Promise.resolve(res);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  const handleNotification = (payload, type) => {
    console.log(payload, type);
    dispatch({
      type: 'IS_NOTIFICATION',
      payload: {
        message: payload,
        isNotified: true,
        type
      },
    })

    setTimeout(() => {
      dispatch({
        type: 'IS_NOTIFICATION',
        payload: {
          message: '',
          isNotified: false,
          type: '',
        },
      })
    }, 2000);
  }
  
  return (
    <AuthContext.Provider
      value={{
        ...state,
        dispatch,
        register,
        handleReset,
        login,
        getTasks,
        handleNotification
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => {
  return useContext(AuthContext)
}

export { AuthContext, AuthContextProvider}
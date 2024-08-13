import React from 'react'
import ReactDOM from 'react-dom/client'
import { AuthContextProvider } from './context/AuthContext.jsx'
import { TodoProvider } from './context/TodoContext.jsx'

import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthContextProvider>
    <TodoProvider>
      <App/>
    </TodoProvider>
  </AuthContextProvider>
 
)

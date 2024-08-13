import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './App.css'
import { Layout, Home, Login, Register, Eking, RequireAuth, Todo  } from './routes'


function App() {
 
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/todo",
          element: <Todo />,
        }
      ]
    },
    {
      path: "/",
      element: <RequireAuth />,
      children: [
        {
          path: "/eking",
          element: <Eking />,
        }
      ]
    }
  ])
  return <RouterProvider router={router} />;
}

export default App

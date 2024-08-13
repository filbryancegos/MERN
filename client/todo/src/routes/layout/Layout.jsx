import { useEffect } from 'react'
import { Navigate, Outlet } from "react-router-dom";
import { Navigation } from '../../components'
import { useAuthContext } from '../../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Layout() {
  const { notification } = useAuthContext()
  const { type } = notification
  useEffect(() => {
    if (notification.isNotified) {
      const toastId = toast[type](notification.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return () => {
        toast.dismiss(toastId);
      };
    }
  }, [notification.isNotified])
  

  return (
    <>
    <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"

      />
      <Navigation/>
      <div className="mt-5 container m-auto">
        <Outlet />
      </div>
    </>
  )
}

function RequireAuth() {
  const { user } = useAuthContext()
  if (!user) {
    return <Navigate to="/eking" />;
  } else {
     return <>
      <Navigation/>
      <div className="mt-5 container m-auto">
        <Outlet />
      </div>
    </>
  }
}

export { Layout, RequireAuth }
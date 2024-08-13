import { useAuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Navigation() {
  const navigate = useNavigate();
  const { handleReset, user } = useAuthContext()
  const handleLogout = () => {
    handleReset()
    navigate('/login')
  }
  
  return (
    <div className="bg-slate-500 ">
      <div className="flex justify-between items-center container m-auto text-white">
        <div className='flex items-center justify-start p-4 gap-4  text-white'>
              <div onClick={() => navigate('/')}>Home</div>
              {user &&
              <div onClick={() => navigate('/todo')}>Todo</div>
              }
              {!user &&
                <>
                  <div onClick={() => navigate('/login')}>Login</div>
                  <div onClick={() => navigate('/register')}>Register</div>
                </>
              }
              {user &&
                <div onClick={handleLogout}>Logout</div>
              }
        </div>
        {
          user &&
          <div>
            <h2 className='text-lg'>welcome to {user.username}</h2>
          </div>
        }
      </div>
    </div>
  )
}

export default Navigation
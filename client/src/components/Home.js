
import {useNavigate} from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from "framer-motion"


export default function Home({socket}) {
 
  const navigate = useNavigate();
  let [error, setError] = useState(null);

  const Login = event => {
    event.preventDefault();
    const username = event.target.username.value;
    socket.emit('login', { username });
    socket.on('login', data => {
      if (data.success) {
       
        navigate("/product");
      } else {
        setError(data.error);
      }
    });
  }

  useEffect(() => {
    if (socket) {
        socket.emit('fetchUser');
        socket.on('user', data => {
        if (data !== null) {
            navigate("/product");
        }
      });
    }
  }, []);

  return <>
      <motion.div
    initial={{x: -500}}
  animate={{ x:0 }}
  transition={{ duration: 0.5, type: "tween" }}
>
    <div className='bg-dark-2'>
      <div className="h-screen m-30 md:h-screen relative flex flex-col justify-center items-center ">
        <div className="bg-dark-2 shadow-none p-10 pb-0 rounded-xl">
          <div className="flex flex-col items-center space-y-3">
            <span className="text-xl md:text-2xl font-semi-bold leading-normal text-white">Please enter a username</span>
          </div>
          {error && <div className="w-full rounded-md px-4 p-2 border-red-500 border text-red-500 bg-red-500/20 mt-4">
            <p>{error || "Something went wrong.."}</p>
          </div>}
          <form onSubmit={Login} className="my-8 w-30 md:w-96 h-32">
            <div className="relative mb-2">
              <label htmlFor="username" className="text-[12.5px] leading-tighter text-gray-300 uppercase font-medium text-base cursor-text"></label>
              <input id="username" autoComplete='off' placeholder='your username...' className=" bg-dark-3 transition-all duration-200 w-full rounded-lg p-3 border border-gray-300/10 focus:border-gray-700 outline-none ring-none" type="text" />
            </div>
            <div className="space-y-9">
              <div className="text-sm flex justify-end items-center h-full mt-8">
                <button className=' bg-blue-500 text-white py-2  px-2 rounded-lg'>Next</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    </motion.div>
  </>
}
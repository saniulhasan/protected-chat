import { Dialog, Transition } from "@headlessui/react";

import {useNavigate} from 'react-router-dom';
import { Fragment, useEffect, useState } from "react";
import { faCheckCircle, faComment, faLock, faPlus, faRandom, faRightToBracket, faShuffle, faUser, faUserSecret } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { motion, AnimatePresence } from "framer-motion"



export default function Product({socket}) {

    const navigate = useNavigate();
    let [rooms, setRooms] = useState([]);
    let [user, setUser] = useState(null);
    console.log(user)
    let [isOpen, setIsOpen] = useState(false);
    let [protectedRoom, setProtected] = useState(false);
    let [password, setPassword] = useState('');

  const [code, setCode] = useState()
  const [copys, setCopys] = useState(false)
  const [val, setVal] = useState('')
  const [name, setName] = useState('')
    console.log(rooms)
    console.log(user)
    
    
/*     random user */


/* rooms */

    useEffect(() => {
        if (socket) {
            socket.emit('fetchUser');
            socket.on('user', data => {
                if (data === null) {
                    navigate("/");
                } else {
                    setUser(data);
                }
            });

            return () => {
                socket.off('user', data => {
                    if (data === null) {
                        navigate("/");
                    } else {
                        setUser(data);
                    }
                });
            }
        }
    }, [socket]);
/*     console.log(rooms) */

useEffect(() => {
    if (socket) {
        socket.emit('fetchRooms');
        socket.on('rooms', data => {
            setRooms(data.rooms);
        });
        
        return () => {
            socket.off('rooms', data => {
                if (data.isLogged) {
                    setUser(data.user);
                }
                setRooms(data.rooms);
            });
        }
    }
}, []);


const JoinRoom = room => {
    const { id, passwordProtected } = room;
    if (passwordProtected) {
        setIsOpen(true);
        setProtected(room);

        if (password) {
            socket.emit('joinRoom', { id, password });
        }

    } else {
        socket.emit('joinRoom', { id });
    }

    socket.off('joinRoom').on('joinRoom', data => {
        if (data.success) {
            setIsOpen(false);
            setPassword('');
           navigate("/rooms/" + id);
        } else {
            if (data?.alreadyIn) {
                navigate("/rooms/" + id);
            } else {
                alert(data.error)
            }
        }
    });
}

const call = () => {
    setCopys(false)
    socket.emit('me', socket.id)
    socket.on('getid', (arg) => {
      setCode(arg)
    })
  }

  // onclick copy the meeting code
  const copy = (e) => {
    navigator.clipboard.writeText(code)
    setCopys(!copys)
  }

  const change = (e) => {
    setVal(e.target.value)
  }

  // onclick navigate to the meeeting page
  const join = () => {
    navigate(`/${name}/${val}`)
  }

  // handle the onchange event
  const namehandle = (e) => {
    setName(e.target.value)
  }

  return (
    <div>
   
   <div className="grid grid-cols-12">
            <div className="col-span-4 md:w-full w-screen">
            <Transition appear show={isOpen} as={Fragment}>

<Dialog as="div" className="relative z-10" onClose={() => {
    setIsOpen(false);
    setPassword('');
}}>
    <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
    >
        <div className="fixed inset-0 bg-black bg-opacity-50" />
    </Transition.Child>

    <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
            >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-dark-1 p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-white"
                    >
                        Password Protected Room
                    </Dialog.Title>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        JoinRoom(protectedRoom);
                    }}>
                        <div className="mt-2">
                            <p className="text-sm text-gray-300 mb-5">
                                Please enter the password.
                            </p>

                            <input
                                type="password"
                                className='border p-2'
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="mt-4">
                            <button
                                
                                type="submit"
                                className=' bg-blue-500 text-white py-2 px-2 rounded-lg'
                            >
                                Join
                            </button>
                        </div>
                    </form>
                </Dialog.Panel>
            </Transition.Child>
        </div>
    </div>
</Dialog>
</Transition>

<h2 className='text-2xl text-center my-6 text-green-600 mr-20 mt-10'>Protected Room</h2>
<button onClick={() => navigate("/rooms/create")} className=' bg-blue-500 text-white py-2 px-2 rounded-lg ml-20 '> Create</button>

<div className="flex flex-col h-full mt-4 space-y-2">
                {rooms.map(room => {
                    return <div>
                        {room.name !=="random" && <div key={room.id} className="flex flex-row items-center gap-2 p-2 pr-4 rounded-md hover:bg-zinc-500/5 transition-all duration-200 cursor-pointer"  onClick={() => JoinRoom(room)}>
                           
                        <img src={`https://avatars.dicebear.com/api/initials/${room?.name || "No Name"}.png`} alt="username" className="w-10 h-10 rounded-md" />
                        <div className="flex-shrink-0 flex flex-col">
                            <span className="font-semibold">{room.name}</span>
                            {!room?.owner?.verified ? <span className="text-xs text-gray-400">Created by {room?.owner?.username.split(0, 5) + '...'}</span> : <span className="text-xs text-gray-400 flex flex-row items-center">Created by {room?.owner?.username.split(0, 5)} <FontAwesomeIcon className=" h-3 mx-2" icon={faCheckCircle} /></span> }
                        </div>
                        <div className="flex flex-row justify-end w-full items-center space-x-1">
                            {room.passwordProtected && <FontAwesomeIcon className=" h-3 mx-2" icon={faLock} />}
                            <span className="text-xs text-gray-400 bg-[#18191b] rounded-md p-1">{room.users || 0}/{room.maxUsers}</span>
                        </div>
                    </div>}
                    </div>
                })}
            </div>



   
                </div>
                <div className="col-span-8 md:w-full w-screen">
                <div>
    
      {/* host meeting */}
      <div className='flex flex-col container mx-auto  md:flex-row'>
        <div className='mx-auto p-4 w-full  md:w-1/3'>
          <h2 className=' text-2xl text-center my-6 text-green-600 '>Create Group Meeting</h2>
          <form onSubmit={(e) => { e.preventDefault() }} className=' flex flex-col mx-auto space-y-6 '>
            {
              code &&
              <div type="text" className='border p-2 flex flex-row justify-between' >
                <p className=' w-11/12 overflow-hidden text-white'>{code}</p>
                {
                  !copys ?
                    <svg xmlns="http://www.w3.org/2000/svg" onClick={copy} className="h-6 w-6 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    :
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 bg-slate-100 rounded-xl" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                }

              </div>
            }
            <button className=' bg-blue-500 text-white py-2 rounded-lg ' onClick={call}>Create Meeting</button>
          </form>
        </div>
        {/* join meeting */}
        <div className='mx-auto p-4 w-full  md:w-1/3'>
          <h2 className='text-2xl text-center my-6 text-green-600 '>Join The Meeting</h2>
          <form onSubmit={join} className='flex flex-col mx-auto space-y-6 '>
            <input required={true} type="text" value={name} onChange={namehandle} className='border p-2' placeholder='Enter your Name' />
            <input required value={val} onChange={change} type="text" className='border p-2' placeholder='Enter your code' />
            <button type='submit' className=' bg-blue-500 text-white py-2 rounded-lg'>join Meeting</button>
          </form>

        </div>
      </div>
    </div>
                </div>

                </div>

    </div>
  )
}

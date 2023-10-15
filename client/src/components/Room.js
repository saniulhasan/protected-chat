import React from 'react'
import { useEffect, useState, useRef } from "react";
import { faCheckCircle, faCrown, faLock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { motion, AnimatePresence } from "framer-motion"
import {useNavigate,useParams} from 'react-router-dom';
function Room({socket}) {

    let { id } = useParams();
                  const navigate = useNavigate();
    let [room, setRoom] = useState(null);
    let [members, setMembers] = useState([]);
    console.log(members)
    let [messages, setMessages] = useState([]);
    console.log(messages)
   
    let [typping, setTypping] = useState([]);
    let [istypping, setIstypping] = useState(false);
    let [user, setUser] = useState(null);
    console.log(user)
    let [rooms, setRooms] = useState([]);
    console.log(rooms)
    let [membertyp, setMembertyp] = useState([]);
    useEffect(() => {
        if (socket) {
            socket.off('message').on('message', data => {
                setMessages(messages => [...messages, data]);
            });

            return () => {
                socket.off('message', data => {
                    setMessages(messages => [...messages, data]);
                });
            }
        }
    }, [socket]);

    const ref = useRef();
    useEffect(() => {
      if (ref.current) {
        ref.current.scrollTop = ref.current.scrollHeight;
      }
    }, [messages]);
 
    useEffect(() => {
        if (socket) {
            socket.off('message').on('message', data => {
                setMessages(messages => [...messages, data]);
            });

            return () => {
                socket.off('message', data => {
                    setMessages(messages => [...messages, data]);
                });
            }
        }
    }, [socket]);
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
    }, [id]);
    function typpingu(){
        socket.emit('IsTypping');
    }
    const LeaveRoom = () => {
        socket.emit('leaveRoom');
        socket.on('leaveRoom', data => {
            if (data.success) {
                navigate('/product');
            }
        });
    }
    useEffect(() => {
        if (socket) {
            const fetchRoomListener = data => {
                if (!data.success) navigate('/product');
                setRoom(data.data);
            }
            const roomMembersListener = data => {
                if (!data.success) navigate('/product');
                setMembers(data.data);
            }

            socket.emit('roomMembers');
            socket.on('roomMembers', roomMembersListener);

            socket.emit('fetchRoom');
            socket.on('fetchRoom', fetchRoomListener);

            return () => {
                socket.off('roomMembers', roomMembersListener);
                socket.off('fetchRoom', fetchRoomListener);
            }
        }
    }, [socket, id]);
    

    const dateNow = date => {
        const now = new Date();
        const msgDate = new Date(date);
        if (now - msgDate < 1000 * 60) {
            if (Math.floor((now - msgDate) / 1000) === 1) {
                return Math.floor((now - msgDate) / 1000) + ' seconds ago';
            } else {
                return 'now';
            }
        }
        else if (now.getDate() === msgDate.getDate() && now.getMonth() === msgDate.getMonth() && now.getFullYear() === msgDate.getFullYear()) {
            const diff = now.getTime() - msgDate.getTime();
            const minutes = Math.floor(diff / 1000 / 60);
            return `${minutes} minutes ago`;
        }
        else if (now.getDate() === msgDate.getDate() && now.getMonth() === msgDate.getMonth() && now.getFullYear() === msgDate.getFullYear()) {
            const diff = now.getTime() - msgDate.getTime();
            const hours = Math.floor(diff / 1000 / 60 / 60);
            return `${hours} hours ago`;
        }
        else if (now.getMonth() === msgDate.getMonth() && now.getFullYear() === msgDate.getFullYear()) {
            const diff = now.getTime() - msgDate.getTime();
            const days = Math.floor(diff / 1000 / 60 / 60 / 24);
            return `${days} days ago`;
        }
        else if (now.getFullYear() === msgDate.getFullYear()) {
            const diff = now.getTime() - msgDate.getTime();
            const months = Math.floor(diff / 1000 / 60 / 60 / 24 / 30);
            return `${months} months ago`;
        }
        else {
            const diff = now.getTime() - msgDate.getTime();
            const years = Math.floor(diff / 1000 / 60 / 60 / 24 / 30 / 12);
            return `${years} years ago`;
        }
    }
  return ( <>
    <AnimatePresence>
        <div className="grid grid-cols-12">
            <div className="col-span-9 md:w-full w-screen">
                <div className="border-b border-zinc-500/5 flex items-center justify-between px-6 py-5 text-white">
                    <div className="flex items-center">
                        <img src={`https://avatars.dicebear.com/api/initials/${room?.name || "No Name"}.png`} alt="username" className="w-14 h-14 rounded-full" />
                        <div className="ml-3">
                            <p className="text-lg font-medium flex items-center">{room?.name} {room?.password && <FontAwesomeIcon className=" h-3 mx-2" icon={faLock} />}</p>
                            <p className="text-xs font-medium italic text-gray-500">{members?.length} members</p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <button onClick={LeaveRoom} className="bg-zinc-500/10 hover:bg-zinc-500/20 rounded-full p-2 mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="px-6 py-5 md:max-h-[81vh] max-h-[70vh] overflow-auto" ref={ref}>
                    <div className="flex flex-col space-y-4">
                    <motion.li className="flex flex-col space-y-4" layout initial='initial' animate='animate' exit='exit'> 
                        {messages.filter(Boolean).filter(el => {
                            if (!el.system) {
                                if (el.user) return true;
                                if (el.message && el.message.length > 0) return true;

                                return false;
                            } else return true;
                        }).map((message, index) => {
                            if (message.system) {
                                return <div key={index} className="flex justify-center items-center">
                                    <p className="text-xs text-gray-500">{message.message}</p>
                                </div>
                            } else {
                                if (message.self) {
                                    return <div key={index} className="flex justify-end items-center gap-2">
                                        <div className="flex flex-col items-end">
                                            
                                            {!message.user.verified  ? <p className="text-xs text-gray-500  p-1 mr-1 rounded-lg">{message.user.username}</p> : <p className="text-xs text-gray-500  p-1 mr-1 rounded-lg flex items-center">{message.user.username}<FontAwesomeIcon className=" h-3 mx-1" icon={faCheckCircle} /></p>}
                                            <div className="bg-zinc-500/10 rounded-xl p-3">
                                                <p className="text-sm text-white">{message.message}</p>
                                                <p className="text-xs text-gray-500">{dateNow(message.date)}</p>
                                            </div>
                                   
                                        </div>
                                        <img src={`https://avatars.dicebear.com/api/micah/${message.user?.username || "No Name"}.png`} alt="username" className="w-10 h-10 rounded-full" />
                                    </div> 
                                } else {
                                    return <div key={index} className="flex justify-start items-center gap-2">
                                        <img src={`https://avatars.dicebear.com/api/micah/${message.user?.username || "No Name"}.png`} alt="username" className="w-10 h-10 rounded-full" />
                                        <div className="flex flex-col items-start">
                                        {!message.user.verified ? <p className="text-xs text-gray-500  p-1 mr-1 rounded-lg">{message.user.username}</p> : <p className="text-xs text-gray-500  p-1 mr-1 rounded-lg flex items-center">{message.user.username}<FontAwesomeIcon className=" h-3 mx-1" icon={faCheckCircle} /></p>}
                                            <div className="bg-zinc-500/10 rounded-xl p-3">
                                                <p className="text-sm text-white">{message.message}</p>
                                                <p className="text-xs text-gray-500">{dateNow(message.date)}</p>
                                            </div>
                                        </div>
                                    </div>
                                }
                            }
                        })}
                     </motion.li>

                     <div> {membertyp?.username != user?.username &&
                            <div className="flex flex-row items-center">
                           {istypping && typping?.user.username != user?.username && <img src={`https://avatars.dicebear.com/api/micah/${typping?.user.username || "No Name"}.png`} alt="username" className="w-10 h-10 rounded-full" />}
                            {istypping && typping?.user.username != user?.username && <p className="text-xs text-gray-500 mt-2">{typping?.user.username} is typing...</p>}
                        </div>}
                               </div>
                    </div>
                </div>

                <div className="border-t border-zinc-500/5 bg-[#111214] px-6 py-5 fixed bottom-0 w-full md:max-w-[62.3%]">
                    <form onSubmit={e => {
                        e.preventDefault();
                        const message = e.target.message.value;
                        if (message) {
                            socket.emit('message', { message });
                            e.target.message.value = '';
                        }
                    }}>
                        <div className="flex items-center">
                            <input onChange={() => typpingu()} name="message" type="text" className="bg-zinc-500/10 rounded-md w-full px-4 py-2 text-white outline-none" autoComplete="off" placeholder="Type a message..." />
                            <button type="submit" className="bg-zinc-500/10 hover:bg-zinc-500/20 rounded-md p-2 ml-2 transition-all duration-200">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <div className="col-span-3 border-l border-zinc-500/5 h-screen w-full md:block hidden">
                <div className="overflow-y-auto h-full p-3 space-y-2">
                    {members?.map(member => (
                        <div className="flex items-center justify-between px-6 py-5 text-white bg-zinc-500/5 rounded-lg">
                            <div className="flex items-center w-full">
                                <img src={`https://avatars.dicebear.com/api/micah/${member?.username || "No Name"}.png`} alt="username" className="w-10 h-10 rounded-full" />
                                <div className="ml-3 flex items-center justify-between gap-2 w-full">
                                    <p className="text-sm font-medium flex flex-row items-center">{member?.username} {member?.verified  && <FontAwesomeIcon className=" h-3 mx-1" icon={faCheckCircle} />}</p>
                                    {room?.owner?.username === member?.username && <>
                                        <div className="flex items-center justify-center gap-1">
                                            <p className="text-sm uppercase font-semibold opacity-50"><FontAwesomeIcon className=" h-4 mx-1" icon={faCrown} /></p>
                                        </div>
                                    </>}

                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        </AnimatePresence>
    </>
  )
}

export default Room
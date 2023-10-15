import React, { useEffect, useState } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';

const Chat = ({ socket, userName, roomId }) => {
    useEffect(() => {
        socket.on('receive_message', (data) => {
            setMessageList((list)=>[...list,data]);
        })
    }, [socket])
    const [message, setMessage] = useState("");
    const [messageList,setMessageList]=useState([])
    const handleSendMessage = async () => {
        if (message !== "") {
            const messageInfo = {
                userName: userName,
                roomId: roomId,
                message: message,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
            }
            await socket.emit('send_message', messageInfo)
            setMessageList((list)=>[...list,messageInfo]);
            setMessage("")
            
        }
    }


    return (
        <div>
            <div className='chat-section'>
                <div className='chat-header'>
                    <p>live Chat</p>
                </div>
                <div className='chat-body'>
                    <ScrollToBottom className='scroll-bar'>
                    {
                        messageList?.map((messageContent,index)=>{
                        return <div  
                        key={index} 
                        className='message'
                        id={`${userName === messageContent.userName? 'mySelf':'another'}`}>
                            <div>
                            <div className='message-content'>
                            <p>{messageContent.message}</p>
                            </div>
                            <div className='message-meta'>
                                <p>{messageContent.time}</p>
                                <p className='author'>{messageContent.userName}</p>
                            </div>
                            </div>
                        </div>

                        })
                    }
                    </ScrollToBottom>
                </div>
                <div className='chat-footer'>
                    <input
                        type="text"
                        placeholder='hey...'
                        value={message}
                        onChange={(event) => setMessage(event.target.value)}
                        onKeyPress={(event) => {
                            event.key === "Enter" && handleSendMessage();
                          }}
                    />
                    <button onClick={handleSendMessage}> send </button>
                </div>
            </div>

        </div>
    );
};

export default Chat;
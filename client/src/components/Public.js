import React, { useState, useEffect } from 'react';

import io from 'socket.io-client';

const socket = io('http://localhost:5000');

function Public() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');
  const [userList, setUserList] = useState([]);
   console.log(userList)
  useEffect(() => {
    socket.on('messagelist', (message) => {
      setMessages([...messages, message]);
    });

    socket.on('userList', (users) => {
      setUserList(users);
    });

    return () => {
      socket.off('messagelist');
      socket.off('userList');
    };
  }, [messages]);

  const sendMessage = () => {
    if (message) {
      socket.emit('messagelist', message);
      setMessage('');
    }
  };

  const setUser = () => {
    if (username) {
      socket.emit('setUsername', username);
    }
  };

  return (
    <div className="App">
      <h1>Simple Chat App</h1>
      <div className="chat-container">
        <div className="user-list">
          <h2>Users Online:</h2>
          <ul>
            {userList.map((user, index) => (
              <li key={index}>{user}</li>
            ))}
          </ul>
        </div>
        <div className="message-list">
          {messages.map((msg, index) => (
            <div key={index} className="message">
              {msg}
            </div>
          ))}
        </div>
        <div className="username-form">
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={setUser} className="m-2 w-full rounded-md px-4 py-2  text-gray-300 bg-zinc-500/10 hover:bg-zinc-500/20 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-opacity-50 transition-all duration-200 flex flex-row items-center justify-center">Set Username</button>
        </div>
        <div className="message-input">
          <input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}
export default Public;


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Product from './components/Product';
import About from './components/About';
import Room from './components/Room';

import {io} from 'socket.io-client';
import Create from './components/Create';
import Meet from './components/Meet';
import Public from './components/Public';

const socket = io.connect('http://localhost:8000');

const App = () => {
 return (
    <>
       <Router>
   <Routes>
          <Route path="/" element={<Home  socket={socket}/>} />
          <Route path="/product" element={<Product socket={socket}/>} />
          <Route path="/about" element={<About socket={socket}/>} />
          <Route path="/rooms/:id" element={<Room  socket={socket}/>} />
          <Route path="/:name/:room" element={<Meet socket={socket}/>} />
          <Route path="/rooms/create" element={<Create socket={socket}/>} />
          <Route path="/public" element={<Public socket={socket}/>} />
         
          </Routes>
  </Router>
    </>
 );
};

export default App;
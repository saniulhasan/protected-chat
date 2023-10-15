const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors')
app.use(cors())
const expressServer = http.createServer(app);
const Port = process.env.PORT || 8000;
const { Server } = require("socket.io");


const io = new Server(expressServer, {
  cors: {
    
  }

});

app.get('/', (req, res) => {
  res.send('<h1>Live Chat server is running..ok..</h1>');
});




const parties = []



io.on('connection', (socket) => {
  console.log('a user connected');
  socket.join('global');
  socket.on("login", async (data) => {
    console.log(data)
    const { username } = data;

   

    const allSockets = await io.fetchSockets();
    const userSockets = allSockets.filter((s) => s?.data?.user?.username === username);


    if (userSockets.length > 0) return socket.emit("login", { error: "Username already taken"});


    var user = {
      username,
    };

    if(username == "Aaron"){
       user = {
        username,
        verified: true,
      };
    }else{
      user = {
        username
      };
    }



    socket.data.user = user;
    socket.emit("login", {
      success: true,
      data: user
    });
  });

  socket.on("fetchUser", () => {
    const user = socket.data.user;
    if (user) {
      socket.emit("user", user);
    } else {
      socket.emit("user", null);
    }
  })


  socket.on("fetchRooms", () => {
    setInterval(async () => {
      const rooms = io.sockets.adapter.rooms;
      const allRooms = (await Promise.all(Object.keys(rooms).map(async (room) => {
        const sockets = await io.in(room).fetchSockets();
        const users = sockets.map((s) => s.data.user);
        return {
          id: room,
          name: rooms[room]?.name,
          owner: rooms[room]?.owner,
          passwordProtected: rooms[room]?.password ? true : false,
          maxUsers: rooms[room]?.maxUsers,
          users: users.length
        };
      }))).filter((r) => r.name !== 'global');
      socket.emit("rooms", {
        isLogged: socket.data?.user !== undefined ? true : false,
        user: socket.data?.user,
        rooms: allRooms
      });

      const allSockets = await io.fetchSockets();
      const users = allSockets.filter((s) => s?.data?.user?.username);
      const usersonline = users.length;
      
      socket.emit("UsersOnline", { success: true, users: usersonline });
    }, 1000);
  });
  socket.on("UsersOnline", async () => {
    socket.emit("UsersOnline", { success: true });
  });



  
  socket.on("createRoom", data => {
    
    const { name, password, maxUsers } = data;
     console.log(name,password)
    if (!name) return socket.emit("createRoom", { success: false, error: "Name is required" });
    if (io.sockets.adapter.rooms[name]) return socket.emit("createRoom", { success: false, error: "Room already exists" });
    let room = {
      id: Math.random().toString(36).substring(2, 9),
      name: name.replace(/[^a-zA-Z0-9 ]/g, ""),
      owner: socket.data.user,
      users: 1,
      maxUsers: maxUsers,
    };

    if (password) room.password = password;


    io.sockets.adapter.rooms[room.id] = room;

    socket.rooms.forEach((user_room) => {
      socket.leave(user_room);
      updateMembers(user_room);
      socket.to(user_room).emit("message", {
        system: true,
        message: `${socket.data.user.username} left the room`
      });
    });
    socket.join(room.id);
    socket.emit("createRoom", { success: true, data: room });
  })

  socket.on("joinRoom", async data => {
    const { id, password } = data;
    if (!id) return socket.emit("joinRoom", { success: false, error: "Room id is required" });
    if (!io.sockets.adapter.rooms[id]) return socket.emit("joinRoom", { success: false, error: "Room not found" });

    const room = io.sockets.adapter.rooms[id];
    if (room.password && room.password !== password) return socket.emit("joinRoom", { success: false, error: "Wrong password" });
    const sockets = await io.in(id).fetchSockets();
    if (sockets.length >= room.maxUsers) return socket.emit("joinRoom", { success: false, error: "Room is full" });
    if (sockets.find((s) => s.data.user.username === socket.data.user.username)) return socket.emit("joinRoom", { success: false, alreadyIn: true, error: "You are already in this room" });

    socket.rooms.forEach((user_room) => {
      socket.leave(user_room);
      updateMembers(user_room);
      socket.to(user_room).emit("message", {
        system: true,
        message: `${socket.data.user.username} left the room`
      });
    });

    socket.join(id);

    updateMembers(id);
    socket.emit("joinRoom", { success: true, data: room });
    socket.to(id).emit("message", {
      system: true,
      message: `${socket.data.user.username} joined the room`
    });
  });

  socket.on("leaveRoom", async () => {
    const room = Array.from(socket.rooms).find(room => room !== socket.id);
    if (!room) return socket.emit("leaveRoom", { success: false, error: "You are not in a room" });
    socket.leaveAll();
    socket.join("global");
    socket.emit("leaveRoom", { success: true });

    updateMembers(room);
    socket.to(room).emit("message", {
      system: true,
      message: `${socket.data.user.username} left the room`
    });
  });
  socket.on("ClearMessages", async () => {
    socket.emit("ClearMessages", { success: true });
  });

  socket.on("IsTypping", async () => {
    const room = Array.from(socket.rooms).find(room => room !== socket.id);
    socket.to(room).emit("IsTypping", {
      success: true,
      user: socket.data.user,
    });
    
  });

  socket.on("roomMembers", async () => {
    const room = Array.from(socket.rooms).find(room => room !== socket.id);
    if (!room) return socket.emit("roomMembers", { success: false, error: "You are not in a room" });

    updateMembers(room);
  });

  function updateMembers(room) {
    io.in(room).fetchSockets().then(sockets => {
      const members = sockets.map(socket => socket.data.user);
      if (members.length > 0) {
        io.in(room).emit("roomMembers", { success: true, data: members });
      } else {
        delete io.sockets.adapter.rooms[room];
      }
    });
  }

  socket.on("message", async data => {
    const room = Array.from(socket.rooms).find(room => room !== socket.id);
    if (!room) return;

    const message = {
      user: socket.data.user,
      message: data.message,
      date: new Date()
    };
    console.log(message)
    const sockets = await io.in(room).fetchSockets();
    sockets.forEach(s => {
      s.emit("message", {
        ...message,
        self: s.id === socket.id
      });
    });
  });

  socket.on("fetchRoom", async () => {
    const room = Array.from(socket.rooms).find(room => room !== socket.id);
    if (!room) return socket.emit("fetchRoom", { success: false, error: "You are not in a room" });

    socket.emit("fetchRoom", { success: true, data: io.sockets.adapter.rooms[room] });
  });

  // join a room
 
  socket.on('me', async (data) => {
   
    socket.emit('getid', data)
  })


  // on user join the meething room
  socket.on('join', async(room, id, name) => {
   console.log(room);
   console.log(id);
   console.log(name);


    if (!parties.includes(id)) {
      parties.push({ id, name })
    }
    
    // for chacking how many users are there in meeting
    const size = io.sockets.adapter.rooms.get(room).size
  

    // sending the user id to other users to make the call
    socket.broadcast.to(room).emit('user-connect', id, size, name)
    
    // tell the name to other
    socket.on('tellname', (name, id) => {
      socket.broadcast.to(room).emit('addname', name, id)
    })


    // disconnect event
    socket.on('disconnect',async () => {
      const index = parties.findIndex((peer) => peer.id = id)
      if (index > -1) { // only splice array when item is found
        parties.splice(index, 1); // 2nd parameter means remove one item only
      }
      socket.broadcast.to(room).emit("user-disconnected", id)
    }) 
  })

  
  // user leave the meeting
  socket.on('user-left',async(id, room) => {
      socket.leave(room)
      socket.disconnect()
      socket.broadcast.to(room).emit('user-disconnected',id)
  })

 
  

  

  
  
  

});

expressServer.listen(Port, () => {
  console.log(`listening on @ ${Port}`);
});
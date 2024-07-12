const { createServer } = require('http');
const { Server } = require('socket.io');
const app = require('express')();
const cors = require('cors');
app.use(cors( ));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: "https://diasemterapia.com.br/talk",
        methods: ["GET", "POST"]
    }
});

const users = [];
const messages = [];

io.on('connection', (socket) => {
    console.log(`a user connected ${socket.id}`);

    socket.on('select_room', (data, callback)=>{
        console.log({data});

        socket.join(data.room);

        const usersInRoom = users.find(user=>user.userName === data.userName && user.room === data.room);

        if(usersInRoom) {
            usersInRoom.id == socket.id;
        } else {
            users.push({
                id: socket.id,
                userName: data.userName,
                room: data.room
            });
        }

        const messagesRoom = getMessagesInRoom(data.room);

        callback(messagesRoom)
    });


    socket.on('message', data=>{
        console.log(data);

        const message = {
            userName: data.userName,
            text: data.text,
            room: data.room
        };

        messages.push(message);

        io.to(data.room).emit('message', message);
        
    })
});

function getMessagesInRoom (room) {
    const messagesInRoom = messages.filter(message=>message.room == room);
    console.log(messagesInRoom)
    return messagesInRoom;
}


server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});

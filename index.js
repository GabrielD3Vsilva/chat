const { createServer } = require('http');
const { Server } = require('socket.io');
const app = require('express')();
const cors = require('cors');
const db = require('./db');
app.use(cors( ));

app.use(cors({
    origin: "https://diasemterapia.com.br",
    methods: ["GET", "POST"]
}));


const server = createServer(app);


const io = new Server(server, {
    cors: {
        origin: "https://diasemterapia.com.br",
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
            usersInRoom.id = socket.id;
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


    socket.on('message', async (data)=>{
        console.log(data);

        const message = {
            userName: data.userName,
            text: data.text,
            room: data.room
        };

        messages.push(message);

        const adm = await db.User.find();

        for (let i = 0; i < adm.length; i++) {
            if (adm[i].isAdm == true) {
                await db.User.updateOne({ _id: adm[i].id }, { $push: { Messages:  message} });
            }}

        io.to(data.room).emit('message', message);
        
    })
});

function getMessagesInRoom (room) {
    const messagesInRoom = messages.filter(message=>message.room == room);
    console.log(messagesInRoom)
    return messagesInRoom;
}


server.listen(8080, () => {
    console.log('server running at http://localhost:3001');
});

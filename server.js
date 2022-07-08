const express = require ('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();





// ---------------- Setting socket.io -----------------
const http = require('http').Server(app);
const io = require('socket.io')(http)
// ---------------- Setting socket.io -----------------



// ----------------- Creating Model and Schema -----------------
const Message = mongoose.model("Message", { // here second parameter is a schema
    name:String,
    msg:String
});
// ----------------- Creating Model and Schema -----------------

// const messages = [
//     {name:"Ashma", msg:"Hi"},
//     {name:"Anusha", msg:"Hello"}
// ]

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false})) //browser bata aako data lai encode garna

app.get('/messages',(req, resp)=>{
    Message.find({}, (err, messages) =>{
        resp.send(messages);
    })
});


app.post('/messages', (req,resp)=>{
    // console.log(req.body);
    var message = new Message(req.body);
    console.log(req.body);

    message.save((err)=>{
        if(err)
            sendStatus(500);

        io.emit('msg', req.body); // refresh each time
        resp.sendStatus(200); // OK status
    });
    
})

// ----------- Establishing socket io connection ----------------
io.on('connection', (socket) =>{
    console.log("User connected");
})
// ----------- Establishing socket io connection ----------------


mongoose.connect("mongodb+srv://user:user@ecommerce.o7mlc.mongodb.net/?retryWrites=true&w=majority", (err)=>{
    console.log("mongo db connection", err);
})

http.listen(3000);
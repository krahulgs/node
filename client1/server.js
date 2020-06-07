const express = require('express');
const redis = require('redis');

const subscriber = redis.createClient();

const app = express();
var Message;

subscriber.on("message",(channel,message)=>{
    console.log("received data "+ message);
    Message=message;
})

subscriber.subscribe('user-notify');

app.get('/',(req,res) => {
    res.send(Message);
})

app.listen(3001,() => {

    console.log("server is listening to port 3006");
})
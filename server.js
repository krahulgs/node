const express=require('express');
const redis = require('redis');

const publisher = redis.createClient()

const app=express();

app.get('/',(rea,res)=>{
    const user={
        id:'12345',
        name:"Rahul K",
        address:"hyderabad"
    }
    publisher.publish('user-notify',JSON.stringify(user))
    res.send('publishing an event to Redis');


})

app.listen(3000,()=>{
    console.log('app is listening at port 3000');
})
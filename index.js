const express= require('express');
const fetch= require('node-fetch');
const redis= require('redis');
const port=process.env.port || 5000;
const redisport=process.env.port || 6379;

const client= redis.createClient(redisport);

client.on('connect', function(){
    console.log('redis client is connected');
});

const app=express();
async function getRes(req,res,next){
    try{
        
        console.log('fetching data');
        const { username }=req.params;
        
        const response=await fetch(`https://api.github.com/users/${username}`)
        const data=await response.json();

        const repos=data.public_repos;
        //set data to redis
        client.setex(username, 3600, repos);

        res.send(setResponse(username,repos))


        //res.send(data);


    }
    catch(err){
        console.error(err);
        res.status(500);
    }
    
}
function setResponse(username, repos){
    return `<h2>${username} has ${repos} GitHub Repos</h2>`;
}
function cache(req,res,next){
    const{username}=req.params;

    client.get(username,(err,data)=>{
        if(err) throw err;
        if(data !=null){
            console.log(data);
            res.send(setResponse(username, data));
        }
        else{
            next();
        }
    })
}
app.get('/repos/:username',cache,getRes);


app.listen(5000,()=>{
    console.log(`app listening at port ${port}`)
});

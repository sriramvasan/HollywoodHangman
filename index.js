const express = require('express');
const Datastore =  require('nedb');
const fs = require("fs");
const { request, response } = require('express');

const text = fs.readFileSync("./movielist.txt").toString("utf-8");
var textbyline = text.split("\n"); 

const app = express();

const port = process.env.PORT ||  5000;
app.listen(port,()=>console.log('Server started'));

app.use(express.static('public'));
app.use(express.json({limit :'1mb'}));

const database =new Datastore('Scoresdatabase.db');
database.loadDatabase();

app.get('/movielist',(request,response)=>
{
    response.json({data: textbyline});
});



app.get('/gamescore',(request , response)=> {

    database.find({Score : 100}).limit(1).exec( 
    function (err,data){
        if(err)
        {
            response.end();
            console.log("error in sending gamescores back");
            return;
        }
        response.json(data);
    });
    //response.json({ text : 123});
});

app.get('/leadershipboard',(request,response)=>{
    database.find({}).sort({Score:-1 , Name:-1}).exec(
        function(err,data)
        {
            response.json(data);
        }
    )
});



app.post('/gamescore',(request,response)=>{
    //console.log("I got a request");
    //console.log(request.body);
    const data = request.body;
    //console.log("From the file",textbyline);
    const timestamp = Date.now();
    data.timestamp = timestamp;
    database.insert(data)
    response.json({
    status : "success",
    Playername: data.Name,
    GameStatus: data.Status,
    Score: data.Score,
    Timestamp : data.timestamp
});
});

 
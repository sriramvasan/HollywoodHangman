//const name = getElementById("playername").value;

//const { response } = require("express");


var alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h',
'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's',
't', 'u', 'v', 'w', 'x', 'y', 'z'];
//src="Hangman.png"
var word;
var guess;
var guesses;
var lives;
var counter;
var space;
var playername;
var showLives;
var showPlayer;
var guessbox;
var resetbtn;
var guessbutton;
var breakline;
//word = "thereverend";
var gameresult = "Game Incomplete";
var gamestats = [] 
var gamedata = 
{
    "Name":"",
    "Status":"",
    "Score":""
}
var jsondata;
/*"Playername": "",
"Result":"",
"TotalMoves":""
};*/
var gamescores ={"Players":[]};

var gamestatus =0;
var guessed = [];
var movielist = [];
var maxscore ;

playername = document.getElementById("playername").value
showLives = document.getElementById("mylives")
showPlayer = document.getElementById("myplayer")
showTry = document.getElementById("try");
guessbox = document.createElement('input');
guessbutton = document.createElement('button');
resetbtn = document.createElement('button');
breakline = document.createElement('br');

guessbutton.className="btn-info";
resetbtn.className="btn-info"

guesses = [];
lives =9;
var gamemoves = 0;
counter =0;
space = 0;




guessbutton.innerText = "Guess";
resetbtn.innerHTML = "Reset";

resetbtn.onclick = () => {
    toggleDiv("game");
    reset();
}

guessbutton.onclick =()=> 
{
    
    check();
}

function check ()
{

    guess = guessbox.value;
    //checking already entered correct values
    for (var i=0;i<=guessed.length;i++)
    {if(guessed[i] === guess )
        {return;}
    }

    //checking for the entire word entered
    if(guess.length >1 & guess.length !=word.length)
    {    window.alert("Enter only one alphabet")
        return;
    }
    guessbox.value = "";
    if(guess.length === word.length){
        if(guess === word)
        {
            lives =9;
            gamemoves =0;
            gameresult = "Won"
            for (var i =0;i<guess.length;i++ )
            {guesses[i].innerHTML = guess[i];}
            showLives.innerHTML = "Game Won";
            getstats();
            gamestatus =1;
            getgamescores();
            return;
        }
        else {
            lives =9;
            gamemoves =100;
            gameresult = "Lost"
            showLives.innerHTML = "Game Over";
            getstats();
            gamestatus =1;
            getgamescores();
            return;
        }
    }
    
    for( var i =0;i<word.length ;i++)
    {
        if(word[i] === guess)
        {
            guesses[i].innerHTML = guess;
            guessed.push(guess);
            counter +=1;
        }
    }
    var j = (word.indexOf(guess));
    if(j=== -1){
        lives -= 1;
        gamemoves +=1;
    }
    showLives.innerHTML = "You have " +lives + " lives left";
    if(lives <1)
    {
        showLives.innerHTML = "Game Over";
        lives=9;
        gamemoves=100;
        gameresult = "Lost";

        gamestatus = 1;
        getstats();  

    }
    
        if(counter + space === guesses.length)
        {
            showLives.innerHTML = "You Win"
            gameresult = "Won";
            getstats();
            gamestatus =1;
        }
   
    getgamescores();
}

function setgamedata(){
    gamedata.Name = playername;
    gamedata.Status = gameresult;
    gamedata.Score = 100 - (gamemoves+(9-lives));

}



async function getgamescores()
{
    if(gamestatus === 1 )
    {
        gamescores.Players.push(gamestats);
        setgamedata();
        loadwinners();
        
        await sleep(500);
        
        var status = await compare(maxscore,gamedata.Score);
        if( status )
        {
            //window.alert("Congrats You got the max score");
            if( window.confirm("Congratulations on maximum score!!!\nDo you want to see the leadership board ??"))
            {
                window.location.href = "leaderboard.html";
            }
            else{
                window.location.href="index.html";
            }
    }

        sleep(500);
        posttoserver();
        reset();
        return;
    }
}

async function compare(x,y)
{
    if(x===y)
    {
        return true;
    }
    else return false;
}


async function handleSubmit()
{
    gamemoves = gamemoves +1;
    await sleep(200);
    await choosemovie();
    console.log(word);
    playername = document.getElementById("playername").value
    if((playername === null) ||(playername === "")||(playername === " "))
    {   
        window.alert("Must enter a name");
        return;
    }
    toggleDiv("game")
    playername = document.getElementById("playername").value
    showLives.innerHTML = "You have " +lives + " lives left";
    showPlayer.innerHTML = playername;
    await sleep(200);
    render();
}

function toggleDiv(id) {
    var div = document.getElementById(id);
    div.style.display = div.style.display == "none" ? "block" : "none";
    var dive = document.getElementById("login");
    dive.style.display = "none";
}

function render()
{
    wordHolder = document.getElementById("hold");
    correct = document.createElement('ul');
    for (var i=0;i<word.length ;i++)
    {
        guess =document.createElement('li');
        if(word[i] ==="-")
        {
            guess.innerHTML = "-";
            space = 1;
        }
        else 
        {
            guess.innerHTML = "_";
        }
        guesses.push(guess);
        wordHolder.appendChild(correct);
        correct.appendChild(guess);
    }
    
    
    showTry.appendChild(guessbox);
    showTry.appendChild(breakline);
    showTry.appendChild(guessbutton);
    showTry.appendChild(resetbtn);
}



function reset()
{
    var div = document.getElementById("game");
    div.style.display = "none";
    var dive = document.getElementById("login");
    dive.style.display = "block";
    wordHolder = document.getElementById("hold");
    wordHolder.innerHTML="";
    guessbox.value = "";
    document.getElementById('playername').value =" ";
    
    gameresult = "Incomplete";
    gamestats = [];
    gamedata = 
    {
        "Name":"",
        "Status":"",
        "Score":""
    }
    guessed = [];
    /*
    { "Playername": "",
    "Result":"",
    "TotalMoves":""
    };*/

    
    gamestatus =0;
    guesses = [];
    lives =9;
    gamemoves =0;
    counter =0;
    space = 0;


}

function getstats()
{
    gamestats[0] = playername;
    gamestats[1] = gameresult;
    gamestats[2] = gamemoves;
    setgamedata();
}

function posttoserver()
{
    //const data =  gamescores;
    const data= gamedata;
    const options = 
    {
        method: 'POST',
        headers: 
        {
            "Content-Type" : "application/json"  
        },
        body: JSON.stringify(data)
    }
    fetch('/gamescore',options)
    .then(response => response.json())
    .then(response => 
        { 
        
        });
    
}

function loadwinners(){
fetch('/gamescore')
.then(response => response.json())
.then(response => {
    maxscore = response[0].Score;
})
}


async function getmovies(){

    const response = await fetch('/movielist');
    const data = await response.json();
    movielist = data.data;

}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


async function choosemovie()
{
    await getmovies();
    var randomnumber = Math.floor(Math.random()*movielist.length)
    word = movielist[randomnumber];
}

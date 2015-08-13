// the Game object used by the phaser.io library
var stateActions = { preload: preload, create: create, update: update };


// Phaser parameters:
// - game width
// - game height
// - renderer (go for Phaser.AUTO)
// - element where the game will be drawn ('game')
// - actions on the game state (or null for nothing)
var game = new Phaser.Game(750, 400, Phaser.AUTO, 'game', stateActions);

var score = -2;
var labelScore;
var player;
var pipes=[];

jQuery("#greeting-form").on("submit", function(event_details){
    var greeting="Hello ";
    var name =jQuery("#Nickname").val();
    var greeting_message=greeting+name;
    jQuery("#greeting-form").hide();
    jQuery("#greeting").append("<p>"+greeting_message+"</p>");
});

function preload() {
    game.load.image("player", "../assets/hawkeye.png");
    game.load.image("backgroundImg", "../assets/flockofBirds.jpg");
    game.load.audio("score","../assets/point.ogg");
    game.load.image("pipe","../assets/pipe_blue.png");
}

/*
 * Initialises the game. This function is only called once.
 */

function create() {
    var background = game.add.image(0, 0, "backgroundImg");
        background.width = 750;
        background.height = 400;
    player =  game.add.sprite(40,180, "player");
        player.width = 65;
        player.height = 70;
    player.anchor.setTo(0.5,0.5);
    game.physics.arcade.enable(player);
    game.input
        .keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        .onDown.add(spaceHandler);
    labelScore = game.add.text(20, 20, "0");
    generatePipe () ;
    game.physics.startSystem(Phaser.Physics.ARCADE);
    player.body.velocity.y=-100;
    player.rotation= Math.atan(player.body.velocity.y / 200);
    player.body.gravity.y=250;
    game.input.keyboard
        .addKey(Phaser.Keyboard.SPACEBAR)
        .onDown.add(playerJump);
    pipeInterval=1.75;
    game.time.events
        .loop(pipeInterval* Phaser.Timer.SECOND,
    generatePipe);
}

/*
 * This function updates the scene. It is called for every new frame.
 */
function update() {
    for (var index = 0; index < pipes.length; index++) {
        game.physics.arcade
            .overlap(player,
            pipes[index],
            gameOver);

    }

    if (player.body.y < 0) {
        gameOver();
    }

    if (player.body.y> 400) {
        gameOver();
    }


}

function gameOver(){

    game.destroy();
    $("#score").val(score.toString());
    $("#greeting").show();
}

function spaceHandler(event) {
   // game.sound.play("score");
}

function addPipeBlock(x,y){
    var block = game.add.sprite(x,y,"pipe");
    block.width= 50
    block.height=42
pipes.push(block);
    game.physics.arcade.enable(block);
    block.body.velocity.x=-200;
}

function generatePipe() {
    var gap = game.rnd.integerInRange(1, 5);
    for (var count = 0; count < 8; count ++) {
        if (count != gap && count != gap + 1 && count != gap +2) {
            addPipeBlock(750,count*50);
        }
    }
    changeScore();
}

function changeScore() {
    score++;
    labelScore.setText(score.toString());
}

function playerJump(){
    player.body.velocity.y=-150
    ;
}
$.get("/score", function(scores){
    console.log("Data: ",Scores);
});


$.get("/score", function (scores) {
    scores.sort(function (scoreA, scoreB) {
        var difference = scoreB.score - scoreA.score;
        return difference;
    });
    for (var i = 0; i < 3 ; i++) {
        $("#scoreBoard").append(
            "<li>" +
            scores[i].Nickname + ":" + scores[i].score +
            "</li>");
    }
});


// Variables
var isGameOver = false,
    lives = 3,
    monsters = [],
    myBackground,
    pause = true,
    playerShip,
    score = 0;
    shot = [];

// Start of game image declarations
function startGame() {
  // Player ship
  playerShip = new component(40, 40, 'images/spacecraft_white.png', 10, 180, "image");
  // Player laser
  laser = new component(15, 5, 'rgba(64, 255, 0, .7)', 50, 197, "pewpew");
  // background
  myBackground = new component(600, 400, "images/space3.jpg", 0, 0, "background");
  // fire up the game
  gameArea.start();
}

// Game area
var gameArea = {
  // Dynamically create canvas
  canvas : document.createElement("canvas"),
  start : function() {
    this.canvas.width = 600;
    this.canvas.height = 400;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    // frame tally
    this.frameNo = 0;
    this.interval = setInterval(updateGameArea, 20);
    // Event listener for keypress
    window.addEventListener('keydown', function (e) {
      gameArea.key = e.keyCode;
    })
    // Event listener for key up
    window.addEventListener('keyup', function (e) {
      gameArea.key = false;
    })
  },
  clear : function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  stop : function() {
    clearInterval(this.interval);
  }
}

// Component function for images,shapes and text drawn
function component(width, height, color, x, y, type) {
  this.type = type;
  // If the component is labelled image or background
  if(type == "image" || type == "background") {
    this.image = new Image();
    this.image.src = color;
  }
  this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0;
  this.x = x;
  this.y = y;
  // Update function
  this.update = function() {
    ctx = gameArea.context;
    // If component image or background
    if(type == "image" || type == "background") {
      ctx.drawImage(this.image,
                    this.x,
                    this.y,
                    this.width,
                    this.height);
      if(type == "background") {
        ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
      }
    } else if(type == "text") { // If component labeled text
      ctx.font = "16px Arial";
      ctx.fillStyle = "white";
      ctx.fillText(width + height, x, y);
    } else {
      ctx.fillStyle = color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }
  // Update component
  this.newPos = function() {
    this.x += this.speedX;
    this.y += this.speedY;
    // For moving background
    if(this.type == "background") {
      if(this.x == -(this.width)) {
        this.x = 0;
      }
    }
  }
  // crashWith function to detect collision with another object
  this.crashWith = function(otherobj) {
    var myleft = this.x;
    var myright = this.x + (this.width);
    var mytop = this.y;
    var mybottom = this.y + (this.height);
    var otherleft = otherobj.x;
    var otherright = otherobj.x + (otherobj.width);
    var othertop = otherobj.y;
    var otherbottom = otherobj.y + (otherobj.height);
    var crash = true;
    if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft || myleft > otherright)) {
      crash = false;
    }
    return crash;
  }
}

// Function to shoot laser
function shootLaser(x,y) {
	shot.push(new component(15, 5, "rgba(64, 255, 0, .7)", laser.x, laser.y));
  let laserSFX = new Audio('sounds/audio_laser-sfx.m4a');
  laserSFX.play();
  for(i = 0; i < shot.length; i++) {
  	shot[i].speedX +=1;
   }
}

// Function to load the enemy
function loadEnemy() {
  var x, y;
  x = gameArea.canvas.width;
  y = Math.floor(Math.random() * (gameArea.canvas.height - 30));
  monsters.push(new component(60, 50, "images/monster.png", x, y, "image"));
  for(i = 0; i < monsters.length; i++) {
    monsters[i].speedX += -1;
  }
}

// Function to draw the score
function drawScore() {
  var theScore = new component("Score: ", score, "white", 8, 20, "text");
  theScore.newPos();
  theScore.update();
}

// Function to draw lives left
function drawLives() {
  var theLives = new component("Lives: ", lives, "white", ctx.canvas.width-65, 20, "text");
  theLives.newPos();
  theLives.update();
}

function drawLifeLost() {
  var lifeLost = new component("Life Lost: ", "Press C to continue", "white", ctx.canvas.width/2 - 40, ctx.canvas.height/2, "text");
  lifeLost.newPos();
  lifelost.update();
}

// Function to draw game over
function drawGameOver() {
  var gameOver = new component("Game Over", "!", "white", ctx.canvas.width/2 - 20, ctx.canvas.height/2, "text");
  gameOver.newPos();
  gameOver.update();
}

// Game loop
function updateGameArea() {

  gameArea.clear();
  // Increment frameNo
  gameArea.frameNo += 1;
  // Load an enemy based on frameNo
  if(!isGameOver && !pause) {
    if(gameArea.frameNo == 1 || everyinterval(150)) {
      loadEnemy();
    }
  }

  //background speed
  myBackground.speedX = -2;
  myBackground.newPos();
  myBackground.update();
  // Move left
  if(gameArea.key && gameArea.key == 37) {
    playerShip.speedX = -1;
    laser.speedX = -1;
  }
  // Move up
  if(gameArea.key && gameArea.key == 38) {
    playerShip.speedY = -1;
    laser.speedY = -1;
  }
  // Move down
  if(gameArea.key && gameArea.key == 39) {
    playerShip.speedX = 1;
    laser.speedX = 1;
  }
  // Move right
  if(gameArea.key && gameArea.key == 40) {
    playerShip.speedY = 1;
    laser.speedY = 1;
  }
  // Lasers away!
  if(gameArea.key && gameArea.key == 32 || (gameArea.key == 32 && game.Area.key == 38)) {
    shootLaser(laser.x, laser.y);
  }

  // Begin game and unpause
  if(gameArea.key && gameArea.key == 67) {
    if(isGameOver) {
      isGameOver = false;
      startGame();
    }

    pause = false;
  }

  // If no input, clear everything
  if(!gameArea.key) {
    playerShip.speedX = 0;
    playerShip.speedY = 0;
    laser.speedX = 0;
    laser.speedY = 0;
  }
  // Draw score
  drawScore();
  //Draw lives
  drawLives();
  // Update playerShip
  playerShip.newPos();
  playerShip.update();
  // Update laser cannon
  laser.newPos();
  laser.update();
  // Update shot laser
  for(j = 0; j < shot.length; j++) {
    if(shot[j] != null) {
      shot[j].speedX += 1;
      shot[j].newPos();
      shot[j].update();
    }
    // Check if we shot a bad guy
    for(h = 0; h < monsters.length; h++) {
      // Do this if we shot one
      if(shot[j].crashWith(monsters[h])) {
        // Update score
        score += 5;
        // The monster roars when shot!
        let monsterSFX = new Audio('sounds/monster.m4a');
        monsterSFX.play();
        // Remove the shot laser
        shot.splice(j, 1);
        // Pulverize monster
        monsters[h] = new component(monsters[h].width, monsters[h].height, "images/explode.png", monsters[h].x, monsters[h].y, "image");
        monsters[h].update();
        // remove monster
        monsters.splice(h, 1)
        break;
      }
    }
  }
  // Loop to check if monster crash with ship
  for(i = 0; i < monsters.length; i++) {
    if(playerShip.crashWith(monsters[i])) {
      // Lose a life for crashing into monster
      if(lives == 1) {
        lives -= 1;
        lives.update();
        // Lives are zero, game over
        isGameOver = true;
        drawGameOver();
      } else {
        // Decrement lives
        lives -= 1;
        // Remove monster since you ran it over
        monsters.splice(i, 1);
      }
    }
    // remove monster if ran off the board
    if(monsters[i].x == 0) {
      monsters.splice(i, 1);
      if(lives == 1) {
        lives -= 1;
        lives.update();
        isGameOver = true;
        drawGameOver();
      } else {
        lives -= 1;
      }
    }
    // Update monster position
    monsters[i].speedX = -1;
    monsters[i].newPos();
    monsters[i].update();
  }
}
// Helper function for loading enemies on board
function everyinterval(n) {
  if((gameArea.frameNo / n) % 2 == 0) {return true;}
  return false;
}

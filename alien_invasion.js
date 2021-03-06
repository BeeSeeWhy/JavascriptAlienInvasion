// Variables
var aliens = [],
    backgroundMusic,
    isGameOver = false,
    level = 1,
    drawLevelUp = false,
    lives = 3,
    mute = false,
    myBackground,
    pause = true,
    playerShip,
    score = 0,
    shot = [],
    startBool = true,
    warp = false;

// Start of game image declarations
function startGame() {
  // Player ship
  playerShip = new component(40, 40, 'images/spacecraft_white.png', 10, 180, "image");
  // Player laser
  laser = new component(15, 5, 'rgba(64, 255, 0, .7)', 50, 197, "pewpew");
  // background
  myBackground = new component(600, 400, "images/space3.jpg", 0, 0, "background");
  rocketNoise();
  // Fire up the game
  gameArea.start();
}

function playBackgroundMusic() {
  backgroundMusic = new Audio("sounds/alieninvasion.mp3");
  backgroundMusic.play();
}

function rocketNoise() {
  // Rocket sound looped
  myAudio = new Audio('sounds/rocket.mp3');
  if (typeof myAudio.loop == 'boolean') {
    myAudio.loop = true;
  } else {
    myAudio.addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
    }, false);
  }
  // Play rocket sound
  myAudio.play();
}
// Game area
var gameArea = {
  // Dynamically create canvas
  canvas : document.createElement("canvas"),
  start : function() {
    // Canvas dimensions
    this.canvas.width = 600;
    this.canvas.height = 400;
    // Canvas context
    this.context = this.canvas.getContext("2d");
    document.getElementById("canvas-container").appendChild(this.canvas);
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
    } else if(type == "text1") { // If component labeled text1
      ctx.font = "16px Orbitron";
      ctx.fillStyle = "white";
      ctx.fillText(width + height, x, y);
    } else if(type == "text2") { // If component labeled text2
      ctx.font = "32px Orbitron";
      ctx.fillStyle = "white";
      ctx.fillText(width + height, x, y);
    } else if(type == "pewpew") { // to draw laser
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
    // this object stats
    var myleft = this.x;
    var myright = this.x + (this.width);
    var mytop = this.y;
    var mybottom = this.y + (this.height);
    // other object stats
    var otherleft = otherobj.x;
    var otherright = otherobj.x + (otherobj.width);
    var othertop = otherobj.y;
    var otherbottom = otherobj.y + (otherobj.height);
    // Set boolean to crash is true
    var crash = true;
    // Check is missed, then set crash to false
    if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft || myleft > otherright)) {
      crash = false;
    }
    return crash;
  }
}

// Function to shoot laser
function shootLaser(x,y) {
  // Draw the shot
	shot.push(new component(15, 5, "rgba(64, 255, 0, .7)", laser.x, laser.y, "pewpew"));
  // Laser sfx
  let laserSFX = new Audio('sounds/audio_laser-sfx.m4a');
  laserSFX.play();
  // Making the laser shoot
  for(i = 0; i < shot.length; i++) {
  	shot[i].speedX +=1;
   }
}

// Function to load alien
function loadAlien() {
  var x, y;
  // Load beginning at right of canvas
  x = gameArea.canvas.width;
  // Randomly select the y axis number
  y = randomY();
  // Put the enemy in the array
  aliens.push(new component(60, 50, "images/monster.png", x, y, "image"));
  // make the monster noise
  if(score < 50) { // level one
    alienNoise();
  } else if(score > 50 && score < 100) {
    // Make the monster noise
    alienNoise();
    // Get another random y-axis
    y = randomY();
    // Put another enemy in the array
    aliens.push(new component(60, 50, "images/monster.png", x, y, "image"));
    // Monster makes some noise
    alienNoise();
  } else {
    // Randomly select the y axis number
    y = randomY();
    // Put the enemy in the array
    aliens.push(new component(60, 50, "images/monster.png", x, y, "image"));
    // make the monster noise
    // Put the enemy in the array
    aliens.push(new component(60, 50, "images/monster.png", x, y, "image"));
    // Make the monster noise
    alienNoise();
    // Get another random y-axis
    b = randomY();
    // Put another enemy in the array
    aliens.push(new component(60, 50, "images/monster.png", x, b, "image"));
    // Monster makes some noise
    alienNoise();
    // Get another random y-axis
    c = randomY();
    // Put another enemy in the array
    monsters.push(new component(60, 50, "images/monster.png", x, c, "image"));
    // Monster makes some noise
    alienNoise();
  }

  // The enemy advances towards the player
  for(i = 0; i < monsters.length; i++) {
    monsters[i].speedX += -1;
  }
}

// Helper function for random y-axis to load alien
function randomY() {
  // Randomly select the y axis number
  return Math.floor(Math.random() * (gameArea.canvas.height - 30));
}

function alienNoise() {
  // The alien announces their presence with scary sound
  let alienSFX = new Audio('sounds/monster.m4a');
  alienSFX.play();
}
// Function to draw the score
function drawScore() {
  var theScore = new component("Score: ", score, "white", 8, 20, "text1");
  theScore.newPos();
  theScore.update();
}

// Function to draw lives left
function drawLives() {
  var theLives = new component("Lives: ", lives, "white", ctx.canvas.width-80, 20, "text1");
  theLives.newPos();
  theLives.update();
}

// Function to draw life lost screen
function drawLifeLost() {
  var lifeLost = new component("Life Lost: ", "Press C to continue", "white", ctx.canvas.width/2 - 40, ctx.canvas.height/2, "text2");
  lifeLost.newPos();
  lifelost.update();
}

// Function to draw game over
function drawGameOver() {
  var gameOver = new component("Game Over", "!", "white", 200, 180, "text2");
  gameOver.newPos();
  gameOver.update();
  var overInstrcts = new component("press s for ", "new game", "#FFFFFF", 210, 220, "text1");
  overInstrcts.newPos();
  overInstrcts.update();
}

// Function to draw start screen
function startScreen() {
  var gameTitle = new component("Alien Invasion", "!", "white", 175, 180, "text2");
  gameTitle.newPos();
  gameTitle.update();
  var gameInstructs = new component("press s", " to start", "white", 230, 220, "text1");
  gameInstructs.newPos();
  gameInstructs.update();
}

// Function to draw level up screen
function levelUp() {
  if(score >= 30 && score < 100) {
    level = 2;
  } else if(score >= 100) {
    level = 3;
  }
  var gameLevel = new component("Welcome to Level ", level, "white", 125, 180, "text2");
  gameLevel.newPos();
  gameLevel.update();
  var gameInstructs = new component("press s", " to start", "white", 230, 220, "text1");
  gameInstructs.newPos();
  gameInstructs.update();
}

// Game loop
function updateGameArea() {
  gameArea.clear();
  // Increment frameNo
  gameArea.frameNo += 1;
  // Load an enemy based on frameNo
  if(!isGameOver && !pause) {
    if(gameArea.frameNo == 1 || everyinterval(150)) {
      loadAlien();
    }
  }

  //background speed and update
  if(warp) {
    myBackground.speedX = -1;
  } else {
    myBackground.speedX = -1;
  }
  myBackground.newPos();
  myBackground.update();
  // Anti-warp
  if(gameArea.key && gameArea.key == 37) {
    warp = false;
  }
  // Move up
  if(gameArea.key && gameArea.key == 38) {
    playerShip.speedY = -2;
    laser.speedY = -2;
  }
  // Warp
  if(gameArea.key && gameArea.key == 39) {
    warp = true;
  }
  // Move down
  if(gameArea.key && gameArea.key == 40) {
    playerShip.speedY = 2;
    laser.speedY = 2;
  }
  // Lasers away!
  if(gameArea.key && gameArea.key == 32 || (gameArea.key == 32 && game.Area.key == 38)) {
    shootLaser(laser.x, laser.y);
  }

  // Begin game and unpause
  if(gameArea.key && gameArea.key == 83) {
    if(isGameOver) {
      isGameOver = false;
      warp = false;
      score = 0;
      lives = 3;
      playBackgroundMusic();
    } else if(drawLevelUp) {
      drawLevelUp = false;
    }
    startBool = false;
    pause = false;
    playBackgroundMusic();
  }

  // If no input, clear everything
  if(!gameArea.key) {
    playerShip.speedX = 0;
    playerShip.speedY = 0;
    laser.speedX = 0;
    laser.speedY = 0;
  }
  // Check if we should display start screen
  if(startBool) {
    startScreen();
  }
  // Check if should display game over screen
  if(isGameOver == true) {
    drawGameOver();
  }
  if(drawLevelUp) {
    levelUp();
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
    for(h = 0; h < aliens.length; h++) {
      // Do this if we shot one
      if(shot[j].crashWith(aliens[h])) {
        // Update score
        score += 5;
        // The alien audibly explodes when shot!
        let explodeSFX = new Audio('sounds/explode.mp3');
        explodeSFX.play();
        // Remove the shot laser
        shot.splice(j, 1);
        // The alien visually explodes when shot!
        aliens[h] = new component(aliens[h].width, aliens[h].height, "images/explode.png", aliens[h].x, aliens[h].y, "image");
        aliens[h].update();
        // remove alien
        aliens.splice(h, 1);
        if(score == 30) {
          pause = true;
          drawLevelUp = true;
          aliens = [];
          playBackgroundMusic();
          levelUp();
        } else if(score == 150) {
          pause = true;
          drawLevelUp = true;
          aliens=[];
          playBackgroundMusic();
          levelUp();
        }
        break;
      }
    }
  }
  // Loop to check if alien crash with ship
  for(i = 0; i < aliens.length; i++) {
    if(playerShip.crashWith(aliens[i])) {
      // Lose a life for crashing into alien
      let smashSFX = new Audio('sounds/smash.mp3');
      smashSFX.play();
      if(lives == 1) {
        lives -= 1;
        drawLives();
        // Lives are zero, game over
        aliens = [];
        // Outro music
        playBackgroundMusic();
        isGameOver = true;
        drawGameOver();
      } else {
        // Decrement lives
        lives -= 1;
        // Explode aliens
        aliens[i] = new component(aliens[i].width, aliens[i].height, "images/explode.png", aliens[i].x, aliens[i].y, "image");
        monsters[i].update();
        // Remove aliens since you ran it over
        if(aliens.length == 1) {
          aliens = [];
        } else {
        aliens.splice(i, 1);
        }
      }
    }
    // remove aliens if ran off the board
    if(aliens[i].x == 0) {
      if(aliens.length == 1) {
        // if there's only 1 aliens, just empty the array
        aliens = [];
      } else {
        // otherwise we remove that element and splice the array together
        aliens.splice(i, 1);
      }
        // Lives are zero, game over
      if(lives == 1) {
        lives -= 1;
        // Update lives
        drawLives();
        // Remove aliens on board
        aliens = [];
        // Outro music
        backgroundMusic.play();
        // Update isGameOver boolean
        isGameOver = true;
        // Draw the game over on the canvas
        drawGameOver();
      } else {
        // Decrement lives
        lives -= 1;
      }
    }

    // Update alien position
    if(warp) {
      aliens[i].speedX = -4;
    } else {
      aliens[i].speedX = -2;
    }
    aliens[i].newPos();
    aliens[i].update();
  }
}
// Helper function for loading enemies on board
function everyinterval(n) {
  if((gameArea.frameNo / n) % 2 == 0) {return true;}
  return false;
}

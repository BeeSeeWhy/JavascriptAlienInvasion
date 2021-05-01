// Variables
var backgroundMusic,
    isGameOver = false,
    lives = 3,
    monsters = [],
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
  var divContainer = document.createElement("div");
  divContainer.id = "container";
  divContainer.className = "container-class";
  document.body.appendChild(divContainer);
  var divTitle = document.createElement("div");
  divTitle.id = "title";
  divTitle.className = "title-class";
  var centerTitle = document.createElement("center");
  centerTitle.id = "center-title";
  divTitle.appendChild(centerTitle);
  var headline = document.createElement("h1");
  headline.id = "headline";
  centerTitle.appendChild(headline);
  headline.innerHTML = "Alien Invasion!";
  document.getElementById("container").appendChild(divTitle);
  var bodyContainer = document.createElement("div");
  bodyContainer.id = "bodyContainer";
  document.getElementById("container").appendChild(bodyContainer);
  var divBodyContainer1 = document.createElement("div");
  divBodyContainer1.id = "bodyContainer1";
  document.getElementById("bodyContainer").appendChild(divBodyContainer1);
  var bodyImage1 = document.createElement("img");
  bodyImage1.id = "playerMarker";
  bodyImage1.src = "images/player.png";
  document.getElementById("bodyContainer1").appendChild(bodyImage1);
  var divCanvasContainer = document.createElement("div");
  divCanvasContainer.id = "canvas-container";
  divCanvasContainer.className = "canvas-container-class";
  document.getElementById("bodyContainer").appendChild(divCanvasContainer);
  var divBodyContainer2 = document.createElement("div");
  divBodyContainer2.id = "bodyContainer2";
  document.getElementById("bodyContainer").appendChild(divBodyContainer2);
  var bodyImage2 = document.createElement("img");
  bodyImage2.id = "alien";
  bodyImage2.src = "images/monster.png";
  document.getElementById("bodyContainer2").appendChild(bodyImage2);
  var instructsContainer = document.createElement("div");
  instructsContainer.id = "instructions-container";
  document.getElementById("container").appendChild(instructsContainer);

  // Player ship
  playerShip = new component(40, 40, 'images/spacecraft_white.png', 10, 180, "image");
  // Player laser
  laser = new component(15, 5, 'rgba(64, 255, 0, .7)', 50, 197, "pewpew");
  // background
  myBackground = new component(600, 400, "images/space3.jpg", 0, 0, "background");
  // Intro Music
  backgroundMusic = new Audio("sounds/alieninvasion.mp3");
  backgroundMusic.play();
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
  // Fire up the game
  gameArea.start();
}

// Game area
var gameArea = {
  // Dynamically create canvas
  canvas : document.createElement("canvas"),
  start : function() {
    //this.canvas.style.position = "relative";
    //this.canvas.style.left = "30%";
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
    } else if(type == "border") { //draw box around titles
      ctx.strokeStyle = color;
      ctx.lineWidth = 10;
      ctx.strokeRect = (this.x, this.y, this.width, this.height);
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

// Function to load the enemy
function loadEnemy() {
  var x, y;
  // Load beginning at right of canvas
  x = gameArea.canvas.width;
  // Randomly select the y axis number
  y = Math.floor(Math.random() * (gameArea.canvas.height - 30));
  // Put the enemy in the array
  monsters.push(new component(60, 50, "images/monster.png", x, y, "image"));
  // The enemy announces their presence with scary sound
  let monsterSFX = new Audio('sounds/monster.m4a');
  monsterSFX.play();
  // The enemy advances towards the player
  for(i = 0; i < monsters.length; i++) {
    monsters[i].speedX += -1;
  }
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

function startScreen() {
  /*var gameRect = new component(360, 145, "rgba(255,255,255,.09)", 120, 120, "pewpew");
  gameRect.newPos();
  gameRect.update();
  var gameBorder = new component(360, 145, "white", 120, 120, "border");
  gameBorder.newPos();
  gameBorder.update();*/
  var gameTitle = new component("Alien Invasion", "!", "white", 155, 180, "text2");
  gameTitle.newPos();
  gameTitle.update();
  var gameInstructs = new component("press s", " to start", "white", 210, 220, "text1");
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
      loadEnemy();
    }
  }

  //background speed and update
  if(warp) {
    myBackground.speedX = -2;
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
    }
    startBool = false;
    pause = false;
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
        // The monster audibly explodes when shot!
        let monsterSFX = new Audio('sounds/explode.mp3');
        monsterSFX.play();
        // Remove the shot laser
        shot.splice(j, 1);
        // The monster visually explodes when shot!
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
      let monsterSFX = new Audio('sounds/smash.mp3');
      monsterSFX.play();
      if(lives == 1) {
        lives -= 1;
        drawLives();
        // Lives are zero, game over
        monsters = [];
        // Outro music
        backgroundMusic.play();
        isGameOver = true;
        drawGameOver();
      } else {
        // Decrement lives
        lives -= 1;
        // Explode monster
        monsters[i] = new component(monsters[i].width, monsters[i].height, "images/explode.png", monsters[i].x, monsters[i].y, "image");
        monsters[i].update();
        // Remove monster since you ran it over
        if(monsters.length == 1) {
          monsters = [];
        } else {
        monsters.splice(i, 1);
        }
      }
    }
    // remove monster if ran off the board
    if(monsters[i].x == 0) {
      if(monsters.length == 1) {
        // if there's only 1 monster, just empty the array
        monsters = [];
      } else {
        // otherwise we remove that element and splice the array together
        monsters.splice(i, 1);
      }
        // Lives are zero, game over
      if(lives == 1) {
        lives -= 1;
        // Update lives
        drawLives();
        // Remove monsters on board
        monsters = [];
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
    // Update monster position
    if(warp) {
      monsters[i].speedX = -4;
    } else {
      monsters[i].speedX = -2;
    }
    monsters[i].newPos();
    monsters[i].update();
  }
}
// Helper function for loading enemies on board
function everyinterval(n) {
  if((gameArea.frameNo / n) % 2 == 0) {return true;}
  return false;
}

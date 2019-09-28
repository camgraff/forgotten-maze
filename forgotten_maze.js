var canvas;
var menu;
var game;
var on_menu = true;
var x;
var y;

var GAME_SIZE = 25;
var walls = [];

window.onload = function() {
    canvas = document.getElementById("forgotten_maze");
    startGame();
};

// Function that body of HTML calls
function startGame() {
    canvas.addEventListener("mousedown", getPosition, false);
    document.addEventListener("keydown", checkKeyPressed, false);
    forgotten_maze.setup();
    menu = new menu();
    game = new game();
    on_menu = true;
}

// Dictionary of game functions
var forgotten_maze = {
    setup : function() {
        this.context = canvas.getContext("2d");
        this.interval = setInterval(redrawGame, 20);
    },
    clear : function() {
        this.context.clearRect(0, 0, canvas.width, canvas.height);
    }
}

// Game Class
function game() {
    var img = document.getElementById("floor");
    x = 100;
    y = 100;
  
    this.update = function() {

        // Background image
        forgotten_maze.context.drawImage(img, 0, 0, img.width, img.height,
            0, 0, canvas.width, canvas.height);

        // Draw Player
        forgotten_maze.context.fillStyle = "#FFFFFF";
        forgotten_maze.context.fillRect(x, y, 25, 25);

        // Draw walls
        forgotten_maze.context.fillStyle = "#000000";
        forgotten_maze.context.fillRect(0, 0, canvas.width, GAME_SIZE);                                         // Top wall
        walls.push([0, 0, canvas.width, GAME_SIZE]);
        forgotten_maze.context.fillRect(canvas.width - GAME_SIZE, 0, GAME_SIZE, canvas.height);                 // Right wall
        walls.push([canvas.width - GAME_SIZE, 0, GAME_SIZE, canvas.height]);
        forgotten_maze.context.fillRect(0, 0, GAME_SIZE, canvas.height);                                        // Left wall
        walls.push([0, 0, GAME_SIZE, canvas.height]);
        forgotten_maze.context.fillRect(0, canvas.height - GAME_SIZE, canvas.width - 2*GAME_SIZE, GAME_SIZE);   // Bottom wall
        walls.push([0, canvas.height - GAME_SIZE, 2*GAME_SIZE, GAME_SIZE]);


    }
}

// Manu Class
function menu() {

    var img = document.getElementById("maze");
    var on_home = true;
    var on_controls = false;
    var on_developers = false;
  
    this.update = function() {

        if (on_home) {

            // Background image
            forgotten_maze.context.drawImage(img, 0, 0, img.width, img.height,
                0, 0, canvas.width, canvas.height);

            // Game Title
            forgotten_maze.context.fillStyle = "#000000";
            forgotten_maze.context.font = "50px Arial";
            forgotten_maze.context.fillText("The Forgotten Maze", 150, 100);

            // Play Button
            forgotten_maze.context.fillStyle = "#000000";
            forgotten_maze.context.fillRect(275, 200, 200, 75);
            forgotten_maze.context.fillStyle = "#FFFFFF";
            forgotten_maze.context.font = "36px Arial";
            forgotten_maze.context.fillText("Play", 340, 250);

            // Controls Button
            forgotten_maze.context.fillStyle = "#000000";
            forgotten_maze.context.fillRect(275, 300, 200, 75);
            forgotten_maze.context.fillStyle = "#FFFFFF";
            forgotten_maze.context.font = "36px Arial";
            forgotten_maze.context.fillText("Controls", 310, 350);

            // Developer Button
            forgotten_maze.context.fillStyle = "#000000";
            forgotten_maze.context.fillRect(275, 400, 200, 75);
            forgotten_maze.context.fillStyle = "#FFFFFF";
            forgotten_maze.context.font = "36px Arial";
            forgotten_maze.context.fillText("Developers", 285, 450);

        } else if (on_controls) {

            // Background image
            forgotten_maze.context.drawImage(img, 0, 0, img.width, img.height,
                0, 0, canvas.width, canvas.height);

            // Page Title
            forgotten_maze.context.fillStyle = "#000000";
            forgotten_maze.context.font = "50px Arial";
            forgotten_maze.context.fillText("Controls", 275, 100);

            // Return Button
            forgotten_maze.context.fillStyle = "#000000";
            forgotten_maze.context.fillRect(0, 0, 200, 75);
            forgotten_maze.context.fillStyle = "#FFFFFF";
            forgotten_maze.context.font = "36px Arial";
            forgotten_maze.context.fillText("Return", 50, 50);

            // Control Description
            forgotten_maze.context.fillStyle = "#FFFFFF";
            forgotten_maze.context.font = "36px Arial";
            forgotten_maze.context.fillText("Up Arrow - Move character up", 125, 200);
            forgotten_maze.context.fillText("Down Arrow - Move character down", 125, 250);
            forgotten_maze.context.fillText("Left Arrow - Move character left", 125, 300);
            forgotten_maze.context.fillText("Right Arrow - Move character right", 125, 350);
            forgotten_maze.context.fillText("Esc - Move character up", 125, 400);

        } else if (on_developers) {

            // Background image
            forgotten_maze.context.drawImage(img, 0, 0, img.width, img.height,
                0, 0, canvas.width, canvas.height);

            // Page Title
            forgotten_maze.context.fillStyle = "#000000";
            forgotten_maze.context.font = "50px Arial";
            forgotten_maze.context.fillText("Developers", 250, 100);

            // Return Button
            forgotten_maze.context.fillStyle = "#000000";
            forgotten_maze.context.fillRect(0, 0, 200, 75);
            forgotten_maze.context.fillStyle = "#FFFFFF";
            forgotten_maze.context.font = "36px Arial";
            forgotten_maze.context.fillText("Return", 50, 50);

            // Control Description
            forgotten_maze.context.fillStyle = "#FFFFFF";
            forgotten_maze.context.font = "36px Arial";
            forgotten_maze.context.fillText("Jeffrey Stenerson", 225, 200);
            forgotten_maze.context.fillText("Cameron Graff", 245, 350);
            forgotten_maze.context.fillText("Jerry Bui", 300, 275);

        }

    }

    this.changeScreen = function(x, y) {
        if (on_home) {
            if (x > 275 && x < 475 && y > 200 && y < 275) {
                on_home = true;
                on_controls = false;
                on_developers = false;
                on_menu = false;
            } else if (x > 275 && x < 475 && y > 300 && y < 375) {
                on_home = false;
                on_controls = true;
                on_developers = false;
            } else if (x > 275 && x < 475 && y > 400 && y < 475) {
                on_home = false;
                on_controls = false;
                on_developers = true;
            }
        } else if (on_controls || on_developers) {
            if (x > 0 && x < 200 && y > 0 && y < 75) {
                on_home = true;
                on_controls = false;
                on_developers = false;
            }
        }
    }
}

// Grab position of mouse click
function getPosition(event) {
  var x = event.x;
  var y = event.y;

  x -= canvas.offsetLeft;
  y -= canvas.offsetTop;

  if (on_menu) {
    menu.changeScreen(x,y);
  }
} 

// Delete everything on canvas and call update on menu and game
function redrawGame() {
    forgotten_maze.clear();

    if (on_menu) {
        menu.update();
    } else {
        game.update();
    }
}

// Function to check key press
function checkKeyPressed(e) {
    if (!on_menu) {
        switch(e.keyCode) {
            case 27:
                on_menu = true;
            case 37:
                // left key pressed
                x -= 5;
                if (!checkCollision) {
                    x += 5;
                }
                break;
            case 38:
                // up key pressed
                y -= 5;
                if (!checkCollision) {
                    y += 5;
                }
                break;
            case 39:
                // right key pressed
                x += 5;
                if (!checkCollision) {
                    x -= 5;
                }
                break;
            case 40:
                // down key pressed
                y += 5;
                if (!checkCollision) {
                    y -= 5;
                }
                break;  
        }   
    } 
}

function checkCollision() {
    for (i = 0; i < walls.length; i++) {
        if (x > walls[i][0] && x < walls[i][2] && y > walls[i][1] && y < walls[i][3]) {
            return true
        }
    }
    return false;
}
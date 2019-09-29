var canvas;
var menu;
var game;
var x;
var y;
var start_time = 2;
//var seconds = mins * 60;

// Timing variables
var time = 120;
var time_left = "";

// Game Variables
var GAME_SIZE = 25;
var on_menu = true;
var score = 0;
var walls = [];
var coins = [];
var playerRotation = 0;


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
        boardCells = createMaze();
    },
    clear : function() {
        this.context.clearRect(0, 0, canvas.width, canvas.height);
    }
}

// Game Class
function game() {
    var img = document.getElementById("floor");
    var coin = document.getElementById("coin");
    x = 0;
    y = 0;

    drawCoins();
  
    this.update = function() {
        
        // Background image
        forgotten_maze.context.drawImage(img, 0, 0, img.width, img.height,
            0, 0, canvas.width, canvas.height);

        // Draw Player
        forgotten_maze.context.fillStyle = "#FFFFFF";
        forgotten_maze.context.fillRect(x, y, 23, 23);
        drawPlayer(forgotten_maze.context);
        

        // Draw outside walls
        
        /*
        forgotten_maze.context.fillStyle = "#000000";
        forgotten_maze.context.fillRect(0, 0, canvas.width, GAME_SIZE);                                         // Top wall
        walls.push([0, 0, canvas.width, GAME_SIZE]);
        forgotten_maze.context.fillRect(canvas.width - GAME_SIZE, 0, GAME_SIZE, canvas.height);                 // Right wall
        walls.push([canvas.width - GAME_SIZE, 0, canvas.width, canvas.height]);
        forgotten_maze.context.fillRect(0, 0, GAME_SIZE, canvas.height);                                        // Left wall
        walls.push([0, 0, GAME_SIZE, canvas.height]);
        forgotten_maze.context.fillRect(0, canvas.height - GAME_SIZE, canvas.width - 2*GAME_SIZE, GAME_SIZE);   // Bottom wall
        walls.push([0, canvas.height - GAME_SIZE, canvas.width - 2*GAME_SIZE, canvas.height]);
        */
        // Random wall for Testing
        //forgotten_maze.context.fillRect(50, 50, 100, GAME_SIZE);
        //walls.push([50, 50, 150, 75]);

        // Draw Coins
        for (var i = 0; i < coins.length; i++) {
            if (coins[i][2] == 1) {
                forgotten_maze.context.drawImage(coin, coins[i][0], coins[i][1], GAME_SIZE, GAME_SIZE);
            }
        }

    

        // Draw Time
        forgotten_maze.context.fillStyle = "#FFFFFF";
        forgotten_maze.context.font = "15px Arial";
        forgotten_maze.context.textAlign = "left";
        forgotten_maze.context.fillText(time_left, 25, 20);

        // Draw Score
        forgotten_maze.context.fillStyle = "#FFFFFF";
        forgotten_maze.context.font = "15px Arial";
        forgotten_maze.context.fillText("Score: ", 650, 20);
        forgotten_maze.context.fillText(score, 700, 20);

        //draw maze
        forgotten_maze.context.fillStyle = "#000000";
        for (var row=0; row<boardCells.length; row++) {
            for (var col=0; col<boardCells[0].length; col++) {
                for (var i=0; i<4; i++) {
                    //draw walls
                    if (boardCells[row][col][i] === 0) {
                        switch (i) {
                            //left
                            case 0:
                                forgotten_maze.context.fillRect(GAME_SIZE*row, GAME_SIZE*col, 2, GAME_SIZE);
                                //walls.push([GAME_SIZE*row, GAME_SIZE*col, GAME_SIZE*row+2, GAME_SIZE*(col+1)]);
                                break;
                            //right
                            case 1:
                                forgotten_maze.context.fillRect(GAME_SIZE*(row+1), GAME_SIZE*col, 2, GAME_SIZE);
                                //walls.push([GAME_SIZE*(row+1), GAME_SIZE*col, GAME_SIZE*(row+1)+2, GAME_SIZE*(col+1)]);
                                break;
                            //top
                            case 2:
                                forgotten_maze.context.fillRect(GAME_SIZE*row, GAME_SIZE*col, GAME_SIZE, 2);
                                break;
                            //bottom
                            case 3:
                                forgotten_maze.context.fillRect(GAME_SIZE*row, GAME_SIZE*(col+1), GAME_SIZE, 2);
                                break;
                        }
                    }
                }
            }
        }
    }
}

function createMaze(){
    var xMax = canvas.width/GAME_SIZE;
    var yMax = canvas.height/GAME_SIZE;
    cells = [];
    visited = [];
    for (var i = 0; i < xMax; i++){
        cells[i] = [];
        visited[i] = [];
        for (var j = 0; j < yMax; j++){
            //[left,right,up,down]
            cells[i][j] = [0,0,0,0];        //[0,0,0,0] indicates all walls around the cell are present
            visited[i][j] = false;
        }
    }

    //first cell is top left in maze
    currentCell = [0,0];
    visited[0][0] = true;
    var path = [currentCell];

    while (path.length > 0) {

        //determine valid neighbor cells
        //neighbor cells are of the from [xpos,ypos,currentCell border, neighbor border]
        var neighbors = [];
        //check left neighbor
        var left = [currentCell[0]-1,currentCell[1],0,1];
        if (left[0] >= 0 && left[0] < xMax && left[1] >= 0 && left[1] < yMax && !visited[left[0]][left[1]]) neighbors.push(left);
        //check right neighbor
        var right = [currentCell[0]+1,currentCell[1],1,0];
        if (right[0] >= 0 && right[0] < xMax && right[1] >= 0 && right[1] < yMax && !visited[right[0]][right[1]]) neighbors.push(right);
        //check up neighbor
        var up = [currentCell[0],currentCell[1]-1,2,3];
        if (up[0] >= 0 && up[0] < xMax && up[1] >= 0 && up[1] < yMax && !visited[up[0]][up[1]]) neighbors.push(up);
        //check down neighbor
        var down = [currentCell[0],currentCell[1]+1,3,2];
        if (down[0] >= 0 && down[0] < xMax && down[1] >= 0 && down[1] < yMax && !visited[down[0]][down[1]]) neighbors.push(down);

        if (neighbors.length) {
            var nextCell = neighbors[Math.floor(random()*neighbors.length)];
            //make a path between currentCell and nextCell
            cells[currentCell[0]][currentCell[1]][nextCell[2]] = 1;
            cells[nextCell[0]][nextCell[1]][nextCell[3]] = 1;
            visited[nextCell[0]][nextCell[1]] = true;
            currentCell = nextCell;
            path.push(currentCell);
        } else {
            path.pop();
            currentCell = path[path.length-1]
        }
    }
    return cells;
}

var seed = 2;
function random() {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}


// Timing Functions:
setInterval(function timing() {

    var time_left_alpha = "Time Left: ";
    var min_left = "";
    var sec_left = "";

    if(time > 0){
        var min = Math.floor(time / 60);
        var sec = time % 60;

        min_left = min.toString();
        if (sec == 0){
            sec_left = "00";
        }
        else if(sec < 10){
            sec_left = "0".concat(sec.toString());
        }
        else{
            sec_left = sec.toString();
        }

        time_left = time_left_alpha.concat(min_left, ":", sec_left);
        time -= 1;
    }
    else {
        return;
        // TO DO: exit game / game over window
    }
}, 1000);

// Menu Class
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
            forgotten_maze.context.fillText("Esc - Go to Main Menu (will pause the game)", 125, 400);

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
                playerRotation = 270;
                if (checkCollision(0) == true) {
                    x += 5;
                }
                break;
            case 38:
                // up key pressed
                y -= 5;
                playerRotation = 0;
                if (checkCollision(1) == true) {
                    y += 5;
                }
                break;
            case 39:
                // right key pressed
                x += 5;
                playerRotation = 90;
                if (checkCollision(2) == true) {
                    x -= 5;
                }
                break;
            case 40:
                // down key pressed
                y += 5;
                playerRotation = 180;
                if (checkCollision(3) == true) {
                    y -= 5;
                }
                break;  
        }
        gatherCoin();
    }
}

// Check collision with wall
function checkCollision(direction) {

    if (direction == 0) { // left
        for (i = 0; i < walls.length; i++) {
            if (x > walls[i][0] && x < walls[i][2] && y > walls[i][1] && y < walls[i][3]) {
                return true;
            }
            if (x > walls[i][0] && x < walls[i][2] && y + GAME_SIZE > walls[i][1] && y + GAME_SIZE < walls[i][3]) {
                return true;
            }
            if (x > walls[i][0] && x < walls[i][2] && y + (GAME_SIZE/2) > walls[i][1] && y + (GAME_SIZE/2) < walls[i][3]) {
                return true;
            }
        }
    } else if (direction == 1) { // up
        for (i = 0; i < walls.length; i++) {
            if (x > walls[i][0] && x < walls[i][2] && y > walls[i][1] && y < walls[i][3]) {
                return true;
            }
            if (x + GAME_SIZE > walls[i][0] && x + GAME_SIZE < walls[i][2] && y > walls[i][1] && y < walls[i][3]) {
                return true;
            }
            if (x + (GAME_SIZE/2) > walls[i][0] && x + (GAME_SIZE/2) < walls[i][2] && y > walls[i][1] && y < walls[i][3]) {
                return true;
            }
        }
    } else if (direction == 2) { // right
        for (i = 0; i < walls.length; i++) {
            if (x + GAME_SIZE > walls[i][0] && x + GAME_SIZE < walls[i][2] && y > walls[i][1] && y < walls[i][3]) {
                return true;
            }
            if (x + GAME_SIZE > walls[i][0] && x + GAME_SIZE <= walls[i][2] && y + GAME_SIZE > walls[i][1] && y + GAME_SIZE < walls[i][3]) {
                return true;
            }
            if (x + GAME_SIZE > walls[i][0] && x + GAME_SIZE < walls[i][2] && y + (GAME_SIZE/2) > walls[i][1] && y + (GAME_SIZE/2) < walls[i][3]) {
                return true;
            }
        }
    } else if (direction == 3) { // down
        for (i = 0; i < walls.length; i++) {
            if (x > walls[i][0] && x < walls[i][2] && y + GAME_SIZE > walls[i][1] && y + GAME_SIZE < walls[i][3]) {
                return true;
            }
            if (x + GAME_SIZE > walls[i][0] && x + GAME_SIZE < walls[i][2] && y + GAME_SIZE > walls[i][1] && y + GAME_SIZE < walls[i][3]) {
                return true;
            }
            if (x + (GAME_SIZE/2) > walls[i][0] && x + (GAME_SIZE/2) < walls[i][2] && y + GAME_SIZE > walls[i][1] && y + GAME_SIZE < walls[i][3]) {
                return true;
            }
        }
    }

    return false;
}

// Check collision with coins
function gatherCoin() {
    for (i = 0; i < coins.length; i++) {
        var current_x = x + (GAME_SIZE/2);
        var current_y = y + (GAME_SIZE/2);
        var coin_x = coins[i][0];
        var coin_y = coins[i][1];
        if (current_x > coin_x && current_x < coin_x + GAME_SIZE && current_y > coin_y && current_y < coin_y + GAME_SIZE) {
            if (coins[i][2] == 1) {
                coins[i][2] = 0;
                score += 50;
            }
        }
    }  
}

// Draw coins
function drawCoins() {
    // Array [x-cord (point 1), y-cord (point 1), drawCoin (bool)]
    coins.push([50,25,1]);
    coins.push([100,25,1]);
    coins.push([150,25,1]);
    coins.push([200,25,1]);
    coins.push([250,25,1]);
    coins.push([300,25,1]);
    coins.push([350,25,1]);
}

// Draw player with correct rotation
function drawPlayer(ctx) {
    var player_up = document.getElementById("player_up");
    var player_down = document.getElementById("player_down");
    var player_left = document.getElementById("player_left");
    var player_right = document.getElementById("player_right");

    if (playerRotation == 0) {
        ctx.drawImage(player_up, x, y, GAME_SIZE, GAME_SIZE);
    } else if (playerRotation == 90) {
        ctx.drawImage(player_right, x, y, GAME_SIZE, GAME_SIZE);
    } else if (playerRotation == 180) {
        ctx.drawImage(player_down, x, y, GAME_SIZE, GAME_SIZE);
    } else {
        ctx.drawImage(player_left, x, y, GAME_SIZE, GAME_SIZE);
    }
}

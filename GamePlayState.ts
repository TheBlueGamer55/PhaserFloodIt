class GamePlayState extends Phaser.State {
    game: Phaser.Game;
    gridColors: Phaser.BitmapData;
    gridBoard: Phaser.Sprite;

    buttonGraphics: Phaser.Graphics;
    fillButtons: Phaser.Rectangle[];

    gameOver: boolean;
    gameWon: boolean;

    //Debug input
    /*R_KEY: Phaser.Key;
    G_KEY: Phaser.Key;
    B_KEY: Phaser.Key;*/

    R_KEY: Phaser.Key;

    public static BUTTONS_X: number = 160;
    public static BUTTONS_Y: number = 400;
    public static BUTTON_SIZE: number = 48;
    public static BUTTON_OFFSET: number = 8;

    //Dimensions of the rectangles that act as counters
    public static COUNTER_X: number = 60;
    public static COUNTER_Y: number = 70;
    public static COUNTER_WIDTH: number = 20;
    public static COUNTER_HEIGHT: number = 8;
    public static COUNTER_OFFSET: number = 4;

    public static MAX_TRIES: number = 25; 
    fillCounter: number;

    counterBitmap: Phaser.BitmapData;
    counterUI: Phaser.Sprite;

    public static BACKGROUND_COLOR: string = Phaser.Color.RGBtoString(0, 0, 0, 0, "#");

    public static GRID_SIZE: number = 16; //The size of each individual square on the grid
    public static GRID_LENGTH: number = 14; //The length of the whole grid in squares
    public static BASIC_PALETTE: number[][] = [
        [255, 0, 0], //RED
        [0, 128, 0], //GREEN
        [0, 0, 255], //BLUE
        [255, 255, 0], //YELLOW
        [128, 0, 128], //PURPLE
        [0, 255, 255] //CYAN
    ];
    public static CURRENT_PALETTE: number[][] = GamePlayState.BASIC_PALETTE;

    constructor() {
        super();
    }

    create() {
        this.game.stage.setBackgroundColor(GamePlayState.BACKGROUND_COLOR);
        this.gameOver = false;
        this.gameWon = false;
        this.fillButtons = [];
        this.buttonGraphics = this.game.add.graphics(0, 0);
        this.generateGrid();

        //Create the rectangles for the counter
        this.fillCounter = 0;
        this.createCounter();

        //Create the fill buttons
        this.createButtons();

        this.input.onTap.add(this.mousePressed, this);

        //Generate new grid when R is pressed
        this.R_KEY = this.game.input.keyboard.addKey(Phaser.Keyboard.R);
        this.R_KEY.onDown.add(this.resetGame, this);

        //Temporary key input for floodfill testing
        /*this.R_KEY = this.game.input.keyboard.addKey(Phaser.Keyboard.R);
        this.R_KEY.onDown.add(this.fillRed, this);

        this.G_KEY = this.game.input.keyboard.addKey(Phaser.Keyboard.G);
        this.G_KEY.onDown.add(this.fillGreen, this);

        this.B_KEY = this.game.input.keyboard.addKey(Phaser.Keyboard.B);
        this.B_KEY.onDown.add(this.fillBlue, this);*/
    }

    createButtons() {
        var bx = GamePlayState.BUTTONS_X;
        var by = GamePlayState.BUTTONS_Y;
        var size = GamePlayState.BUTTON_SIZE;
        var offset = GamePlayState.BUTTON_OFFSET;
        for (var i = 0; i < GamePlayState.CURRENT_PALETTE.length; i++) {
            //Create rectangles for button input
            this.fillButtons[i] = new Phaser.Rectangle(bx + i * (size + offset), by, size, size);

            //Draw buttons for UI
            var c = Phaser.Color.getColor(GamePlayState.CURRENT_PALETTE[i][0],
                GamePlayState.CURRENT_PALETTE[i][1],
                GamePlayState.CURRENT_PALETTE[i][2]);
            this.buttonGraphics.beginFill(c, 1);
            this.buttonGraphics.drawRect(bx + i * (size + offset), by, size, size);
            //this.buttonGraphics.drawRect(320, 240, 21, 21);
            this.buttonGraphics.endFill();
        }
    }

    createCounter() {
        var cx = GamePlayState.COUNTER_X;
        var cy = GamePlayState.COUNTER_Y;
        var width = GamePlayState.COUNTER_WIDTH;
        var height = GamePlayState.COUNTER_HEIGHT;
        var offset = GamePlayState.COUNTER_OFFSET;
        var maxTries = GamePlayState.MAX_TRIES;
        this.counterBitmap = this.game.add.bitmapData(width, (offset + height) * maxTries);
        var color = Phaser.Color.RGBtoString(255, 0, 0, 0, "#");
        for (var i = 0; i < maxTries; i++) {
            //console.log(cx + ", " + (cy + (i * (height + offset))) + ", " + width + ", " + height + ",, " + color);
            //this.counterBitmap.rect(0, 0, 24, 24, color);
            this.counterBitmap.rect(0, i * (height + offset), width, height, color);
        }
        this.counterBitmap.update(); //IMPORTANT - updates the bitmap pixel data
        this.counterUI = this.game.add.sprite(cx, cy, this.counterBitmap);
        this.game.add.existing(this.counterUI);
    }

    /*
    Starts the floodFill algorithm with the given fill color
    */
    fill(fillColor: number) {
        var startRGB = this.gridColors.getPixelRGB(0, 0);
        var startColor = [startRGB.r, startRGB.g, startRGB.b];
        var marked: boolean[][] = [];
        for (var i = 0; i <= GamePlayState.GRID_LENGTH; i++){
            marked[i] = [];
            for (var j = 0; j <= GamePlayState.GRID_LENGTH; j++){
                marked[i][j] = false;
            }
        }
        this.floodFill(0, 0, startColor, GamePlayState.CURRENT_PALETTE[fillColor], marked);
    }

    /*
    Custom floodfill algorithm based on the given color in RGB format
    Flooding starts at (startX, startY) using the color in RGB format
    */
    floodFill(startX: number, startY: number, oldColor: number[], newColor: number[], marked: boolean[][]) {
        //Cannot floodfill outside of bitmap dimensions
        if (startX < 0 || startX > this.gridColors.width || startY < 0 || startY > this.gridColors.height) {
            return;
        }
        var size = GamePlayState.GRID_SIZE;
        var tileX = startX / size;
        var tileY = startY / size;
        var pixelRGB = this.gridColors.getPixelRGB(startX, startY);
        var pixelColor = [pixelRGB.r, pixelRGB.g, pixelRGB.b];
        if (!marked[tileX][tileY] && pixelColor[0] == oldColor[0] && pixelColor[1] == oldColor[1] && pixelColor[2] == oldColor[2]) {
            marked[tileX][tileY] = true;
            this.gridColors.rect(startX, startY, size, size, Phaser.Color.RGBtoString(newColor[0], newColor[1], newColor[2], 0, "#"));
            this.gridColors.update();
            this.floodFill(startX + size, startY, oldColor, newColor, marked);
            this.floodFill(startX, startY + size, oldColor, newColor, marked);
            this.floodFill(startX - size, startY, oldColor, newColor, marked);
            this.floodFill(startX, startY - size, oldColor, newColor, marked);
        }
        else {
            return;
        }
    }

    /*
    Checks if the grid has been filled with only one color
    */
    gridFilled() {
        //Assume the grid is a singular color
        var isFilled: boolean = true;
        var mainColor = this.gridColors.getPixelRGB(0, 0);
        var tempColor;
        for (var i = 0; i < GamePlayState.GRID_LENGTH; i++){
            for (var j = 0; j < GamePlayState.GRID_LENGTH; j++) {
                tempColor = this.gridColors.getPixelRGB(i * GamePlayState.GRID_SIZE, j * GamePlayState.GRID_SIZE);
                //If even one square is a different color, the grid is not filled
                if (tempColor.r != mainColor.r || tempColor.g != mainColor.g || tempColor.b != mainColor.b) {
                    return false;
                }
            }
        }
        return isFilled;
    }

    /*
    Generates a grid of random colors
    */
    generateGrid() {
        var size = GamePlayState.GRID_SIZE;
        var length = GamePlayState.GRID_LENGTH;
        this.gridColors = this.game.add.bitmapData(length * size, length * size);
        for (var i = 0; i < size; i++) {
            for (var j = 0; j < size; j++) {
                var randColor = this.chooseRandomColor(GamePlayState.CURRENT_PALETTE);
                this.gridColors.rect(i * size, j * size, size, size, randColor);
            }
        }
        this.gridColors.update(); //IMPORTANT - updates the bitmap pixel data
        this.gridBoard = this.game.add.sprite(this.game.width / 2, this.game.height / 2, this.gridColors);
        this.gridBoard.anchor.set(0.5, 0.5);
        this.game.add.existing(this.gridBoard);
    }

    /*
    Returns a randomly generated color in hexadecimal format with prefix "#"
    */
    generateRandomColor() {
        var randRed = this.game.rnd.integerInRange(0, 255);
        var randGreen = this.game.rnd.integerInRange(0, 255);
        var randBlue = this.game.rnd.integerInRange(0, 255);
        return Phaser.Color.RGBtoString(randRed, randGreen, randBlue, 0, "#");
    }

    /*
    Returns a random color from a given palette.
    The palette is an array of 6 arrays, each with 3 numbers representing RGB values
    */
    chooseRandomColor(palette: number[][]) {
        var choice = this.game.rnd.integerInRange(0, 5);
        var red = palette[choice][0];
        var green = palette[choice][1];
        var blue = palette[choice][2];
        return Phaser.Color.RGBtoString(red, green, blue, 0, "#");
    }

    mousePressed() {
        //Floodfill only while still not game won or game over
        if (!this.gameWon && !this.gameOver && this.fillCounter < GamePlayState.MAX_TRIES) {
            //Check if one of the fill buttons was pressed
            for (var i = 0; i < this.fillButtons.length; i++) {
                if (this.fillButtons[i].contains(this.game.input.x, this.game.input.y)) {
                    this.fill(i);
                    this.counterBitmap.rect(0,
                        this.fillCounter * (GamePlayState.COUNTER_HEIGHT + GamePlayState.COUNTER_OFFSET),
                        GamePlayState.COUNTER_WIDTH,
                        GamePlayState.COUNTER_HEIGHT, GamePlayState.BACKGROUND_COLOR);
                    this.counterBitmap.update();
                    this.fillCounter++;
                    //If grid full (game won)
                    if (this.gridFilled()) {
                        this.gameWon = true;
                        alert("You win! Press R to restart");
                    }
                    //If last move was made, already checked if game won, so game is lost
                    if (!this.gameWon && !this.gameOver && this.fillCounter >= GamePlayState.MAX_TRIES) {
                        this.gameOver = true;
                        alert("Game Over! Press R to restart.");
                    }
                    return;
                }
            }
        }
    }

    resetGame() {
        this.generateGrid();
        this.createCounter();
        this.gameWon = false;
        this.gameOver = false;
        this.fillCounter = 0;
    }

}
 
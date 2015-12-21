class GamePlayState extends Phaser.State {
    game: Phaser.Game;
    gridColors: Phaser.BitmapData;
    gridBoard: Phaser.Sprite;

    buttonGraphics: Phaser.Graphics;
    fillButtons: Phaser.Rectangle[];

    //Debug input
    /*R_KEY: Phaser.Key;
    G_KEY: Phaser.Key;
    B_KEY: Phaser.Key;*/

    public static BUTTONS_X: number = 160;
    public static BUTTONS_Y: number = 400;
    public static BUTTON_SIZE: number = 48;
    public static BUTTON_OFFSET: number = 8;

    public static GRID_SIZE: number = 16;
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
        this.fillButtons = [];
        this.buttonGraphics = this.game.add.graphics(0, 0);
        this.generateGrid();
        alert("This is the gameplay screen");

        //Create the fill buttons
        this.createButtons();

        this.input.onTap.add(this.mousePressed, this);

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

    /*fillRed() {
        this.fill(0);
    }

    fillGreen() {
        this.fill(1);
    }

    fillBlue() {
        this.fill(2);
    }*/

    /*
    Starts the floodFill algorithm with the given fill color
    */
    fill(fillColor: number) {
        var startRGB = this.gridColors.getPixelRGB(0, 0);
        var startColor = [startRGB.r, startRGB.g, startRGB.b];
        var marked: boolean[][] = [];
        for (var i = 0; i < GamePlayState.GRID_SIZE; i++){
            marked[i] = [];
            for (var j = 0; j < GamePlayState.GRID_SIZE; j++){
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
    Generates a grid of random colors
    */
    generateGrid() {
        var size = GamePlayState.GRID_SIZE;
        this.gridColors = this.game.add.bitmapData(14 * size, 14 * size);
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
        //Check if one of the fill buttons was pressed
        for (var i = 0; i < this.fillButtons.length; i++) {
            if (this.fillButtons[i].contains(this.game.input.x, this.game.input.y)){
                this.fill(i);
                return;
            }
        }
    }

}
 
class GamePlayState extends Phaser.State {
    game: Phaser.Game;
    gridColors: Phaser.BitmapData;
    gridBoard: Phaser.Sprite;

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
        this.generateGrid();
        alert("This is the gameplay screen");
        this.input.onTap.add(this.generateGrid, this);
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

}
 
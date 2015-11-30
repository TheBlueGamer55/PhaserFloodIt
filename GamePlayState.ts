class GamePlayState extends Phaser.State {
    game: Phaser.Game;
    gridColors: Phaser.BitmapData;
    gridBoard: Phaser.Sprite;

    public static GRID_SIZE: number = 16;

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
                var randColor = this.generateRandomColor();
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

}
 
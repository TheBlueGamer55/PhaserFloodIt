var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var GamePlayState = (function (_super) {
    __extends(GamePlayState, _super);
    function GamePlayState() {
        _super.call(this);
    }
    GamePlayState.prototype.create = function () {
        this.generateGrid();
        alert("This is the gameplay screen");
        this.input.onTap.add(this.generateGrid, this);
    };
    /*
    Generates a grid of random colors
    */
    GamePlayState.prototype.generateGrid = function () {
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
    };
    /*
    Returns a randomly generated color in hexadecimal format with prefix "#"
    */
    GamePlayState.prototype.generateRandomColor = function () {
        var randRed = this.game.rnd.integerInRange(0, 255);
        var randGreen = this.game.rnd.integerInRange(0, 255);
        var randBlue = this.game.rnd.integerInRange(0, 255);
        return Phaser.Color.RGBtoString(randRed, randGreen, randBlue, 0, "#");
    };
    /*
    Returns a random color from a given palette.
    The palette is an array of 6 arrays, each with 3 numbers representing RGB values
    */
    GamePlayState.prototype.chooseRandomColor = function (palette) {
        var choice = this.game.rnd.integerInRange(0, 5);
        var red = palette[choice][0];
        var green = palette[choice][1];
        var blue = palette[choice][2];
        return Phaser.Color.RGBtoString(red, green, blue, 0, "#");
    };
    GamePlayState.GRID_SIZE = 16;
    GamePlayState.BASIC_PALETTE = [
        [255, 0, 0],
        [0, 128, 0],
        [0, 0, 255],
        [255, 255, 0],
        [128, 0, 128],
        [0, 255, 255] //CYAN
    ];
    GamePlayState.CURRENT_PALETTE = GamePlayState.BASIC_PALETTE;
    return GamePlayState;
})(Phaser.State);
//# sourceMappingURL=GamePlayState.js.map
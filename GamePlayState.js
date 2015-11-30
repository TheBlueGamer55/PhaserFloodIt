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
                var randColor = this.generateRandomColor();
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
    GamePlayState.GRID_SIZE = 16;
    return GamePlayState;
})(Phaser.State);
//# sourceMappingURL=GamePlayState.js.map
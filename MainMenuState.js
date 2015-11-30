var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var MainMenuState = (function (_super) {
    __extends(MainMenuState, _super);
    function MainMenuState() {
        _super.call(this);
    }
    MainMenuState.prototype.create = function () {
        alert("This is the main menu");
        this.input.onTap.addOnce(this.startGame, this);
    };
    MainMenuState.prototype.startGame = function () {
        this.game.state.start("GamePlayState");
    };
    return MainMenuState;
})(Phaser.State);
//# sourceMappingURL=MainMenuState.js.map
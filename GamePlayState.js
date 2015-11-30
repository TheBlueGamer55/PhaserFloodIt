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
        alert("This is the gameplay screen");
    };
    return GamePlayState;
})(Phaser.State);
//# sourceMappingURL=GamePlayState.js.map
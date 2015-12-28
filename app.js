var Game;
(function (Game) {
    var FloodIt = (function () {
        function FloodIt() {
            this.game = new Phaser.Game(640, 480, Phaser.AUTO, 'content', {
                create: this.create, preload: this.preload
            });
        }
        FloodIt.prototype.preload = function () {
        };
        FloodIt.prototype.create = function () {
            this.game.preserveDrawingBuffer = true; //WebGL fix when updating bitmaps
            this.game.state.add("MainMenuState", MainMenuState, false);
            this.game.state.add("GamePlayState", GamePlayState, true);
            //Center the content
            this.game.scale.pageAlignHorizontally = true;
        };
        return FloodIt;
    })();
    Game.FloodIt = FloodIt;
})(Game || (Game = {}));
window.onload = function () {
    var game = new Game.FloodIt();
};
//# sourceMappingURL=app.js.map
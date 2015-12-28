module Game {
    export class FloodIt {
        game: Phaser.Game;

        constructor() {
            this.game = new Phaser.Game(640, 480, Phaser.AUTO, 'content', {
                create: this.create, preload: this.preload
            });
        }

        preload() {
            
        }

        create() {
            this.game.preserveDrawingBuffer = true; //WebGL fix when updating bitmaps
            this.game.state.add("MainMenuState", MainMenuState, false);
            this.game.state.add("GamePlayState", GamePlayState, true);

            //Center the content
            this.game.scale.pageAlignHorizontally = true;
        }
    }
}

window.onload = () => {
    var game = new Game.FloodIt();
}


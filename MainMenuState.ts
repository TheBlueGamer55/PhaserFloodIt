class MainMenuState extends Phaser.State {
    game: Phaser.Game;

    constructor() {
        super();
    }

    create() {
        alert("This is the main menu");

        this.input.onTap.addOnce(this.startGame, this);
    }

    startGame() {
        this.game.state.start("GamePlayState");
    }
}

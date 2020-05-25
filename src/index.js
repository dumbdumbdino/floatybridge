import Phaser from "phaser";
import Game from "./scenes/game";


const config = {
    type: Phaser.AUTO,
    parent: "phaser-example",
    width: 1280,
    height: 900,
    scene: [
        Game
    ]
};

const game = new Phaser.Game(config);
import { WarScene } from "./WarScene";

const config: GameConfig = {
    title: "The Last Turrent",
    parent: "game",
    type: Phaser.AUTO,
    width: window.innerWidth * window.devicePixelRatio,
    height: window.innerHeight * window.devicePixelRatio,
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 500 },
        debug: false
      }
    },
    scene: [WarScene],
};

export default config;


import 'phaser';
import config from './config';



export class Game extends Phaser.Game{
  constructor(config: GameConfig){
    super(config);
  }
}


window.onload = () => {
  var game = new Game(config);
};






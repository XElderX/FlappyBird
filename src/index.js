

import Phaser from 'phaser';
import PlayScene from './scenes/PlayScene';

const config = {
  //WebGL (Web graphics library) JS API for rendering 2D and 3D graphics
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    //Arcade physics plugin, manages physics simulation
    default: 'arcade',
    arcade: {
      // gravity: { y: 400 },
      debug: true,
    }
  },
  scene: [PlayScene]
}

const VELOCITY = 200;
const PIPES_TO_RENDER = 4;

let bird = null;
let pipes = null;

let pipeHorizontalDistance = 0;

const pipeVerticalDistanceRange = [150, 250];
const pipeHorizontalDistanceRange = [350, 500];

const flapVelocity = 250;
const initialBirdPosition = { x: config.width * 0.1, y: config.height / 2 }

//loading assets, such as images, musics, animating and etc
function preload() {
  //this context - scene
  //contains functions and properties we can use
  this.load.image('sky', 'assets/sky.png');
  this.load.image('bird', 'assets/bird.png');
  this.load.image('pipe', 'assets/pipe.png');
}

// initalizing instances
function create() {
  this.add.image(0, 0, 'sky').setOrigin(0, 0);
  bird = this.physics.add.sprite(initialBirdPosition.x, initialBirdPosition.y, 'bird').setOrigin(0);
  bird.body.gravity.y = 400;

  pipes = this.physics.add.group();

  for (let index = 0; index < PIPES_TO_RENDER; index++) {
    const upperPipe = pipes.create(0, 0, 'pipe').setOrigin(0, 1);
    const lowerPipe = pipes.create(0, 0, 'pipe').setOrigin(0);

    placePipe(upperPipe, lowerPipe);
  }

  pipes.setVelocityX(-200);
  this.input.on('pointerdown', flap)
  this.input.keyboard.on('keydown_SPACE', flap)
}

function update(time, delta) {

  if (bird.y > config.height || bird.y < 0 - (bird.height + 15)) {
    // alert("you have lost");
    restartBirdPosition();
  }
  recyclePipes()

}
function placePipe(uPipe, lPipe) {
  const rightMostX = getRightMostPipe();
  const pipeVerticalDistance = Phaser.Math.Between(pipeVerticalDistanceRange[0], pipeVerticalDistanceRange[1]);
  const pipeVerticalPosition = Phaser.Math.Between(0 + 20, config.height - 20 - pipeVerticalDistance);
  const pipeHorizontalDistance = Phaser.Math.Between(...pipeHorizontalDistanceRange);

  uPipe.x = rightMostX + pipeHorizontalDistance;
  uPipe.y = pipeVerticalPosition;

  lPipe.x = uPipe.x;
  lPipe.y = uPipe.y + pipeVerticalDistance;
}
function recyclePipes() {
const tempPipes = [];
pipes.getChildren().forEach(pipe => {
  if (pipe.getBounds().right <= 0) {
    tempPipes.push(pipe)
    if (tempPipes.length === 2) {
      placePipe(...tempPipes)
      
    }
    //recycle pipe
    //get here upper and lower that are out of bound
  }
})
}

function getRightMostPipe() {
  let rightMostX = 0;
  pipes.getChildren().forEach(function (pipe) {

    rightMostX = Math.max(pipe.x, rightMostX);
  })

  return rightMostX;
}

function restartBirdPosition() {
  bird.x = initialBirdPosition.x;
  bird.y = initialBirdPosition.y;
  bird.body.velocity.y = 0;
}

function flap() {
  bird.body.velocity.y = -flapVelocity;
}
new Phaser.Game(config);

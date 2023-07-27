

import Phaser from 'phaser';
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
  scene: {
    preload,
    create,
    update
  }
}
let count = 0;
const VELOCITY = 200;
const PIPES_TO_RENDER = 4;

let bird = null;

let pipeHorizontalDistance = 0;

let pipeVerticalDistanceRange = [150, 250];
let pipeVerticalDistance = Phaser.Math.Between(pipeVerticalDistanceRange[0], pipeVerticalDistanceRange[1]);
let pipeVerticalPosition = Phaser.Math.Between(0 + 20, config.height - 20 - pipeVerticalDistance);

const flapVelocity = 250;
let totalDelta = null;


//loading assets, such as images, musics, animating and etc
function preload() {
  //this context - scene
  //contains functions and properties we can use
  this.load.image('sky', 'assets/sky.png');
  this.load.image('bird', 'assets/bird.png');
  this.load.image('pipe', 'assets/pipe.png');
}

const initialBirdPosition = { x: config.width * 0.1, y: config.height / 2 }
// initalizing instances
function create() {
  this.add.image(0, 0, 'sky').setOrigin(0, 0);
  bird = this.physics.add.sprite(initialBirdPosition.x, initialBirdPosition.y, 'bird').setOrigin(0);
  bird.body.gravity.y = 400;

  for (let index = 0; index < PIPES_TO_RENDER; index++) {
    const upperPipe = this.physics.add.sprite(0, 0, 'pipe').setOrigin(0, 1);
    const lowerPipe = this.physics.add.sprite(0, 0, 'pipe').setOrigin(0);

    placePipe(upperPipe, lowerPipe);
  }

  this.input.on('pointerdown', flap)
  this.input.keyboard.on('keydown_SPACE', flap)
}

function update(time, delta) {

  if (bird.y > config.height || bird.y < 0 - (bird.height + 15)) {
    // alert("you have lost");
    count++
    console.log(count);
    restartBirdPosition();
  }

}
function placePipe(uPipe, lPipe)
{
  pipeHorizontalDistance += 400
  let pipeVerticalDistance = Phaser.Math.Between(pipeVerticalDistanceRange[0], pipeVerticalDistanceRange[1]);
  let pipeVerticalPosition = Phaser.Math.Between(0 + 20, config.height - 20 - pipeVerticalDistance);

  // upperPipe = this.physics.add.sprite(pipeHorizontalDistance, pipeVerticalPosition, 'pipe').setOrigin(0, 1);
  // lowerPipe = this.physics.add.sprite(upperPipe.x, upperPipe.y + pipeVerticalDistance, 'pipe').setOrigin(0);

  uPipe.x = pipeHorizontalDistance;
  uPipe.y = pipeVerticalPosition;

  lPipe.x = uPipe.x;
  lPipe.y = uPipe.y + pipeVerticalDistance;

  lPipe.body.velocity.x = -200;
  uPipe.body.velocity.x = -200;
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

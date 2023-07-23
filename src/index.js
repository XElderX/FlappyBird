

import Phaser from 'phaser';
const config = {
  //WebGL (Web graphics library) JS API for rendering 2D and 3D graphics
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    //Arcade physics plugin, manages physics simulation
    default: 'arcade'
  },
  scene: {
    preload,
    create,
    // update: update
  }
}
//loading assets, such as images, musics, animating and etc
function preload() {
  //this context - scene
  //contains functions and properties we can use
  this.load.image('sky', 'assets/sky.png');
  debugger
}

// initalizing instances
function create() {
  //x
  //y
  //key of the image
  this.add.image(0, 0, 'sky').setOrigin(0,0);
  debugger
}
new Phaser.Game(config);

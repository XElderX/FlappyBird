
import Phaser from 'phaser';

const PIPES_TO_RENDER = 4;

class PlayScene extends Phaser.Scene {
    constructor(config) {
        super('PlayScene');
        this.config = config

        this.bird = null;
        this.pipes = null;

        this.pipeHorizontalDistance = 0;
        this.pipeVerticalDistanceRange = [150, 250];
        this.pipeHorizontalDistanceRange = [350, 500];

        this.VELOCITY = 200;
        this.flapVelocity = 250;
    }
    preload() {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('bird', 'assets/bird.png');
        this.load.image('pipe', 'assets/pipe.png');
    }
    create() {
        this.createBG();
        this.createBird();
        this.createPipes();
        this.createColiders();
        this.handleInputs();
    }

    update() {
        this.checkGameStatus();
        this.recyclePipes()
    }

    createBG() {
        this.add.image(0, 0, 'sky').setOrigin(0);
    }

    createBird() {
        this.bird = this.physics.add.sprite(this.config.startPosition.x, this.config.startPosition.y, 'bird').setOrigin(0);
        this.bird.body.gravity.y = 320;
        this.bird.setCollideWorldBounds(true);
    }

    createPipes() {
        this.pipes = this.physics.add.group();

        for (let index = 0; index < PIPES_TO_RENDER; index++) {
            const upperPipe = this.pipes.create(0, 0, 'pipe')
                .setImmovable(true)
                .setOrigin(0, 1);
            const lowerPipe = this.pipes.create(0, 0, 'pipe')
                .setImmovable(true)
                .setOrigin(0);

            this.placePipe(upperPipe, lowerPipe);
        }

        this.pipes.setVelocityX(-200);
    }

    createColiders() {
        this.physics.add.collider(this.bird, this.pipes, this.gameOver, null, this);
    }

    handleInputs() {
        this.input.on('pointerdown', this.flap, this)
        this.input.keyboard.on('keydown_SPACE', this.flap, this)
    }

    checkGameStatus() {
        if (this.bird.getBounds().bottom >= this.config.height || this.bird.y <= 0) {
            this.gameOver();
            // alert("you have lost");
        }
    }

    placePipe(uPipe, lPipe) {
        const rightMostX = this.getRightMostPipe();
        const pipeVerticalDistance = Phaser.Math.Between(this.pipeVerticalDistanceRange[0], this.pipeVerticalDistanceRange[1]);
        const pipeVerticalPosition = Phaser.Math.Between(0 + 20, this.config.height - 20 - pipeVerticalDistance);
        const pipeHorizontalDistance = Phaser.Math.Between(...this.pipeHorizontalDistanceRange);

        uPipe.x = rightMostX + pipeHorizontalDistance;
        uPipe.y = pipeVerticalPosition;

        lPipe.x = uPipe.x;
        lPipe.y = uPipe.y + pipeVerticalDistance;
    }

    recyclePipes() {
        const tempPipes = [];
        this.pipes.getChildren().forEach(pipe => {
            if (pipe.getBounds().right <= 0) {
                tempPipes.push(pipe)
                if (tempPipes.length === 2) {
                    this.placePipe(...tempPipes)
                }
            }
        })
    }

    getRightMostPipe() {
        let rightMostX = 0;
        this.pipes.getChildren().forEach(function (pipe) {
            rightMostX = Math.max(pipe.x, rightMostX);
        })

        return rightMostX;
    }

    gameOver() {

        this.physics.pause();
        this.bird.setTint(0x8b008b);
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.scene.restart();
            },
            loop: false
        })
    }

    flap() {
        this.bird.body.velocity.y = -this.flapVelocity;
    }

}
export default PlayScene;


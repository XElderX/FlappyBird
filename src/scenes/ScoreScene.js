
import BaseScene from './BaseScene';


class ScoreScene extends BaseScene {

    constructor(config) {
        super('ScoreScene', config);
    }

    create() {
        super.create();
        this.createScore();
    }

    createScore() {
        const bestScore = localStorage.getItem('bestScore');
        this.add.text(...this.screenCenter, `Best Score: ${bestScore || 0}`, this.fontOption)
            .setOrigin(0.5);
    }
}

export default ScoreScene;
const ScoreInterface = require("../interfaces/ScoreInterface");

class BirdScore extends ScoreInterface {

    calculate(post, profile) {

        if (!profile?.birds) {
            return 0;
        }

        const raw = profile.birds[post.birdName] || 0;

        return this.normalize(raw, 20);

    }

}

module.exports = BirdScore;
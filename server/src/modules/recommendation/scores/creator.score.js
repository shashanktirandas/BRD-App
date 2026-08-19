const ScoreInterface = require("../interfaces/ScoreInterface");

class CreatorScore extends ScoreInterface {

    calculate(post, profile) {

        if (!profile?.creators) {
            return 0;
        }

        const raw =
            profile.creators[String(post.creator)] || 0;

        return this.normalize(raw, 30);

    }

}

module.exports = CreatorScore;
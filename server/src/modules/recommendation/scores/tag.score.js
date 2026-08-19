const ScoreInterface = require("../interfaces/ScoreInterface");

class TagScore extends ScoreInterface {

    calculate(post, profile) {

        if (!profile?.tags || !post.tags?.length) {
            return 0;
        }

        let raw = 0;

        for (const tag of post.tags) {
            raw += profile.tags[tag] || 0;
        }

        return this.normalize(raw, 50);

    }

}

module.exports = TagScore;
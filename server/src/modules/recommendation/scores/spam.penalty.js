const ScoreInterface = require("../interfaces/ScoreInterface");

class SpamPenalty extends ScoreInterface {

    calculate(post, profile) {
        return 0;
    }

}

module.exports = SpamPenalty;

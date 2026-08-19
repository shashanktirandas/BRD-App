const ScoreInterface = require("../interfaces/ScoreInterface");

class AlreadyLikedPenalty extends ScoreInterface {

    calculate(post, profile) {
        return 0;
    }

}

module.exports = AlreadyLikedPenalty;

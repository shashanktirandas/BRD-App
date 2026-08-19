const ScoreInterface = require("../interfaces/ScoreInterface");

class AlreadyBookmarkedPenalty extends ScoreInterface {

    calculate(post, profile) {
        return 0;
    }

}

module.exports = AlreadyBookmarkedPenalty;

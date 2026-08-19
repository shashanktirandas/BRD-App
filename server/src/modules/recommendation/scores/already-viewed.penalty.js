const ScoreInterface = require("../interfaces/ScoreInterface");

class AlreadyViewedPenalty extends ScoreInterface {

    calculate(post, profile) {
        return 0;
    }

}

module.exports = AlreadyViewedPenalty;

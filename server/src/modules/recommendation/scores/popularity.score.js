const ScoreInterface = require("../interfaces/ScoreInterface");

class PopularityScore extends ScoreInterface {

    calculate(post, profile) {
        return 0;
    }

}

module.exports = PopularityScore;

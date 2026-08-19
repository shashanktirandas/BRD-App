const ScoreInterface = require("../interfaces/ScoreInterface");

class DiversityBonus extends ScoreInterface {

    calculate(post, profile) {
        return 0;
    }

}

module.exports = DiversityBonus;

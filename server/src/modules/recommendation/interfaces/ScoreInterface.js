class ScoreInterface {

    constructor(weight = 1) {
        this.weight = weight;
    }

    calculate(post, profile) {
        throw new Error("calculate() must be implemented.");
    }

    normalize(value, max = 1) {

        if (max <= 0) {
            return 0;
        }

        return Math.min(value / max, 1);

    }

}

module.exports = ScoreInterface;
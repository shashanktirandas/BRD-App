const ScoreInterface =
    require("../interfaces/ScoreInterface");

class FreshnessScore extends ScoreInterface {

    calculate(post) {

        if (!post?.createdAt) {
            return 0;
        }

        const createdAt =
            new Date(post.createdAt).getTime();

        const now =
            Date.now();

        const ageHours =
            Math.max(
                0,
                (now - createdAt) /
                (1000 * 60 * 60)
            );

        /*
         * Freshness decay:
         *
         * 0 hours   → 10
         * 12 hours  → ~7.07
         * 24 hours  → 5
         * 48 hours  → 2.5
         * 72 hours  → 1.25
         *
         * Older posts gradually approach 0.
         */

        const score =
            10 *
            Math.pow(
                0.5,
                ageHours / 24
            );

        return Number(
            score.toFixed(2)
        );

    }

}

module.exports = FreshnessScore;
const strategies =
    require("../scores");

const RecommendationWeights =
    require("../config/recommendation.weights");

const ExposurePenalty =
    require("../scores/ExposurePenalty");

const exposurePenalty =
    new ExposurePenalty();

class ScoreEngineService {

    score(post, profile, context = {}) {

        let baseTotal = 0;

        const breakdown = {};

        /*
         * Normal recommendation strategies.
         *
         * These produce additive relevance scores.
         */

        for (const strategy of strategies) {

            /*
             * ExposurePenalty is a reranking multiplier,
             * not an additive score.
             */

            if (
                strategy.constructor.name ===
                "ExposurePenalty"
            ) {
                continue;
            }

            const featureScore =
                strategy.calculate(
                    post,
                    profile,
                    context
                );

            const strategyName =
                strategy.constructor.name;

            const weight =
                RecommendationWeights.ranking[
                    strategyName
                        .replace("Score", "")
                        .charAt(0)
                        .toLowerCase() +
                    strategyName
                        .replace("Score", "")
                        .slice(1)
                ] || 1;

            const weighted =
                featureScore * weight;

            breakdown[strategyName] =
                weighted;

            baseTotal += weighted;

        }

        /*
         * Exposure is a multiplicative reranking factor.
         */

        const exposureMultiplier =
                exposurePenalty.calculate(
                    post,
                    context
                );
        
        const finalTotal =
            baseTotal *
            exposureMultiplier;

        breakdown.ExposureMultiplier =
            exposureMultiplier;

        breakdown.BaseScore =
            baseTotal;

        breakdown.FinalScore =
            finalTotal;

        return {

            total: finalTotal,

            breakdown

        };

    }

}

module.exports =
    new ScoreEngineService();
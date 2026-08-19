const {
    calculateFreshnessBoost
} = require("./searchFreshnessScorer");


/*
|--------------------------------------------------------------------------
| FINAL SEARCH RANKER
|--------------------------------------------------------------------------
|
| Combines all ranking signals.
|
| Relevance       → primary
| Personalization → secondary
| Engagement      → secondary
| Freshness       → small secondary signal
|
*/


const calculateFinalPostScore = ({
    searchRelevanceScore = 0,
    personalizationBoost = 0,
    engagementScore = 0,
    createdAt
}) => {

    const freshnessScore =
        calculateFreshnessBoost(
            createdAt
        );


    const finalScore =
        Number(searchRelevanceScore || 0) +
        Number(personalizationBoost || 0) +
        Number(engagementScore || 0) +
        freshnessScore;


    return {

        finalScore:
            Math.round(
                finalScore * 100
            ) / 100,

        freshnessScore
    };
};


const calculateFinalCreatorScore = ({
    searchRelevanceScore = 0,
    personalizationBoost = 0
}) => {

    const finalScore =
        Number(searchRelevanceScore || 0) +
        Number(personalizationBoost || 0);


    return {
        finalScore:
            Math.round(
                finalScore * 100
            ) / 100
    };
};


const calculateFinalBirdScore = ({
    searchRelevanceScore = 0,
    personalizationBoost = 0
}) => {

    const finalScore =
        Number(searchRelevanceScore || 0) +
        Number(personalizationBoost || 0);


    return {
        finalScore:
            Math.round(
                finalScore * 100
            ) / 100
    };
};


const sortBySearchScore = (
    items
) => {

    return items.sort(
        (a, b) =>
            b.searchScore -
            a.searchScore
    );
};


module.exports = {

    calculateFinalPostScore,

    calculateFinalCreatorScore,

    calculateFinalBirdScore,

    sortBySearchScore
};
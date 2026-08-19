/*
|--------------------------------------------------------------------------
| SEARCH FRESHNESS SCORER
|--------------------------------------------------------------------------
|
| Freshness is a small secondary ranking signal.
|
| It should help newer content when relevance is similar,
| but it must never overpower search relevance.
|
*/


const MAX_FRESHNESS_BOOST = 5;


/*
|--------------------------------------------------------------------------
| Calculate freshness
|--------------------------------------------------------------------------
|
| Newer posts receive a higher score.
|
| We use exponential decay so that:
|
| very recent → strong freshness
| older        → gradually smaller freshness
|
*/

const calculateFreshnessBoost = (
    createdAt
) => {

    if (!createdAt) {
        return 0;
    }


    const createdTime =
        new Date(createdAt).getTime();


    if (
        Number.isNaN(createdTime)
    ) {
        return 0;
    }


    const now =
        Date.now();


    const ageMilliseconds =
        Math.max(
            0,
            now - createdTime
        );


    const ageDays =
        ageMilliseconds /
        (
            1000 *
            60 *
            60 *
            24
        );


    /*
     * Half-life:
     *
     * Every 30 days, freshness influence
     * decreases by roughly half.
     */

    const HALF_LIFE_DAYS = 30;


    const freshness =
        Math.pow(
            0.5,
            ageDays / HALF_LIFE_DAYS
        );


    const boost =
        freshness *
        MAX_FRESHNESS_BOOST;


    return Math.round(
        boost * 100
    ) / 100;
};


module.exports = {
    calculateFreshnessBoost
};
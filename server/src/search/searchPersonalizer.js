const RecommendationProfile = require("../modules/recommendation/model/RecommendationProfile");


const normalize = (value) => {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .toLowerCase()
        .trim();
};


const getMapEntries = (map) => {

    if (!map) {
        return [];
    }

    if (map instanceof Map) {
        return Array.from(map.entries());
    }

    return Object.entries(map);
};


const findCaseInsensitiveMapValue = (
    map,
    value
) => {

    const searchValue = normalize(value);

    if (!searchValue) {
        return 0;
    }

    const entries = getMapEntries(map);

    for (const [key, score] of entries) {

        if (normalize(key) === searchValue) {
            return Number(score) || 0;
        }
    }

    return 0;
};


const getMapValue = (
    map,
    key
) => {

    if (!map || !key) {
        return 0;
    }

    const keyString = key.toString();

    const entries = getMapEntries(map);

    for (const [storedKey, score] of entries) {

        if (storedKey.toString() === keyString) {
            return Number(score) || 0;
        }
    }

    return 0;
};


/*
|--------------------------------------------------------------------------
| POST PERSONALIZATION
|--------------------------------------------------------------------------
|
| Personalization is a secondary signal.
|
| Search relevance must remain dominant.
|
| Signal limits:
|
| Bird       → max 30
| Creator    → max 15
| Tags       → max 10
| Location   → max 5
|
| Maximum total personalization = 50
|--------------------------------------------------------------------------
*/

const getPostPersonalizationDetails = (
    post,
    profile
) => {

    if (!post || !profile) {

        return {
            bird: 0,
            creator: 0,
            tags: 0,
            location: 0,
            total: 0
        };
    }


    /*
     * --------------------------------------------------------------
     * 1. BIRD INTEREST
     * --------------------------------------------------------------
     */

    let birdRaw = 0;

    if (post.birdName) {

        birdRaw =
            findCaseInsensitiveMapValue(
                profile.birds,
                post.birdName
            );
    }

    const bird =
        Math.min(
            birdRaw * 1.0,
            30
        );


    /*
     * --------------------------------------------------------------
     * 2. CREATOR INTEREST
     * --------------------------------------------------------------
     */

    let creatorRaw = 0;

    if (post.creator) {

        const creatorId =
            post.creator._id
                ? post.creator._id.toString()
                : post.creator.toString();

        creatorRaw =
            getMapValue(
                profile.creators,
                creatorId
            );
    }

    const creator =
        Math.min(
            creatorRaw * 0.5,
            15
        );


    /*
     * --------------------------------------------------------------
     * 3. TAG INTEREST
     * --------------------------------------------------------------
     *
     * Do NOT sum every tag.
     *
     * Instead:
     *
     *     find the strongest matching tag
     *
     * This prevents 5 weak tag matches from
     * overpowering one strong bird/creator signal.
     */

    let strongestTagRaw = 0;

    if (Array.isArray(post.tags)) {

        for (const tag of post.tags) {

            const tagScore =
                findCaseInsensitiveMapValue(
                    profile.tags,
                    tag
                );

            strongestTagRaw =
                Math.max(
                    strongestTagRaw,
                    tagScore
                );
        }
    }

    const tags =
        Math.min(
            strongestTagRaw * 0.4,
            10
        );


    /*
     * --------------------------------------------------------------
     * 4. LOCATION INTEREST
     * --------------------------------------------------------------
     *
     * We consider the strongest matching
     * location rather than summing country +
     * state + city.
     */

    let strongestLocationRaw = 0;

    const locations = [
        post.country,
        post.state,
        post.city
    ];

    for (const location of locations) {

        if (!location) {
            continue;
        }

        const locationScore =
            findCaseInsensitiveMapValue(
                profile.locations,
                location
            );

        strongestLocationRaw =
            Math.max(
                strongestLocationRaw,
                locationScore
            );
    }

    const location =
        Math.min(
            strongestLocationRaw * 0.3,
            5
        );


    /*
     * --------------------------------------------------------------
     * FINAL PERSONALIZATION
     * --------------------------------------------------------------
     */

    const total =
        Math.min(
            Math.round(
                (
                    bird +
                    creator +
                    tags +
                    location
                ) * 100
            ) / 100,
            50
        );


    return {

        bird:
            Math.round(
                bird * 100
            ) / 100,

        creator:
            Math.round(
                creator * 100
            ) / 100,

        tags:
            Math.round(
                tags * 100
            ) / 100,

        location:
            Math.round(
                location * 100
            ) / 100,

        total
    };
};


/*
|--------------------------------------------------------------------------
| CREATOR PERSONALIZATION
|--------------------------------------------------------------------------
*/

const getCreatorPersonalizationDetails = (
    creator,
    profile
) => {

    if (!creator || !profile) {

        return {
            creator: 0,
            location: 0,
            total: 0
        };
    }


    let creatorRaw = 0;

    if (creator._id) {

        creatorRaw =
            getMapValue(
                profile.creators,
                creator._id
            );
    }


    const creatorInterest =
        Math.min(
            creatorRaw * 1.0,
            40
        );


    let strongestLocationRaw = 0;

    const locations = [
        creator.country,
        creator.state,
        creator.city
    ];

    for (const location of locations) {

        if (!location) {
            continue;
        }

        const locationScore =
            findCaseInsensitiveMapValue(
                profile.locations,
                location
            );

        strongestLocationRaw =
            Math.max(
                strongestLocationRaw,
                locationScore
            );
    }


    const location =
        Math.min(
            strongestLocationRaw * 0.3,
            10
        );


    const total =
        Math.min(
            Math.round(
                (
                    creatorInterest +
                    location
                ) * 100
            ) / 100,
            50
        );


    return {

        creator:
            Math.round(
                creatorInterest * 100
            ) / 100,

        location:
            Math.round(
                location * 100
            ) / 100,

        total
    };
};


/*
|--------------------------------------------------------------------------
| BIRD PERSONALIZATION
|--------------------------------------------------------------------------
*/

const getBirdPersonalizationDetails = (
    bird,
    profile
) => {

    if (!bird || !profile) {

        return {
            bird: 0,
            total: 0
        };
    }


    let birdRaw = 0;

    if (bird.birdName) {

        birdRaw =
            findCaseInsensitiveMapValue(
                profile.birds,
                bird.birdName
            );
    }


    const birdBoost =
        Math.min(
            birdRaw * 1.0,
            40
        );


    return {

        bird:
            Math.round(
                birdBoost * 100
            ) / 100,

        total:
            Math.round(
                birdBoost * 100
            ) / 100
    };
};


/*
|--------------------------------------------------------------------------
| LOAD USER RECOMMENDATION PROFILE
|--------------------------------------------------------------------------
*/

const getUserRecommendationProfile = async (
    userId
) => {

    if (!userId) {
        return null;
    }

    return RecommendationProfile
        .findOne({
            user: userId
        })
        .lean();
};


module.exports = {

    getUserRecommendationProfile,

    getPostPersonalizationDetails,

    getCreatorPersonalizationDetails,

    getBirdPersonalizationDetails
};
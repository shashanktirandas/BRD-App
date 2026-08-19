const normalizeSearchQuery = require("./searchNormalizer");

const searchPosts = require("./candidate/postSearch");
const searchCreators = require("./candidate/creatorSearch");
const searchBirds = require("./candidate/birdSearch");
const {
    mixSearchResults
} = require("./searchFeedMixer");

const {
    scorePost,
    scoreCreator,
    scoreBird
} = require("./searchScorer");

const {
    getPostEngagement,
    calculateEngagementBoost
} = require("./searchEngagementScorer");

const {
    calculateFinalPostScore,
    calculateFinalCreatorScore,
    calculateFinalBirdScore,
    sortBySearchScore
} = require("./finalRanker");

const {
    getUserRecommendationProfile,
    getPostPersonalizationDetails,
    getCreatorPersonalizationDetails,
    getBirdPersonalizationDetails
} = require("./searchPersonalizer");






const searchEngine = async ({
    query,
    userId = null,
    page = 1,
    limit = 20,
    type = "all"
}) => {

    const normalized = normalizeSearchQuery(query);

    if (!normalized.normalized) {
        return {
            query: "",
            normalizedQuery: "",
            userId,
            type,
            results: {
                posts: [],
                creators: [],
                birds: []
            },
            counts: {
                posts: 0,
                creators: 0,
                birds: 0
            },
            pagination: {
                page: Number(page) || 1,
                limit: Number(limit) || 20,
                hasMore: false
            }
        };
    }


    /*
    |--------------------------------------------------------------------------
    | 1. RETRIEVE CANDIDATES
    |--------------------------------------------------------------------------
    */

    const candidateLimit = 50;

    const searchType =
        ["all", "posts", "creators", "birds"].includes(type)
            ? type
            : "all";

    console.log("SEARCH DEBUG: before candidate search");
    const [
            posts,
            creators,
            birds
        ] = await Promise.all([

            searchType === "all" ||
            searchType === "posts"

                ? searchPosts(
                    normalized.normalized,
                    candidateLimit
                )

                : Promise.resolve([]),


            searchType === "all" ||
            searchType === "creators"

                ? searchCreators(
                    normalized.normalized,
                    candidateLimit
                )

                : Promise.resolve([]),


            searchType === "all" ||
            searchType === "birds"

                ? searchBirds(
                    normalized.normalized,
                    20
                )

                : Promise.resolve([])
        ]);
    console.log("SEARCH DEBUG: candidates retrieved", {
        posts: posts.length,
        creators: creators.length,
        birds: birds.length
    });
    const postIds =
        posts.map(
            post => post._id
        );


    console.log("SEARCH DEBUG: before engagement");

    const engagementMap =
        await getPostEngagement(
            postIds
        );

    console.log("SEARCH DEBUG: engagement retrieved");
    console.log("SEARCH DEBUG: before recommendation profile");

    const recommendationProfile =
        await getUserRecommendationProfile(userId);

    console.log("SEARCH DEBUG: recommendation profile retrieved");

    /*
    |--------------------------------------------------------------------------
    | 2. SCORE CANDIDATES
    |--------------------------------------------------------------------------
    */
    console.log("SEARCH DEBUG: before post scoring");
    const scoredPosts = posts.map(post => {

        /*
        * --------------------------------------------------------------
        * SEARCH RELEVANCE
        * --------------------------------------------------------------
        */

        const searchRelevanceScore =
            scorePost(
                post,
                normalized.normalized
            );


        /*
        * --------------------------------------------------------------
        * PERSONALIZATION
        * --------------------------------------------------------------
        */

        const personalization =
            getPostPersonalizationDetails(
                post,
                recommendationProfile
            );


        /*
        * --------------------------------------------------------------
        * ENGAGEMENT
        * --------------------------------------------------------------
        */

        const engagement =
            engagementMap.get(
                post._id.toString()
            ) || {

                likes: 0,
                bookmarks: 0,
                comments: 0,
                shares: 0,
                views: 0,
                opens: 0
            };


        const engagementScore =
            calculateEngagementBoost(
                engagement
            );


        /*
        * --------------------------------------------------------------
        * FINAL SCORE
        * --------------------------------------------------------------
        */

        const finalRanking =
            calculateFinalPostScore({

                searchRelevanceScore,

                personalizationBoost:
                    personalization.total,

                engagementScore,

                createdAt:
                    post.createdAt
            });


        const searchScore =
            finalRanking.finalScore;


        return {

            ...post,

            searchScore,

            searchRelevanceScore,

            personalizationBoost:
                personalization.total,

            personalizationDetails:
                personalization,

            engagementScore,

            engagement,
            freshnessScore:
                finalRanking.freshnessScore,
        };
    });
    console.log("SEARCH DEBUG: post scoring completed", {
        count: scoredPosts.length
    });

    console.log("SEARCH DEBUG: before creator scoring");
    const scoredCreators = creators.map(creator => {

        const searchRelevanceScore =
            scoreCreator(
                creator,
                normalized.normalized
            );

        const personalization =
            getCreatorPersonalizationDetails(
                creator,
                recommendationProfile
            );
        const finalRanking =
            calculateFinalCreatorScore({

                searchRelevanceScore,

                personalizationBoost:
                    personalization.total
            });

        return {

            ...creator,

            searchScore:
                finalRanking.finalScore,

            searchRelevanceScore,

            personalizationBoost:
                personalization.total,

            personalizationDetails:
                personalization
        };
    });
    console.log("SEARCH DEBUG: creator scoring completed", {
        count: scoredCreators.length
    });
    console.log("SEARCH DEBUG: before bird scoring");
    const scoredBirds = birds.map(bird => {

    const searchRelevanceScore =
            scoreBird(
                bird,
                normalized.normalized
            );

        const personalization =
            getBirdPersonalizationDetails(
                bird,
                recommendationProfile
            );
        const finalRanking =
            calculateFinalBirdScore({

                searchRelevanceScore,

                personalizationBoost:
                    personalization.total
            });
        return {

            ...bird,

            searchScore:
                finalRanking.finalScore,

            searchRelevanceScore,

            personalizationBoost:
                personalization.total,

            personalizationDetails:
                personalization
        };
    });
    console.log("SEARCH DEBUG: bird scoring completed", {
        count: scoredBirds.length
    });


    /*
    |--------------------------------------------------------------------------
    | 3. RANK
    |--------------------------------------------------------------------------
    */
    console.log("SEARCH DEBUG: before final ranking");
    const rankedPosts =
        sortBySearchScore(
            scoredPosts
        );


    const rankedCreators =
        sortBySearchScore(
            scoredCreators
        );


    const rankedBirds =
        sortBySearchScore(
            scoredBirds
        );
    console.log("SEARCH DEBUG: final ranking completed", {
        posts: rankedPosts.length,
        creators: rankedCreators.length,
        birds: rankedBirds.length
    });

    /*
    |--------------------------------------------------------------------------
    | 4. PAGINATION
    |--------------------------------------------------------------------------
    */

    const currentPage = Math.max(
        1,
        Number(page) || 1
    );

    const currentLimit = Math.max(
        1,
        Number(limit) || 20
    );

    const startIndex =
        (currentPage - 1) * currentLimit;


   /*
|--------------------------------------------------------------------------
| PAGINATION INPUT
|--------------------------------------------------------------------------
*/

const allFeedItems = mixSearchResults({

    posts: rankedPosts,

    creators: rankedCreators,

    birds: rankedBirds

});


    /*
    |--------------------------------------------------------------------------
    | UNIFIED FEED PAGINATION
    |--------------------------------------------------------------------------
    */

    const feedStartIndex =
        (currentPage - 1) * currentLimit;

    const paginatedFeed =
        allFeedItems.slice(
            feedStartIndex,
            feedStartIndex + currentLimit
        );


    const hasMoreFeed =
        feedStartIndex + currentLimit <
        allFeedItems.length;
        
   



    /*
    |--------------------------------------------------------------------------
    | 5. RESPONSE
    |--------------------------------------------------------------------------
    */

    return {

        query: normalized.original,

        normalizedQuery: normalized.normalized,

        userId,

        type,

        results: {

            feed: paginatedFeed

        },

        counts: {

            totalFeedItems:
                allFeedItems.length,

            posts:
                rankedPosts.length,

            creators:
                rankedCreators.length,

            birds:
                rankedBirds.length

        },

        pagination: {

            page:
                currentPage,

            limit:
                currentLimit,

            hasMore:
                hasMoreFeed

        }
    };
};


module.exports = searchEngine;
const RecommendationWeights = Object.freeze({

    interaction: {

        VIEW: 1,
        OPEN: 2,

        LIKE: 10,
        UNLIKE: -10,

        BOOKMARK: 20,
        REMOVE_BOOKMARK: -20,

        COMMENT: 15,
        DELETE_COMMENT: -15,

        FOLLOW: 30,
        UNFOLLOW: -30,

        SEARCH: 5,
        SEARCH_CLICK: 3,

        TAG_CLICK: 4,
        BIRD_CLICK: 8,

        PROFILE_VISIT: 6

    },

    ranking: {

        bird: 100,

        creator: 40,

        followedCreator: 1,

        tag: 30,

        freshness: 20,

        popularity: 25,

        trending: 30,

        diversityBonus: 15,

        explorationBonus: 10

    },

    penalty: {

        alreadyViewed: -100,
        alreadyLiked: -100,
        alreadyBookmarked: -80,
        spam: -1000

    }

});

module.exports = RecommendationWeights;
const interactionRepository = require("../repository/interaction.repository");
const recommendationProfileService =require("./recommendation-profile.service");
const recommendationRepository = require("../repository/recommendation.repository");
const candidateEligibilityService =
    require("./candidate-eligibility.service");
const PhotographerProfile =
    require("../../../model/PhotographerProfile"); 

const HomeFeedDTO =require("../dto/HomeFeed.dto");
const interestBuilder = require("./interest-builder.service");
const candidateLoaderService = require("./candidate-loader.service");
const scoreEngineService = require("./score-engine.service");
const rankEngineService = require("./rank-engine.service");
const diversityEngineService =
require("./diversity-engine.service");
const { findFollowingByUserid } = require("../../../repository/post_repository");
const candidateRepository = require("../repository/candidate.repository");

const personalizedMenuService =
    require("./personalized-menu.service");

class RecommendationService {

    async rebuildProfile(userId) {

        return recommendationProfileService.rebuild(userId);

    }

    async getHomeFeed(
            userId,
            limit = 20,
            page = 1,
            excludePostIds = [],
            menuType = null,
            menuValue = null
        ) {

        let profile = await recommendationProfileService.get(userId);

        if (!profile) {

            profile = await recommendationProfileService.rebuild(userId);

        }

        // console.log(
        //             "RECOMMENDATION PROFILE:",
        //             JSON.stringify(profile, null, 2)
        //         );
        // console.log(
        //             profile ? "Using Cached Profile" : "Building Profile"
        //         );
        

        const candidatePoolSize =
            Math.max(
                page * limit * 3,
                30
            );
        const interactedPostIds =
            await interactionRepository.findInteractedPostIds(
                userId
            );
        // console.log(
        //     "INTERACTED POST COUNT:",
        //     interactedPostIds.length
        // );
        const profileData =
            await PhotographerProfile
                .findOne({
                    user: userId
                })
                .select("_id")
                .lean();

        const ownProfileId =
            profileData?._id?.toString() || null;

        // console.log(
        //     "OWN PROFILE ID:",
        //     ownProfileId
        // );
        const candidates = await candidateLoaderService.load({
            limit: candidatePoolSize,
            excludePostIds,
            interactedPostIds,
            ownProfileId
        });
    //     const candidates =
    // await candidateLoaderService.load(
    //     candidatePoolSize,
    //     excludePostIds,
    //     userId
    // );
        // console.log(
        //     "CANDIDATES:",
        //     candidates.length
        // );
        // console.log(
        //     "EXCLUDED POST COUNT:",
        //     excludePostIds.length
        // );
        let eligibleCandidates =
            await candidateEligibilityService.filter(
                candidates,
                {
                    userId,
                    ownProfileId
                }
            );

        // console.log(
        //     "ELIGIBLE CANDIDATES:",
        //     eligibleCandidates.length
        // );


        // --------------------------------------------------
        // FALLBACK
        // --------------------------------------------------

        if (eligibleCandidates.length < limit) {

            const fallbackNeeded =
                limit - eligibleCandidates.length;

            // console.log(
            //     "FALLBACK NEEDED:",
            //     fallbackNeeded
            // );

            const fallbackCandidates =
                await candidateRepository.getFallbackCandidates({
                    limit: fallbackNeeded,
                    excludePostIds: [
                        ...excludePostIds,
                        ...candidates.map(
                            post => post._id
                        )
                    ],
                    ownProfileId
                });

            // console.log(
            //     "FALLBACK CANDIDATES:",
            //     fallbackCandidates.length
            // );

            eligibleCandidates = [
                ...eligibleCandidates,
                ...fallbackCandidates
            ];

            // console.log(
            //     "FINAL CANDIDATE POOL:",
            //     eligibleCandidates.length
            // );
        }
        const interactions =
            await interactionRepository.findByUser(userId);

        

        const following =
            await findFollowingByUserid(userId);

        const followedCreators =
            following.map(
                follow => follow.creator.toString()
            );
        // console.log(
        //             "FOLLOWED CREATORS:",
        //             followedCreators
        //         );
        const scored =
            eligibleCandidates.map(post => {

                const result =
                    scoreEngineService.score(
                        post,
                        profile,
                        {
                            interactions,
                            followedCreators
                        }
                    );

                let menuBoost = 0;

                if (
                     menuType &&
                     menuValue
                ) {

                    if (
                         menuType === "tag" &&
                        Array.isArray(post.tags) &&
                        post.tags.includes(
                             menuValue
                        )
                    ) {
                        menuBoost = 100;
                    }

                    if (
                         menuType === "bird" &&
                        post.birdName ===
                             menuValue
                    ) {
                        menuBoost = 100;
                    }

                    if (
                         menuType === "creator" &&
                        post.creator?.toString() ===
                             menuValue
                    ) {
                        menuBoost = 100;
                    }
                }

                return {
                    post,
                    ...result,
                    total: result.total + menuBoost,
                    menuBoost
                };

            });

        // console.log(
        //     "SCORED CANDIDATES:",
        //     scored.length
        // );
        
        const ranked =
                scored.sort(
                    (a, b) => b.total - a.total
                );
        // console.log(
        //     "RECOMMENDATION SCORES:",
        //     scored.map(item => ({
        //         post: item.post._id?.toString(),
        //         bird: item.post.birdName,
        //         score: item.total,
        //         exploration:
        //             item.breakdown?.ExplorationBonus
        //     }))
        // );
        const diversified = [];
        const remaining = [...ranked];

        while (remaining.length > 0) {

            let selectedIndex = 0;

            // Prefer a different creator than the previous post
            if (diversified.length > 0) {

                const previousCreator =
                    diversified[diversified.length - 1]
                        .post
                        .creator
                        ?.toString();

                const differentCreatorIndex =
                    remaining.findIndex(item => {

                        const creatorId =
                            item.post.creator?.toString();

                        return creatorId !== previousCreator;
                    });

                if (differentCreatorIndex !== -1) {
                    selectedIndex = differentCreatorIndex;
                }
            }

            const selected =
                remaining.splice(selectedIndex, 1)[0];

            diversified.push(selected);
        }

        const allPosts =
            diversified.map(item => item.post);

        const posts =
            allPosts.slice(0, limit);

        // const hasMore =
        //     allPosts.length > limit;
        const hasMore = allPosts.length >= limit;
        return {
            posts,
            pagination: {
                page,
                limit,
                total: allPosts.length,
                hasMore
            }
        };
    }

    async getPersonalizedMenu(userId) {

        let profile =
            await recommendationProfileService.get(userId);

        if (!profile) {

            profile =
                await recommendationProfileService.rebuild(userId);

        }

        return personalizedMenuService.build(profile);
    }

}

module.exports = new RecommendationService();
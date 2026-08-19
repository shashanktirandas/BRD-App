const candidateRepository =
    require("../repository/candidate.repository");

const removeDuplicates =
    require("../utils/remove-duplicates");

class CandidateLoaderService {

    async load({
        limit = 100,
        excludePostIds = [],
        interactedPostIds = [],
        ownProfileId = null 
    } = {}) {

        limit = Number(limit);

        if (!Number.isFinite(limit) || limit <= 0) {
            limit = 100;
        }

        const latestLimit =
            Math.ceil(limit * 0.5);

        const explorationLimit =
            Math.ceil(limit * 0.2);

        const balancedLimit =
            Math.ceil(limit * 0.3);

        const latestPosts =
            await candidateRepository.getLatest({
                limit: latestLimit,
                excludePostIds,
                interactedPostIds,
                ownProfileId 
            });

        const explorationPosts =
            await candidateRepository.getExplorationCandidates({
                limit: explorationLimit,
                excludePostIds,
                interactedPostIds,
                ownProfileId
            });

        const balancedPosts =
            await candidateRepository.getCreatorBalancedCandidates({
                limit: balancedLimit,
                excludePostIds,
                interactedPostIds,
                ownProfileId 
            });
        // console.log("CANDIDATE LOADER LIMIT:", limit);
        // console.log("LATEST LIMIT:", latestLimit);
        // console.log("EXPLORATION LIMIT:", explorationLimit);
        // console.log("BALANCED LIMIT:", balancedLimit);
        return removeDuplicates([
            ...latestPosts,
            ...explorationPosts,
            ...balancedPosts
        ]);
    }
}

module.exports = new CandidateLoaderService();
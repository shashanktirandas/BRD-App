const PhotographerProfile =
    require("../../../model/PhotographerProfile");

class CandidateEligibilityService {

    async filter(candidates = [], context = {}) {

        if (!Array.isArray(candidates)) {
            return [];
        }

        const { userId } = context;

        let ownProfileId = null;

        if (userId) {

            const profile =
                await PhotographerProfile
                    .findOne({
                        user: userId
                    })
                    .select("_id")
                    .lean();

            ownProfileId =
                profile?._id?.toString() || null;
        }
        // console.log(
        //     "OWN PROFILE ID:",
        //     ownProfileId
        // );

        // console.log(
        //     "CANDIDATE CREATORS:",
        //     candidates.map(post => ({
        //         post: post._id?.toString(),
        //         creator: post.creator?.toString(),
        //         isOwn:
        //             ownProfileId &&
        //             post.creator?.toString() === ownProfileId
        //     }))
        // );
        return candidates.filter(post => {

            if (!post?._id) {
                return false;
            }

            /*
             * Don't recommend the user's own posts.
             */

            if (
                ownProfileId &&
                post.creator?.toString() === ownProfileId
            ) {
                return false;
            }

            return true;
        });

    }

}

module.exports =
    new CandidateEligibilityService();
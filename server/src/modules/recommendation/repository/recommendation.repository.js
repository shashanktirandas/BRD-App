const RecommendationProfile = require("../model/RecommendationProfile");

class RecommendationRepository {

    async findByUser(userId) {

    return RecommendationProfile
            .findOne({ user: userId })
            .lean();

    }

    async upsert(userId, profile) {

        return RecommendationProfile.findOneAndUpdate(

            { user: userId },

            profile,

            {
                upsert: true,
                returnDocument: "after"
            }

        );

    }

}

module.exports = new RecommendationRepository();
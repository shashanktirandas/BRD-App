const UserInteraction = require("../model/UserInteraction");

class InteractionRepository {

    async create(interaction) {
        return UserInteraction.create(interaction);
    }

    async createMany(interactions) {
        return UserInteraction.insertMany(interactions);
    }

    async findInteractedPostIds(userId) {

        return UserInteraction
            .find({
                user: userId,
                post: {
                    $ne: null
                }
            })
            .distinct("post");

    }
    
    async findByUser(userId, limit = 100) {

        return UserInteraction.find({
            user: userId
        })
            .populate({
                path: "post",
                select: "birdName tags creator"
            })
            .sort({
                createdAt: -1
            })
            .limit(limit);

    }

    async findByUserAndType(userId, interactionType, limit = 100) {
        return UserInteraction.find({
            user: userId,
            interactionType
        })
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();
    }

}

module.exports = new InteractionRepository();
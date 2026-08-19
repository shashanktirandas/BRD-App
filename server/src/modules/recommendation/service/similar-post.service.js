const similarPostRepository =
    require("../repository/similar-post.repository");
const postMenuService =
    require("./post-menu.service");

class SimilarPostService {

    score(post, sourcePost, menuSelection = {}) {

        let score = 0;

        // Same bird
        if (
            post.birdName &&
            sourcePost.birdName &&
            post.birdName === sourcePost.birdName
        ) {
            score += 50;
        }

        // Same scientific name
        if (
            post.scientificName &&
            sourcePost.scientificName &&
            post.scientificName === sourcePost.scientificName
        ) {
            score += 30;
        }

        // Shared tags
        const sourceTags =
            Array.isArray(sourcePost.tags)
                ? sourcePost.tags
                : [];

        const postTags =
            Array.isArray(post.tags)
                ? post.tags
                : [];

        const sharedTags =
            postTags.filter(tag =>
                sourceTags.includes(tag)
            );

        score += Math.min(
            sharedTags.length * 10,
            30
        );

        // Same creator
        if (
            post.creator &&
            sourcePost.creator &&
            post.creator.toString() ===
            sourcePost.creator.toString()
        ) {
            score += 10;
        }

        // --------------------------------
        // MENU SELECTION BONUS
        // --------------------------------

        const {
            type,
            value
        } = menuSelection;

        if (type === "tag") {

            if (
                Array.isArray(post.tags) &&
                post.tags.includes(value)
            ) {
                score += 50;
            }
        }

        if (type === "bird") {

            if (
                post.birdName === value
            ) {
                score += 50;
            }
        }

        if (type === "creator") {

            if (
                post.creator &&
                post.creator.toString() ===
                value
            ) {
                score += 50;
            }
        }

        return score;
    }

    async getSimilarPosts({
        postId,
        limit = 10,
        menuSelection = {}
    })  {

        const BirdPost =
            require("../../../model/BirdPost");

        const sourcePost =
            await BirdPost
                .findById(postId)
                .lean();
        const menu = postMenuService.build(sourcePost);
        if (!sourcePost) {
            return [];
        }

        const candidates =
            await similarPostRepository.getSimilarPosts({
                post: sourcePost,
                limit: 50
            });

        const scored = candidates.map(post => ({
            post,
            score: this.score(
                post,
                sourcePost,
                menuSelection
            )
        }));

        scored.sort(
            (a, b) => b.score - a.score
        );

        const posts = scored
                .slice(0, limit)
                .map(item => item.post);

        return {
            posts,
            menu
        };
    }
}

module.exports =
    new SimilarPostService();
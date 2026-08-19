class PostMenuService {

    build(post) {

        if (!post) {
            return {
                tags: [],
                birds: [],
                creators: []
            };
        }

        const tags =
            Array.isArray(post.tags)
                ? post.tags
                : [];

        const uniqueTags =
            [
                ...new Set(tags)
            ];

        const birds =
            post.birdName
                ? [post.birdName]
                : [];

        const creators =
            post.creator
                ? [post.creator.toString()]
                : [];

        return {
            tags: uniqueTags.slice(0, 10),
            birds,
            creators
        };
    }
}

module.exports =
    new PostMenuService();
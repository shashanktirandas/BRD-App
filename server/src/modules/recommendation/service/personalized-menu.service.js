class PersonalizedMenuService {

    build(profile) {

        if (!profile) {
            return {
                tags: ["Bird"],
                birds: [],
                creators: []
            };
        }

        const tags = Object.entries(
            profile.tags || {}
        );

        const sortedTags = tags
            .sort((a, b) => b[1] - a[1])
            .map(([tag]) => tag);

        // Bird should always be the first/default menu
        const finalTags = [
            "Bird",
            ...sortedTags.filter(
                tag => tag !== "Bird"
            )
        ];

        return {
            tags: finalTags.slice(0, 20),

            // Keep these empty for now.
            // We will introduce proper bird/creator
            // menu items later.
            birds: [],
            creators: []
        };
    }
}

module.exports =
    new PersonalizedMenuService();
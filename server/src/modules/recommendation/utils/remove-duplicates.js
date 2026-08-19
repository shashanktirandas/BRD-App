function removeDuplicates(posts = []) {

    const uniquePosts = new Map();

    for (const post of posts) {

        uniquePosts.set(post._id.toString(), post);

    }

    return [...uniquePosts.values()];

}

module.exports = removeDuplicates;
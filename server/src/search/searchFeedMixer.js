const mixSearchResults = ({
    posts = [],
    creators = [],
    birds = [],
    creatorInterval = 4,
    birdInterval = 8
}) => {

    const feed = [];

    let postIndex = 0;
    let creatorIndex = 0;
    let birdIndex = 0;

    let postsSinceCreator = 0;
    let postsSinceBird = 0;


    /*
    |--------------------------------------------------------------------------
    | Helper: add post
    |--------------------------------------------------------------------------
    */

    const addPost = () => {

        if (postIndex >= posts.length) {
            return false;
        }

        feed.push({
            type: "post",
            data: posts[postIndex]
        });

        postIndex++;

        postsSinceCreator++;
        postsSinceBird++;

        return true;
    };


    /*
    |--------------------------------------------------------------------------
    | Helper: add creator
    |--------------------------------------------------------------------------
    */

    const addCreator = () => {

        if (creatorIndex >= creators.length) {
            return false;
        }

        feed.push({
            type: "creator",
            data: creators[creatorIndex]
        });

        creatorIndex++;

        postsSinceCreator = 0;

        return true;
    };


    /*
    |--------------------------------------------------------------------------
    | Helper: add bird
    |--------------------------------------------------------------------------
    */

    const addBird = () => {

        if (birdIndex >= birds.length) {
            return false;
        }

        feed.push({
            type: "bird",
            data: birds[birdIndex]
        });

        birdIndex++;

        postsSinceBird = 0;

        return true;
    };


    /*
    |--------------------------------------------------------------------------
    | Main feed construction
    |--------------------------------------------------------------------------
    */

    while (
        postIndex < posts.length ||
        creatorIndex < creators.length ||
        birdIndex < birds.length
    ) {


        /*
        |--------------------------------------------------------------------------
        | Creator insertion
        |--------------------------------------------------------------------------
        |
        | Every 4 posts, try to insert a creator.
        |
        */

        if (
            creatorIndex < creators.length &&
            postsSinceCreator >= creatorInterval
        ) {

            addCreator();

            continue;
        }


        /*
        |--------------------------------------------------------------------------
        | Bird insertion
        |--------------------------------------------------------------------------
        |
        | Every 8 posts, try to insert a bird.
        |
        */

        if (
            birdIndex < birds.length &&
            postsSinceBird >= birdInterval
        ) {

            addBird();

            continue;
        }


        /*
        |--------------------------------------------------------------------------
        | Normal post
        |--------------------------------------------------------------------------
        */

        if (postIndex < posts.length) {

            addPost();

            continue;
        }


        /*
        |--------------------------------------------------------------------------
        | No posts remaining
        |
        | We still need to flush remaining creators/birds.
        |--------------------------------------------------------------------------
        */

        if (creatorIndex < creators.length) {

            addCreator();

            continue;
        }


        if (birdIndex < birds.length) {

            addBird();

            continue;
        }
    }


    return feed;
};


module.exports = {
    mixSearchResults
};
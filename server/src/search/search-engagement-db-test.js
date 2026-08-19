require("dotenv").config();

const mongoose = require("mongoose");

const BirdPost = require(
    "../model/BirdPost"
);

const {
    getPostEngagement,
    calculateEngagementBoost
} = require("./searchEngagementScorer");


const run = async () => {

    try {

        await mongoose.connect(
            process.env.MONGODB_URI
        );

        console.log(
            "\nMongoDB connected"
        );


        /*
        |--------------------------------------------------------------------------
        | Get a few real posts
        |--------------------------------------------------------------------------
        */

        const posts =
            await BirdPost
                .find({})
                .select("_id birdName")
                .limit(10)
                .lean();


        if (!posts.length) {

            console.log(
                "No posts found."
            );

            return;
        }


        const postIds =
            posts.map(
                post => post._id
            );


        /*
        |--------------------------------------------------------------------------
        | Get real engagement
        |--------------------------------------------------------------------------
        */

        const engagementMap =
            await getPostEngagement(
                postIds
            );


        console.log(
            "\n======================================"
        );

        console.log(
            "REAL POST ENGAGEMENT"
        );

        console.log(
            "======================================\n"
        );


        for (const post of posts) {

            const engagement =
                engagementMap.get(
                    post._id.toString()
                ) || {

                    likes: 0,
                    bookmarks: 0,
                    comments: 0,
                    shares: 0,
                    views: 0,
                    opens: 0
                };


            const score =
                calculateEngagementBoost(
                    engagement
                );


            console.log(
                `POST: ${post.birdName}`
            );

            console.log(
                `ID: ${post._id}`
            );

            console.log(
                `Likes: ${engagement.likes}`
            );

            console.log(
                `Bookmarks: ${engagement.bookmarks}`
            );

            console.log(
                `Comments: ${engagement.comments}`
            );

            console.log(
                `Shares: ${engagement.shares}`
            );

            console.log(
                `Views: ${engagement.views}`
            );

            console.log(
                `Opens: ${engagement.opens}`
            );

            console.log(
                `Engagement Score: ${score}`
            );

            console.log(
                "--------------------------------------"
            );
        }


    } catch (error) {

        console.error(
            "\nENGAGEMENT DB TEST FAILED:"
        );

        console.error(
            error
        );

    } finally {

        await mongoose.disconnect();
    }
};


run();
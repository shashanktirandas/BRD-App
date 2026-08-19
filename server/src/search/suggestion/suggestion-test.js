require("dotenv").config();

const mongoose =
    require("mongoose");

const {
    getSuggestions
} = require(
    "./suggestionEngine"
);


const run = async () => {

    try {

        await mongoose.connect(
            process.env.MONGODB_URI
        );


        console.log(
            "\nMongoDB connected"
        );


        const queries = [
            "pea",
            "peafowl",
            "shiv",
            "pavo"
        ];


        for (
            const query of queries
        ) {

            console.log(
                "\n======================================"
            );

            console.log(
                `SUGGESTIONS FOR: "${query}"`
            );

            console.log(
                "======================================\n"
            );


            const suggestions =
                await getSuggestions(
                    query
                );


            if (
                suggestions.length === 0
            ) {

                console.log(
                    "No suggestions"
                );

                continue;
            }


            suggestions.forEach(
                suggestion => {

                    console.log(
                        `${suggestion.type.padEnd(10)} | ` +
                        `${suggestion.text.padEnd(30)} | ` +
                        `score: ${suggestion.score}`
                    );
                }
            );
        }


    } catch (error) {

        console.error(
            "\nSUGGESTION TEST FAILED:"
        );

        console.error(
            error
        );

    } finally {

        await mongoose.disconnect();
    }
};


run();
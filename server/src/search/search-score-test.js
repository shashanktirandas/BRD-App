const {
    scorePost,
    scoreCreator,
    scoreBird
} = require("./searchScorer");


const posts = [
    {
        name: "Exact bird name",

        birdName: "Peafowl",

        scientificName: "Pavo cristatus",

        tags: ["Bird", "Nature"],

        description: "Beautiful bird photography.",

        country: "India",
        state: "Telangana",
        city: "Hyderabad"
    },

    {
        name: "Starts with bird name",

        birdName: "Peafowl Photography",

        scientificName: "Pavo cristatus",

        tags: ["Bird"],

        description: "Wildlife photography.",

        country: "India",
        state: "Telangana",
        city: "Hyderabad"
    },

    {
        name: "Tag match",

        birdName: "Indian Bird",

        scientificName: "Unknown",

        tags: ["Peafowl", "Nature"],

        description: "A beautiful bird.",

        country: "India",
        state: "Telangana",
        city: "Hyderabad"
    },

    {
        name: "Description match",

        birdName: "Indian Bird",

        scientificName: "Unknown",

        tags: ["Nature"],

        description: "A peafowl was photographed in the forest.",

        country: "India",
        state: "Telangana",
        city: "Hyderabad"
    }
];


const creators = [
    {
        name: "Exact username",

        displayName: "Wildlife Photographer",

        user: {
            username: "peafowl"
        },

        bio: "Wildlife photographer.",

        specialization: [
            "Bird Photography"
        ],

        country: "India",
        state: "Telangana",
        city: "Hyderabad"
    },

    {
        name: "Display name match",

        displayName: "Peafowl Photography",

        user: {
            username: "wildlife123"
        },

        bio: "Nature photographer.",

        specialization: [
            "Bird Photography"
        ],

        country: "India",
        state: "Telangana",
        city: "Hyderabad"
    }
];


const birds = [
    {
        name: "Exact bird",

        birdName: "Peafowl",

        scientificName: "Pavo cristatus"
    },

    {
        name: "Starts with bird",

        birdName: "Peafowl Photography",

        scientificName: "Pavo cristatus"
    },

    {
        name: "Contains bird",

        birdName: "Indian Peafowl",

        scientificName: "Pavo cristatus"
    }
];


const testQuery = (query) => {

    console.log("\n======================================");
    console.log(`SEARCH QUERY: "${query}"`);
    console.log("======================================");


    console.log("\nPOST SCORES:");

    posts
        .map(post => ({
            name: post.name,
            score: scorePost(post, query)
        }))
        .sort((a, b) => b.score - a.score)
        .forEach(result => {
            console.log(
                `${result.score.toString().padStart(4)} → ${result.name}`
            );
        });


    console.log("\nCREATOR SCORES:");

    creators
        .map(creator => ({
            name: creator.name,
            score: scoreCreator(creator, query)
        }))
        .sort((a, b) => b.score - a.score)
        .forEach(result => {
            console.log(
                `${result.score.toString().padStart(4)} → ${result.name}`
            );
        });


    console.log("\nBIRD SCORES:");

    birds
        .map(bird => ({
            name: bird.name,
            score: scoreBird(bird, query)
        }))
        .sort((a, b) => b.score - a.score)
        .forEach(result => {
            console.log(
                `${result.score.toString().padStart(4)} → ${result.name}`
            );
        });
};


testQuery("peafowl");

testQuery("Pavo cristatus");
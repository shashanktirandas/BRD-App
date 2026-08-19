const {
    calculateEngagementBoost
} = require("./searchEngagementScorer");


const tests = [

    {
        name: "No engagement",

        engagement: {
            likes: 0,
            bookmarks: 0,
            comments: 0,
            shares: 0,
            views: 0,
            opens: 0
        }
    },

    {
        name: "Small engagement",

        engagement: {
            likes: 5,
            bookmarks: 1,
            comments: 2,
            shares: 1,
            views: 20,
            opens: 10
        }
    },

    {
        name: "Medium engagement",

        engagement: {
            likes: 50,
            bookmarks: 10,
            comments: 15,
            shares: 5,
            views: 500,
            opens: 100
        }
    },

    {
        name: "High engagement",

        engagement: {
            likes: 5000,
            bookmarks: 1000,
            comments: 500,
            shares: 300,
            views: 100000,
            opens: 10000
        }
    }
];


console.log(
    "\n======================================"
);

console.log(
    "SEARCH ENGAGEMENT SCORER"
);

console.log(
    "======================================\n"
);


for (const test of tests) {

    const score =
        calculateEngagementBoost(
            test.engagement
        );


    console.log(
        `${test.name.padEnd(22)} → ${score}`
    );
}
const {
    calculateFreshnessBoost
} = require(
    "./searchFreshnessScorer"
);


const now =
    new Date();


const daysAgo = (
    days
) => {

    const date =
        new Date(now);

    date.setDate(
        date.getDate() - days
    );

    return date;
};


const tests = [

    {
        name: "Today",
        date: now
    },

    {
        name: "1 day old",
        date: daysAgo(1)
    },

    {
        name: "7 days old",
        date: daysAgo(7)
    },

    {
        name: "30 days old",
        date: daysAgo(30)
    },

    {
        name: "90 days old",
        date: daysAgo(90)
    },

    {
        name: "1 year old",
        date: daysAgo(365)
    }
];


console.log(
    "\n======================================"
);

console.log(
    "SEARCH FRESHNESS SCORER"
);

console.log(
    "======================================\n"
);


for (const test of tests) {

    const score =
        calculateFreshnessBoost(
            test.date
        );


    console.log(
        `${test.name.padEnd(20)} → ${score}`
    );
}
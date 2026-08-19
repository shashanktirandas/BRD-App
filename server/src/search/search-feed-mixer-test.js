const {
    mixSearchResults
} = require("./searchFeedMixer");


const posts = [
    { _id: "post-1", birdName: "Peafowl 1" },
    { _id: "post-2", birdName: "Peafowl 2" },
    { _id: "post-3", birdName: "Peafowl 3" },
    { _id: "post-4", birdName: "Peafowl 4" },
    { _id: "post-5", birdName: "Peafowl 5" },
    { _id: "post-6", birdName: "Peafowl 6" },
    { _id: "post-7", birdName: "Peafowl 7" },
    { _id: "post-8", birdName: "Peafowl 8" }
];

const creators = [
    {
        _id: "creator-1",
        displayName: "Shiva mani"
    },
    {
        _id: "creator-2",
        displayName: "Sathwik pottabathini"
    }
];

const birds = [
    {
        birdName: "Indian Peafowl",
        scientificName: "Pavo cristatus"
    }
];


const feed = mixSearchResults({
    posts,
    creators,
    birds
});


console.log("");
console.log("======================================");
console.log("SEARCH FEED MIXER TEST");
console.log("======================================");
console.log("");


feed.forEach((item, index) => {

    if (item.type === "post") {

        console.log(
            `${index + 1}. POST    → ${item.data.birdName}`
        );

    }

    if (item.type === "creator") {

        console.log(
            `${index + 1}. CREATOR → ${item.data.displayName}`
        );

    }

    if (item.type === "bird") {

        console.log(
            `${index + 1}. BIRD    → ${item.data.birdName}`
        );

    }

});


console.log("");
console.log("Total feed items:", feed.length);
console.log("");
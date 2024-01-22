require("dotenv").config(); //Use env variables

const CMDS = new Map(); // Map of commands
const arrayCmds = [
    {
        command: "test",
        description: "Command used to test"
    },
    {
        command: "locate", 
        description: "Search locations"
    },
    {
        command: "meme", 
        description: "I will send you memes"
    }
];

module.exports = {
    BOT:{
        TOKEN: {
            TLGM: process.env.TOKEN_TLGM
            ,
            GPLACES: process.env.TOKEN_GMAPS,
        },
        URI: {
            GPLACES: "https://maps.googleapis.com/maps/api/place/"
        },
        CMDS,
        console: {
            info: `[Daxo] `,
            alert: `[Daxo] `,
            warn: `[Daxo] `,
            db: "[Database] ",
          },
    }
}
const { BOT } = require('../../setting/config');
const fetch = require('node-fetch');

const instaDL = async (url) => {
    var api = ['https://instagram-videos.vercel.app', 'http://192.168.0.11:4000']
    try {
        const response = await fetch(`${api[0]}/api/video/?url=${url}`);
        return (response.json());
    } catch (error) {
        return (error);
    }
}

module.exports = {
    name: "insta",
    desc: "Download video from instagram",
    usage: "insta URL-LINK",
    isPrivate: false,
    groupOnly: false,
    category: "",
    cooldown: 0,
    status: true,
   /**
    * @param { object } ctx
    * @param { object } msg
    * @param { Array<String> } ...args
    * @returns Promise
    */
    run: async(ctx, msg, ...args) => {
        const from = msg.from;
        const chat = msg.chat;
        const link = args[0];

        ctx.reply("Empezaré aprocesar tu petición, espérame que ya te envío el reel..."); 

        let result = await instaDL(link)

        console.log(result);
        try {
            ctx.replyWithVideo(result.data.videoUrl);
        } catch (error) {
            console.error(err);
            ctx.reply("Ocurrió un error.");
        }

        ctx.reply(`Hecho!!!`);
        
    }
}
const { BOT } = require('../../setting/config');
const YTDL = require('@yohancolla/ytdl');
const fetch = require('node-fetch');

const pinGET = async (url) => {
    try {
        const response = await fetch(`http://192.168.0.11:4000/pinterest/?url=${url}`);
        return (response.json());
    } catch (error) {
        return (error);
    }
}

module.exports = {
    name: "video",
    desc: "Download video from pinterest",
    usage: "video URL-LINK",
    isPrivate: false,
    groupOnly: false,
    category: "",
    cooldown: 0,
    status: false,
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
        console.log("LINK:", args[0]);
        // var link = 'https://www.youtube.com/watch?v=LXybWcPHMXc';

        ctx.reply("Ok, espera unos minutos mientras se procesa la petición...");     
        
        /* const fet =await fetch('http://api.hidaxo.xyz/api',{
            method: 'POST',
            body: {link}
        }); */

        // let result = await fet.text();
        //result = result.trim();
        //result = JSON.parse(result);

        let result = await pinGET(link)

        console.log(result);
        try {
            ctx.replyWithVideo(result.url);
        } catch (error) {
            console.error(err);
            ctx.reply("Ocurrió un error.");
        }

        ctx.reply(`Hecho!!!`);
        
    }
}
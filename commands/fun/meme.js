//@ts-check
const { meme } = require('memejs')


module.exports = {
    name: "meme",
    desc: "I will send you memes from Reddit in spanish",
    usage: "meme",
    isPrivate: false,
    groupOnly: false,
    category: "fun",
    cooldown: 10,
    status: true,
    /**
    * @param { Object } bot
    * @param { Object } message
    * @param { Array } args
    * @returns
    */
    run: async(bot, message, ...args) => {
        const from = message.from;
        const chat = message.chat;
        
        let memES = ["MemesESP", "spanishmemes", "SpanishMeme", "mexico", "MemesEnEspanol", "spanish"];
        let random = Math.floor(Math.random() * memES.length);
        const noFound = `Sorry 😅, no logré encontrar memes en este momento 😕\nVuelve a intentarlo`

        meme(memES[random]).then( data => {
            if (!data) return bot.sendMessage(chat.id, noFound);
            console.log(data);
            bot.sendPhoto(chat.id, data.url, {}, { filename: data.title});
        }).catch(err => {
            bot.sendMessage(chat.id, noFound); console.error("Er:"+err);
        });
    }
}
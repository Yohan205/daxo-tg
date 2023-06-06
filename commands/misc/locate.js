const fetch = require('node-fetch').default;
const { BOT } = require('../../setting/config');


module.exports = {
    name: "locate",
    desc: "Search locations",
    usage: "locate",
    isPrivate: false,
    groupOnly: false,
    category: "misc",
    cooldown: 10,
    status: true,
    /**
    * @param { Object } bot
    * @param { Object } message
    * @param { Array<String> } ...args
    * @returns Promise
    */
    run: async (bot, message, ...args) => {
        const from = message.from;
        const chat = message.chat;

        const apiKey = BOT.TOKEN.GMAPS;
        const qq = args.join(" "); //"Universidad tecnológica de Pereira";
        if ( !qq ) return bot.sendMessage(chat.id, "No me escribiste qué buscar.");

        async function mapsQuery(query) {
            const encodedQuery = encodeURIComponent(query);
            const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?fields=formatted_address%2Cname%2Crating%2Copening_hours%2Cgeometry&inputtype=textquery&key=${apiKey}&input=${encodedQuery}`
            
      
            try {
              // @ts-ignore
              const response = await fetch(url);
              const result = await response.text();
              return result.trim();
            } catch (error) {
              console.error('Error:', error);
              throw error;
            }
          }

        let result;
        try {
            const response = await mapsQuery(qq);
            result = await JSON.parse(response);
        } catch (error) {
            console.error('Error:', error);
        }

        result = result.candidates[0];
        const loc = result.geometry.location

        const longitude = -75.6877746;
        const latitude = 4.7953377000;

        console.log(result); 

        
        bot.sendVenue(chat.id, loc.lat, loc.lng, result.name, result.formatted_address);
    }
}
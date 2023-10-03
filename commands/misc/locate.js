const fetch = require('node-fetch').default;
const { BOT } = require('../../setting/config');

function constructParams(obj) {
	let paramsArray = [];
	for (let [key, value] of Object.entries(obj)) {
		paramsArray.push(`${key}=${value}`);
	}
	return paramsArray.join("&");
}

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
        const uri = BOT.URI.GMAPS;
        const scope = ['place_id','formatted_address', 'name', 'rating', 'opening_hours', 'geometry', 'photo'];
        // const qq = "Universidad tecnológica de Pereira";
        const qq = args.join(" ");
        if ( !qq ) return bot.sendMessage(chat.id, "No me escribiste qué buscar.");

        async function mapsQuery(query, scopes) {
            scopes = scopes.join(",");
            scopes = encodeURIComponent(scopes);

            const encodedQuery = encodeURIComponent(query);

			const paramsObj = {
				"fields": scopes,
				"key": apiKey,
				"inputtype": "textquery",
				"input": encodedQuery
			  }

            const url = `${uri}findplacefromtext/json?${constructParams(paramsObj)}`
            
            try {
              // @ts-ignore
              const response = await fetch(url);
              let result = await response.text();
              result = result.trim();
              result = JSON.parse(result);

              if ( response.status !== 200) return console.error(response);

              // console.log(result);
              return result;
            } catch (error) {
              console.error('Error: ', error);
              throw error;
            }
          }

        let result;
        try {
            result = await mapsQuery(qq, scope);
            result = result.candidates[0];
            console.log(result); 
        } catch (error) {
            console.error('Error:', error);
        }

        const loc = result.geometry.location

        bot.sendVenue(chat.id, loc.lat, loc.lng, result.name, result.formatted_address);

        /*
        async function photosQuery() {
          // const encodedQuery = encodeURIComponent(query);
          const photoReference = result.photos[0].photo_reference;

          const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoReference}&key=${apiKey}`
          
    
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

        Revisar como enviar la foto a telegram
        
        photosQuery().then( ans => {
          // console.log(ans);
          bot.sendPhoto(chat.id, ans); 
        }).catch( err => console.log(err));
        */
    }
}
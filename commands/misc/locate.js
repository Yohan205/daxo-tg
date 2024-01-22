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
    run: async (ctx, msg, ...args) => {
        const from = msg.from;
        const chat = msg.chat;

        const apiKey = BOT.TOKEN.GPLACES;
        const uriPlaces = BOT.URI.GPLACES;
        const scope = ['place_id','formatted_address', 'name', 'rating', 'opening_hours', 'geometry', 'photo'];
        // const qq = "Universidad tecnológica de Pereira";
        const qq = args.join(" ");
        if ( !qq ) return ctx.reply("No me escribiste qué buscar.");

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

            const url = `${uriPlaces}findplacefromtext/json?${constructParams(paramsObj)}`
            
            try {
              // @ts-ignore
              const response = await fetch(url);
              let result = await response.text();
			//   console.log(response);
              result = result.trim();
              result = JSON.parse(result);

              if ( response.status !== 200) return console.error(response);

			  if ( result.error_message ) return console.error(result.error_message);

              // console.log(result);
              return result;
            } catch (error) {
              console.error('Error: ', error);
              throw error;
            }
        }

		async function photoQuery(photo_reference, maxwidth, maxheight) {
            maxwidth = maxwidth || 400;

			const paramsObj = {
				"maxwidth": 400,
				"photo_reference": photo_reference,
                "key": apiKey,
			}
            // Ajustar para cuando haya un valor en height, agregar al objeto JSON
            // if (maxheight) 

            const url = `${uriPlaces}photo?${constructParams(paramsObj)}`
            
            try {
            	// @ts-ignore
            	const response = await fetch(url);
				// console.log("RES:",response);
            	let urlPhoto = response.url;

            	if ( response.status !== 200) return console.error(response);

				if ( result.error_message ) return console.error(result.error_message);

              	// console.log("RESULT", urlPhoto);
              	return urlPhoto;
            } catch (error) {
              	console.error('Verifica: ', error);
              	throw error;
            }
        }

        let result;
        try {
            result = await mapsQuery(qq, scope);
            result = result.candidates[0];
            // console.log(result); 
        } catch (error) {
            console.error('Error:', error);
        }
        const loc = result.geometry.location

        ctx.replyWithVenue(loc.lat, loc.lng, result.name, result.formatted_address);

		// console.log("PHOTO:",result.photos[0].photo_reference);
		let photo;
		try {
			photo = await photoQuery(result.photos[0].photo_reference);
		} catch (err) {
			console.error('Error:', err);
		}

		ctx.replyWithPhoto(photo, "Photo from place");
    }
}
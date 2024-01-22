// require
const fs = require('fs');
//const ytdl = require('ytdl-core');
const YTDL = require('@yohancolla/ytdl');

const ytdl = new YTDL({
  //outputPath: './mediaFiles/',
  youtubeVideoQuality: '18',
})

module.exports = {
    name: "test",
    desc: "Command used to test",
    usage: "test",
    isPrivate: false,
    groupOnly: false,
    category: "test",
    cooldown: 0,
    status: true,
    run: async (ctx, msg, ...args) => {
        const chat = msg.chat;
        const from = msg.from;
		//var link = "https://youtu.be/RdkW3plOX6o?si=Q9pumrZF5xa58lER"; 
		var link = 'https://www.youtube.com/watch?v=LXybWcPHMXc';

        ctx.reply("Ok, espera unos minutos mientras se procesa la petición...");        
        
		
        ytdl.toMp4(link);

        ytdl.on("finish", (err, data) => {
            console.log("finish", data);
            ctx.replyWithVideo(data.output);
        })
        
        ytdl.on("error", (error) => {
            console.log("Error", error);
        });

		//stream.pipe(fs.createWriteStream('D:/video.mp4'));

        /*
        async function saldoTarjeta(cardID) {
            // const encodedQuery = encodeURIComponent(query);
            // const url = `${API_URL}${encodedQuery}`;
            const url = `http://api.hidaxo.xyz/api`;
            const data = { cardID, from }
      
            try {
              // @ts-ignore
              const response = await fetch(url, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
              });
              const result = await response.text();
              return result.trim();
            } catch (error) {
              console.error('Error:', error);
              throw error;
            }
          }

          const saldo = await saldoTarjeta(args[0]);

        // 0184174967 - 710489695*/

        // Responde al mensaje con un saludo
        //ctx.reply(`Hola ${from.first_name}! \nTu saldo de la tarjeta ${args[0]} es de ${saldo}`);
		/*stream.on("end", () => {
			
			ctx.reply(`Hecho!!!`)
		})*/
    }
}
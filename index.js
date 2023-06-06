/* Requerimos del modulo fs para manipular los archivos (leer y escribir) */
const fs = require('fs');
const path = require('path');
const TelegramBot = require('node-telegram-bot-api');
const { BOT } = require('./setting/config');


const commandsBot = BOT.CMDS;

// Crea una instancia del bot
const bot = new TelegramBot(BOT.TOKEN.TLGM, { polling: true });
bot.getMyCommands().then( ans => console.log(ans) );

// Escucha los mensajes entrantes
bot.on('message', async (message) => {
  let userBot = await bot.getMe(), usernameBot;
  usernameBot = "@"+userBot.username;

  const chat = message.chat;
  const msg = message.text;
  const from = message.from;

  if ( !msg ) return testLog(message, "mensajes");
  if ( from.is_bot == true ) return;

  // console.log(msg);

  let [command, ...args] = msg.slice(1).trim().split(/\s+/);
  command = command.includes(usernameBot)? command.replace(usernameBot, "") : command;

  const cmd = commandsBot.get(command)
  if(!cmd) return console.log(command); // If not found command... return

  /**
   * If command is already...
   * And estatus is true, send menssage that command is not active
  */
  if(!cmd.status) return bot.sendssage(chat.id, `Sorry, el comando **${cmd.name}** no está activo :c`).then((m)=>{
    console.warn(BOT.console.warn + "El comando " + cmd.name+ " no está activo!");
  });

  cmd.run(bot, message, ...args)

  console.log(command, args);

});

// Pasa por cada carpeta de los comandos de texto
const commands = fs.readdirSync(path.join(__dirname, "commands"));

for (const folders of commands) {
    const folder = fs.readdirSync(path.join(__dirname, "commands", folders));
    for (const file of folder) { // Ejecuta cada comando
        const cmd = require(path.join(__dirname, "commands", folders, file));
        commandsBot.set(cmd.name, cmd)
    }
}

console.log("Bot is Ready!");

function testLog(test, name) {
  console.log(`---------------------TESTING ${name}--------------------------------`);
  console.log(test);
  console.log(`----------------------- END TESTING ${name}----------------------`);
}
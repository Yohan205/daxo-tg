/* Requerimos del modulo fs para manipular los archivos (leer y escribir) */
const fs = require('fs');
const path = require('path');
const TelegramBot = require('node-telegram-bot-api');
const { Telegraf } = require('telegraf');
const { message } = require('telegraf/filters');
const { BOT } = require('./setting/config');


const commandsBot = BOT.CMDS;

// Crea una instancia del bot
const bot = new Telegraf(BOT.TOKEN.TLGM);
// const bot = new TelegramBot(BOT.TOKEN.TLGM, { polling: true });
// bot.getMyCommands().then( ans => console.log(ans) );

// On start message
bot.start((ctx) => ctx.reply("Hello, world!"));

// On help message
bot.help(ctx => ctx.reply("Hello, can I help you?"));

// bot.command('test', (ctx) => {
//   ctx.reply("Hi there");
// })

// Escucha los mensajes entrantes
bot.on(message('text'), async (ctx) => {
  const msg =ctx.update.message;
  let userBot = ctx.botInfo;
  let usernameBot = "@"+userBot.username;

  const chat = msg.chat;
  const text = msg.text;
  const from = msg.from;

  let mssg = {
    chat,
    text,
    from
  }

  // testLog(mssg, "CONTEXT");
  if ( from.is_bot == true ) return;

  let [command, ...args] = text.slice(1).trim().split(/\s+/);
  command = command.includes(usernameBot)? command.replace(usernameBot, "") : command;

  const cmd = commandsBot.get(command)
  // If not found command... return
  if(!cmd) return console.log(command); 

  console.log(command);
  /**
   * If command is already...
   * And estatus is true, send a menssage saying that command is not active
  */
 
  if(!cmd.status) return ctx.sendMessage(chat.id, `Sorry, el comando **${cmd.name}** no está activo 😔`).then((m)=>{
    console.warn(BOT.console.warn + "El comando " + cmd.name+ " no está activo!");
  });

  // bot.command(cmd.name, cmd.run(ctx, msg, ...args));
  cmd.run(ctx, msg, ...args);

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

bot.launch();
console.log("Bot is Ready!");

function testLog(test, name) {
  console.log(`---------------------TESTING ${name}--------------------------------`);
  console.log(test);
  console.log(`----------------------- END TESTING ${name}----------------------`);
}
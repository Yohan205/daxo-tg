// require

module.exports = {
    name: "test",
    desc: "Command used to test",
    usage: "test",
    isPrivate: false,
    guildOnly: false,
    category: "test",
    cooldown: 0,
    status: true,
    run: (bot, message, ...args) => {
        const from = message.from;
        const chat = message.chat;

        // Responde al mensaje con un saludo
        bot.sendMessage(chat.id, `Hola ${from.first_name}!`);
    }
}
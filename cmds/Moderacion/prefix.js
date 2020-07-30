module.exports = {
    name: "prefix",
    category: "Moderacion",
    description : "Con este comando puedes ver el prefix en el servidor",
    aliases: ['Prefix', 'PREFIX'],
    usage: '!prefix',
    examples: ['!prefix -', '!prefix --='],
    run: async (client, message, args, prefix) => {
            message.channel.send(`Mi prefix en este server es ${prefix}`);  
    }
}
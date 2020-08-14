module.exports = {
    name: "prefix",
    category: "Info",
    description : "Con este comando puedes ver el prefix en el servidor se cambia con !config prefix \"prefix\"",
    aliases: ['Prefix', 'PREFIX'],
    usage: '!prefix',
    examples: ['!prefix -', '!prefix --='],
    run: async (client, message, args, prefix) => {
            message.channel.send(`Mi prefix en este server es ${prefix}`);  
    }
}
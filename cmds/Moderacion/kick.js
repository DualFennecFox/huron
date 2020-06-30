const Discord = require('discord.js');

    module.exports  = {
    name : 'kick',
    category: "Moderacion",
    description : 'Este comando kickea al usuario mencionado con su ID o mención, también puedes dar una razón de ello',
    aliases: ['Kick', 'KICK'],
    usage: '!kick',
    examples: ['!kick @Firulais', '!kick 556540723235651584', '!kick @Firulais Razon'],
    run: async (client , message, args) => {

    let kUser = message.guild.member(message.mentions.members.first() || message.guild.members.cache.get(args[0]));
    if(!kUser) return message.channel.send("Debes mencionar a un usuario o darme su id");

    let kReason = args.slice(1).join(" ");
    if(!kReason) kReason = "No se específico una razón"

    if(!message.member.hasPermission("KICK_MEMBERS", "BAN_MEMBERS", "ADMINISTRATOR") || !message.guild.owner) return message.channel.send("No tienes permisos para usar este comando!");
    if(!message.guild.me.hasPermission(["KICK_MEMBERS", "BAN_MEMBERS", "ADMINISTRATOR"])) return message.channel.send("No tengo permisos para banear miembros");
    if(kUser.hasPermission("KICK_MEMBERS", "BAN_MEMBERS", "ADMINISTRATOR")) return message.channel.send("Esta persona no puede ser expulsada!");

    let kickEmbed = new Discord.MessageEmbed()
    .setDescription("~Kick~")
    .setColor("#0088ff")
    .addField("Usuario Kickeado", `${kUser} Y su ID es ${kUser.id}`)
    .addField("Kickeado Por", `<@!${message.author.id}> Y su ID es ${message.author.id}`)
    .addField("Razón de Expulsión", kReason);
    message.guild.member(kUser).kick(kReason);

    message.channel.send( kickEmbed )
    .catch(err => {
        console.log(err);
    })
}
}
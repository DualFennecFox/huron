const Discord = require('discord.js');

module.exports = {
    name : 'unmute',
    category: "Moderacion",
    description : 'Este comando Desmutea al usuario mencionado con su ID o mención Ej: `!unmute @Firulais`, `!unmute 556540723235651584` También puedes dar una razón de ello',
    aliases: ['Unmute', 'UNMUTE'],
    usage: '!unmute',
    examples: ['!unmute @Firulais', '!unmute 556540723235651584', '!unmute @Firulais Razon'],
    run: async (client , message, args) => {

    if(!message.member.hasPermission("KICK_MEMBERS", "BAN_MEMBERS", "ADMINISTRATOR") || !message.guild.owner) return message.channel.send("No tienes permisos para usar este comando!")
    if(!message.guild.me.hasPermission(["MANAGE_ROLES", "ADMINISTRATOR"])) return message.channel.send("No tengo permisos para añadir roles");
    let unmutee = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if(!unmutee) return message.channel.send("Debe mencionar un usuario muteado o darme su id");
    let umReason = args.slice(1).join(" ");
    if(!umReason) umReason = "No se específico una Razón"

    let umuterole = message.guild.roles.cache.find(r => r.name === "Muteado")
    if(!umuterole) return message.channel.send("No tienes muteado a nadie")

    unmutee.roles.remove(umuterole.id);

    let unmuteEmbed = new Discord.MessageEmbed()
    .setDescription("~UnMute~")
    .setColor("#0088ff")
    .addField("Usuario Desmuteado", `${unmutee} Y su ID es ${unmutee.id}`)
    .addField("Desmuteado Por", `<@!${message.author.id}> Y su ID es ${message.author.id}`)
    .addField("Razón de Desmute", umReason);

    message.channel.send( unmuteEmbed )
}
}
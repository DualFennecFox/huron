const Discord = require('discord.js');

    module.exports = {
    name : 'ban',
    category: "Moderacion",
    description : 'Este comando banea al usuario mencionado con su ID o mención, también puedes dar una razón de ello',
    aliases: ['Ban', 'BAN'],
    usage: '!ban',
    examples: ['!ban @Firulais', '!ban 556540723235651584', '!ban @Firulais Razon'],
    run: async (client , message, args) => {

    let bUser = message.guild.member(message.mentions.members.first() || message.guild.members.cache.get(args[0]));
    if(!bUser) return message.channel.send("Debes mencionar a un usuario o darme su id");

    
    let bReason = args.slice(1).join(" ");
    if(!bReason) bReason = "No se específico una razón"

    let role = bUser.highestRole
    
    if(!message.member.hasPermission("KICK_MEMBERS", "BAN_MEMBERS", "ADMINISTRATOR") || !message.guild.owner) return message.channel.send("No tienes permisos para usar este comando!");
    if(!message.guild.me.hasPermission(["KICK_MEMBERS", "BAN_MEMBERS", "ADMINISTRATOR"])) return message.channel.send("No tengo permisos para Banear miembros");
    if(bUser.hasPermission("KICK_MEMBERS", "BAN_MEMBERS", "ADMINISTRATOR")) return message.channel.send("Esta persona no puede ser baneada!");

    if (message.guild.me.highestRole.comparePositionTo(role) < 1) {
        return message.channel.send("Mi rol es muy bajo para asignar el rol mute!");
    }

    let banEmbed = new Discord.MessageEmbed()
    .setDescription("~Ban~")
    .setColor("#0088ff")
    .addField("Usuario Baneado", `${bUser} Y su ID es ${bUser.id}`)
    .addField("Baneado Por", `<@!${message.author.id}> Y su ID es ${message.author.id}`)
    .addField("Razón de Baneo", bReason);
    message.guild.member(bUser).ban(bReason);

    message.channel.send( banEmbed )

    return;
}
}

const Discord = require('discord.js');

module.exports.help = {
    name : 'unban',
    description : 'Este comando Desbanea al usuario mencionado con su ID Ej: `!unban 556540723235651584` También puedes dar una razón de ello',
    aliases: ['Unban', 'UNBAN'],
    usage: '!unban',
    examples: ['!unban @Firulais', '!unban 556540723235651584', '!unban @Firulais Razon'],
    run: async (client , message, args) => {
   
    let bannedMember = await client.users.fetch(args[0])
        if(!bannedMember) return message.channel.send("Este usuario no esta baneado o solo no existe")

    let ubReason = args.slice(1).join(" ")
        if(!ubReason) ubReason = "No se específico una razón"

    if(!message.member.hasPermission("KICK_MEMBERS", "BAN_MEMBERS", "ADMINISTRATOR") || !message.guild.owner) return message.channel.send("No tienes permisos para usar este comando!");
    if(!message.guild.me.hasPermission(["KICK_MEMBERS", "BAN_MEMBERS", "ADMINISTRATOR"])) return message.channel.send("No tengo permisos para Banear miembros");

    try {
        message.guild.members.unban(bannedMember, {reason: ubReason})
    } catch(err) {
        console.log(err.bannedMember)
    }

    let unbanEmbed = new Discord.MessageEmbed()
    .setDescription("~UnBan~")
    .setColor("#0088ff")
    .addField("Usuario Desbaneado", `${bannedMember} Y su id es ${bannedMember.id}`)
    .addField("Desbaneado Por", `<@!${message.author.id}> Y su ID es ${message.author.id}`)
    .addField("Razón de Desbaneo", ubReason);
    
    message.channel.send( unbanEmbed )

    return;
}
}

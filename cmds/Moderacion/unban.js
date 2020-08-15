const Discord = require('discord.js');

module.exports = {
    name : 'unban',
    category: "Moderacion",
    description : 'Este comando Desbanea al usuario mencionado con su ID Ej: `!unban 556540723235651584` También puedes dar una razón de ello',
    aliases: ['Unban', 'UNBAN'],
    usage: '!unban',
    examples: ['!unban @Firulais', '!unban 556540723235651584', '!unban @Firulais Razon'],
    run: async (client , message, args) => {
   
    if (!args.length >= 1) return message.channel.send("Debes mencionar a un usuario o darme su id")
    let User = message.mentions.users.first() || client.users.cache.get(args[0])
    if (!User) {
       let UserID = args[0].replace(/([^0-9])/g, '')
       try {
        User = await client.users.fetch(UserID);
       } catch (err) {
           console.error(err)
           message.channel.send("Ese no parece ser un usuario valido")
       }
    }
    if (!User) return message.channel.send("Ese no parece ser un usuario valido");
    let bReason = args.slice(1).join(" ")
    if (!bReason) bReason = "No se específico una razón"
    try {
    let bans = await message.guild.fetchBans();

    let bannedMember = bans.get(User.id)
    
    if(!bannedMember) return message.channel.send("Este usuario no esta baneado")

    } catch (err) {
        console.error(err)
    }

    if(!message.member.hasPermission("BAN_MEMBERS" || "ADMINISTRATOR") || !message.guild.owner) return message.channel.send("No tienes permisos para usar este comando!");
    if(!message.guild.me.hasPermission(["BAN_MEMBERS" || "ADMINISTRATOR"])) return message.channel.send("No tengo permisos para Banear miembros");

    try {
        message.guild.members.unban(User, {reason: bReason})
    } catch(err) {
        console.log(err)
        return message.channel.send("Se ha ocurrido un error al desbanear a este usuario")
    }

    let unbanEmbed = new Discord.MessageEmbed()
    .setAuthor("UnBan", User.displayAvatarURL())
    .setColor("#0088ff")
    .addField("Usuario Desbaneado", `<@!${User.id}> Y su id es ${User.id}`)
    .addField("Desbaneado Por", `<@!${message.author.id}> Y su ID es ${message.author.id}`)
    .addField("Razón de Desbaneo", bReason);
    
    message.channel.send( unbanEmbed )
}
}

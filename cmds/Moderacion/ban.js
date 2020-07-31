const Discord = require('discord.js');

    module.exports = {
    name : 'ban',
    category: "Moderacion",
    description : 'Este comando banea al usuario mencionado con su ID o mención, también puedes dar una razón de ello',
    aliases: ['Ban', 'BAN'],
    usage: '!ban',
    examples: ['!ban @Firulais', '!ban 556540723235651584', '!ban @Firulais Razon'],
    run: async (client , message, args) => {


    let User = message.mentions.users.first() || await client.users.fetch(args[0], { cache: true });
    if (!User) return message.channel.send("Debes mencionar a un usuario o darme su id");
    let bReason = args.join(" ").replace(User, '')
    if(!bReason || bReason == User) bReason = "No se específico una razón"
    if (message.guild.member(User)) {
    let role = bUser.roles.highest;
    bUser = message.guild.member(User)
    if(!message.member.hasPermission("BAN_MEMBERS" || "ADMINISTRATOR") || !message.guild.owner) return message.channel.send("No tienes permisos para usar este comando!");
    if(!message.guild.me.hasPermission(["BAN_MEMBERS" || "ADMINISTRATOR"])) return message.channel.send("No tengo permisos para Banear miembros");
    if(bUser.hasPermission("BAN_MEMBERS" || "ADMINISTRATOR") || !message.guild.owner) return message.channel.send("Esta persona no puede ser baneada!");
    if (User.id === message.author.id) return message.channel.send("No te puedes banear a ti mismo")

    if (message.guild.me.roles.highest.comparePositionTo(role) < 1) {
        return message.channel.send("Mi rol es muy bajo para banearlo!");
    }
    }

    let banEmbed = new Discord.MessageEmbed()
    .setDescription("~Ban~")
    .setColor("#0088ff")
    .addField("Usuario Baneado", `${User} Y su ID es ${User.id}`)
    .addField("Baneado Por", `<@!${message.author.id}> Y su ID es ${message.author.id}`)
    .addField("Razón de Baneo", bReason);
    message.guild.members.ban(User.id, { reason: bReason })

    message.channel.send( banEmbed )
    .catch(err => {
        console.log(err);
    })
}
}
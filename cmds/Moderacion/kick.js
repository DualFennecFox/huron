const Discord = require('discord.js');
const { getUser } = require('./models/functions');

    module.exports  = {
    name : 'kick',
    category: "Moderacion",
    description : 'Este comando kickea al usuario mencionado con su ID o mención, también puedes dar una razón de ello',
    usage: '!kick <Usuario> [Razón]',
    examples: ['!kick @Wumpus', '!kick 12345678987654321', '!kick @Wumpus Este no es Wumpus'],
    run: async (client , message, args, prefix, contentPrefix) => {

    if(!message.member.hasPermission("KICK_MEMBERS" || "ADMINISTRATOR") || !message.guild.owner) return message.channel.send("No tienes permisos para usar este comando!");
    if (!args.length >= 1) return message.channel.send("Debes mencionar a un usuario o darme su id")

    let kUser = message.guild.member(message.mentions.members.first() || message.guild.members.cache.get(args[0]));
    if (contentPrefix !== prefix) kUser = message.guild.member(getUser(args[0], client))
    if (!kUser) return message.channel.send("Ese no parece ser un usuario valido");

    let kReason = args.slice(1).join(" ");
    if(!kReason) kReason = "No se específico una razón"

    if (kUser.id === client.user.id) return message.channel.send("No puedo expulsarme a mi mismo")
    if(!message.guild.me.hasPermission(["KICK_MEMBERS" || "ADMINISTRATOR"])) return message.channel.send("No tengo permisos para expulsar miembros");
    if(kUser.hasPermission("KICK_MEMBERS" || "ADMINISTRATOR") || !message.guild.owner) return message.channel.send("Esta persona no puede ser expulsada!");
    if (kUser.id === message.author.id) return message.channel.send("No te puedes expulsar a ti mismo")

    let role = kUser.roles.highest;

    if (message.guild.me.roles.highest.comparePositionTo(role) < 1) {
        return message.channel.send("Mi rol es muy bajo para poder expulsarlo!");
    }
    

    let kickEmbed = new Discord.MessageEmbed()
    .setAuthor("Kick", kUser.user.displayAvatarURL({ format: "png", dynamic: true}))
    .setColor("#0088ff")
    .addField("Usuario Muteado", `${kUser}\n**ID:** ${kUser.id}`)
    .addField("Razón de Expulsión", kReason);
    try {
    message.guild.member(kUser).kick(kReason);
    } catch (err) {
        console.error(err)
        return message.channel.send("A ocurrido un error al expulsar a este usuario")
    }
    message.channel.send( kickEmbed )
    .catch(err => {
        console.log(err);
    })
}
}
const Discord = require('discord.js');
const { getUser, perms } = require('./models/functions');

    module.exports  = {
    name : 'kick',
    category: "Moderacion",
    description : 'Este comando kickea al usuario mencionado con su ID o mención, también puedes dar una razón de ello',
    usage: '!kick <Usuario> [Razón]',
    examples: ['!kick @Wumpus', '!kick 12345678987654321', '!kick @Wumpus Este no es Wumpus'],
    run: async (client , message, args, prefix, contentPrefix) => {

    if(!message.member.permissions.has(perms.kick_members || perms.administrator)) return message.channel.send("No tienes permisos para usar este comando!");
    if (!args.length >= 1) return message.channel.send("Debes mencionar a un usuario o darme su id")

    let kUser = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (contentPrefix !== prefix) kUser = message.guild.members.cache.get(getUser(args[0], client))
    if (!kUser) return message.channel.send("Ese no parece ser un usuario valido");

    let kReason = `[${message.author.tag}]: ${args.slice(1).join(" ") || "No se específico una Razón"}`;

    if (kUser.id === client.user.id) return message.channel.send("No puedo expulsarme a mi mismo")
    if(!message.guild.me.permissions.has(perms.kick_members || perms.administrator)) return message.channel.send("No tengo permisos para expulsar miembros");
    if(kUser.permissions.has(perms.kick_members || perms.administrator)) return message.channel.send("Esta persona no puede ser expulsada!");
    if (kUser.id === message.author.id) return message.channel.send("No te puedes expulsar a ti mismo")

    let role = kUser.roles.highest;

    if (message.guild.me.roles.highest.comparePositionTo(role) < 1) {
        return message.channel.send("Mi rol es muy bajo para poder expulsarlo!");
    }
    

    let kickEmbed = new Discord.MessageEmbed()
    .setAuthor("Kick", kUser.user.displayAvatarURL({ format: "png", dynamic: true}))
    .setColor("#0088ff")
    .addField("Usuario Expulsado", `${kUser}\n**ID:** ${kUser.id}`)
    .addField("Razón", kReason);
    try {
    message.guild.members.cache.get(kUser?.id).kick(kReason);
    } catch (err) {
        console.error(err)
        return message.channel.send("Ha ocurrido un error al expulsar a este usuario")
    }
    message.channel.send({ embeds: [kickEmbed] })
}
}
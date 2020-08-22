const Discord = require('discord.js');
const { getUser } = require('./models/functions');
const Guild = require('./models/Guild')
    module.exports = {
    name : 'mute',
    category: "Moderacion",
    description : 'Este comando Mutea al usuario mencionado con su ID o mención, también puedes dar una razón de ello',
    usage: '!mute <Usuario> [Razón]',
    examples: ['!mute @Wumpus', '!mute 12345678987654321', '!mute @Wumpus No ser Wumpus'],
    run: async (client , message, args, prefix, contentPrefix) => {
    
    if(!message.member.hasPermission("KICK_MEMBERS" || "BAN_MEMBERS" || "ADMINISTRATOR" || "MANAGE_ROLES") || !message.guild.owner) return message.channel.send("No tienes permisos para usar este comando!");
    if (!args.length >= 1) return message.channel.send("Debe mencionar un usuario muteado o darme su id")

    let mutee = message.guild.member(message.mentions.members.first() || message.guild.members.cache.get(args[0]));
    if (contentPrefix !== prefix) mutee = message.guild.member(getUser(args[0], client))
    if(!mutee) return message.channel.send("Ese no parece ser un usuario valido");

    if(mutee.id === message.author.id) return message.channel.send("No te puedes mutear a ti mismo!");
    if (mutee.id === client.user.id) return message.channel.send("No puedo banearme a mi mismo")
    if(!message.guild.me.hasPermission(["MANAGE_ROLES" || "ADMINISTRATOR"])) return message.channel.send("No tengo permisos para añadir roles");

    if(mutee.hasPermission("KICK_MEMBERS" || "BAN_MEMBERS" || "ADMINISTRATOR" || "MANAGE_ROLES") || !message.guild.owner) return message.channel.send("Esta persona no puede ser muteada!");
    

    let mReason = args.slice(1).join(" ");
    if(!mReason) mReason = "No se específico una Razón"

    let doc = await Guild.findOne({ guildID: message.guild.id })
    if (!doc) return message.channel.send("No existe un rol para mutear, asegurate de declararlo en las configuraciones")

    let muterole = message.guild.roles.cache.get(doc.muterole)
    if(!muterole) return message.channel.send("No existe un rol para mutear, asegurate de declararlo en las configuraciones")

if (message.guild.me.roles.highest.comparePositionTo(muterole) < 1) {
    return message.channel.send("Mi rol es muy bajo para asignar el rol mute!");
}
if (mutee.roles.cache.some(r => r.id === muterole.id)) return message.channel.send("Este usuario ya esta muteado")

 mutee.roles.add(muterole.id, mReason );

let muteEmbed = new Discord.MessageEmbed()
    .setAuthor("Mute", mutee.user.displayAvatarURL({ format: "png", dynamic: true}))
    .setColor("#0088ff")
    .addField("Usuario Muteado", `${mutee}\n**ID:** ${mutee.id}`)
    .addField("Razón de Mute", mReason);

    message.channel.send( muteEmbed )
    .catch(err => {
        console.error(err);
    })
}
}
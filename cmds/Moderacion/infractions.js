const Discord = require('discord.js');
const Guild = require('./models/Guild')
const { search, getUser } = require('./models/functions');
    module.exports = {
    name : 'infractions',
    category: "Moderacion",
    description : 'Este comando muestra el número de infracciones de un usuario, la razón y el usuario que lo advirtio',
    aliases: ['Infractions', 'INFRACTIONS', 'warns', 'Warns', 'WARNS'],
    usage: '!warns',
    examples: ['!warns @Firulais', '!warns 556540723235651584'],
    run: async (client , message, args, prefix, contentPrefix) => {

    if(!message.member.hasPermission("BAN_MEMBERS" || "ADMINISTRATOR" || "KICK_MEMBERS" || "MANAGE_MEMBERS") || !message.guild.owner) return message.channel.send("No tienes permisos para usar este comando!");
    if (!args.length >= 1) return message.channel.send("Debes mencionar a un usuario o darme su id")

    let bUser = message.guild.member(message.mentions.members.first() || message.guild.members.cache.get(args[0]));
    if (contentPrefix !== prefix) bUser = message.guild.member(getUser(args[0], client))
    if(!bUser) return message.channel.send("Ese no parece ser un usuario valido");

    let db = await Guild.findOne({ guildID: message.guild.id })

    if (!db) return message.channel.send("Este usuario no tiene infracciones")

    let doc = search(bUser.id, db.warns)

    if (!doc) return message.channel.send("Este usuario no tiene infracciones")

    let warns = []
    for (let i = 0; i < doc.warnLevel; i++) {
        warns.push(`**Usuario:** <@!${doc.warnedByID[i]}>\n**Razón:** ${doc.warnReason[i]}`)
    }
    let map = warns.map(user => user).join("\n\n")

    const embed = new Discord.MessageEmbed()
    .setAuthor(`Infracciones de: ${bUser.user.tag}`, bUser.user.displayAvatarURL())
    .setColor("#FF0000")
    .setDescription(`**Este usuario tiene ${warns.length} advertencias.**\n\n${map}`)
    .setFooter(`${bUser.user.username} | ${bUser.user.id}`)

    message.channel.send({ embed })
    }
}
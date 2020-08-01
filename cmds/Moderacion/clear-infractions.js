const Discord = require('discord.js');
const Guild = require('./models/Guild')
const mongoose = require('mongoose');
const {search, updateGuild, createGuild, searchAndDelete } = require('./models/functions');
    module.exports = {
    name : 'clearinfractions',
    category: "Moderacion",
    description : 'Este comando borra las infracciones de un usuario mencionado o con su ID, o de todos los miembros si se usa "all"',
    aliases: ['ClearInfractions', 'Clearinfractions', 'CLEARINFRACTIONS', 'clearwarns', 'ClearWarns', 'CLEARWARNS'],
    usage: '!warn',
    examples: ['!clearinfractions @Firulais', '!clearinfractions 556540723235651584', '!clearinfractions all'],
    run: async (client , message, args) => {
    if (!message.member.hasPermission("BAN_MEMBERS" || "ADMINISTRATOR" || "KICK_MEMBERS" || "MANAGE_MEMBERS") || !message.guild.owner) return message.channel.send("No tienes permisos para usar este comando!");

    if (message.author.id !== process.env.OWNER) return
    if (!args.length >= 1) return message.channel.send("Debes mencionar a un usuario o remover todas las infracciones con \"all\"")
    let bUser = message.guild.member(message.mentions.members.first() || message.guild.members.cache.get(args[0]));
    
    let bReason = args.slice(1).join(" ");
    if(!bReason) bReason = "No se específico una razón"
    
    let db = await Guild.findOne({ guildID: message.guild.id })

    if (bUser) {
        if (!db || !db.warns || db.warns.length == 0) return message.channel.send("Ese usuario no tiene advertencias")
      let doc = search(bUser.id, db.warns)

      if (!doc) return message.channel.send("Ese usuario no tiene advertencias")
      
      let number = searchAndDelete(bUser.id, db.warns)

      db.update({ warns: { $pull: number }}).exec()

      return message.channel.send(`Se han eliminado las infracciones de ${bUser}`)
    }
   else if (args[0] === 'all') {
   if (!db || !db.warns || db.warns.length == 0) return message.channel.send("Ningún usuario tiene advertencias")

    db.warns.length = 0
    await db.save()

    message.channel.send("Se han eliminado todas las infracciones")
   }
    }
}
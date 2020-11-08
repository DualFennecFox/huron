const Guild = require('./models/Guild')
const {search, searchNumber, getUser } = require('./models/functions');

    module.exports = {
    name : 'clear-infractions',
    category: "Moderacion",
    description : 'Este comando borra las infracciones de un usuario mencionado o con su ID, o de todos los miembros si se usa "all"',
    aliases: ['clear-warns', 'clearinfractions', 'clearwarns', 'clear-strikes', 'clearstrikes'],
    usage: '!clear-infractions <Usuario o \"all\">',
    examples: ['!clear-infractions @Wumpus', '!clear-infractions 12345678987654321', '!clear-infractions all'],
    run: async (client, message, args, prefix, contentPrefix) => {
    if (!message.member.hasPermission("BAN_MEMBERS" || "ADMINISTRATOR" || "KICK_MEMBERS" || "MANAGE_MEMBERS") || !message.guild.owner) return message.channel.send("No tienes permisos para usar este comando!");
    if (!args.length >= 1) return message.channel.send("Debes mencionar a un usuario o remover todas las infracciones con \"all\"")

    let bUser = message.guild.member(message.mentions.members.first() || message.guild.members.cache.get(args[0]));
    if (contentPrefix !== prefix) bUser = message.guild.member(getUser(args[0], client))
    
    let bReason = args.slice(1).join(" ");
    if(!bReason) bReason = "No se específico una razón"
    
    let db = await Guild.findOne({ guildID: message.guild.id })

    if (bUser) {
        if (!db || !db.warns || db.warns.length == 0) return message.channel.send("Ese usuario no tiene advertencias")
      let doc = search(bUser.id, db.warns)

      if (!doc) return message.channel.send("Ese usuario no tiene advertencias")
      
      let number = searchNumber(bUser.id, db.warns)

      if (args[1] === "all") {
     db.warns.splice(number, 1)
      }
      else if (parseInt(number) && isNaN(parseInt(number))) {

        let warned = db.warns[number].warnedByID.reverse()
        let reason = db.warns[number].warnReason.reverse()
        for (let a = 0; a < number - 1; a++) {

          warned.splice(a, 1)
          reason.splice(a, 1)
        }
        warned = warned.reverse()
        reason = reason.reverse()
      }
      db.save().then(result => {
        return message.channel.send(`Se han eliminado las infracciones de ${bUser}`)
      }).catch(err => {
        console.error(err)
        return message.channel.send("Hubo un error al remover las infracciones")
      })
    }
   else if (args[0] === 'all') {
   if (!db || !db.warns || db.warns.length == 0) return message.channel.send("Ningún usuario tiene advertencias")

   try {
    db.warns = new Array()
    
    await db.save()
    message.channel.send("Se han eliminado todas las infracciones")
   } catch (err) {
     console.error(err)
     message.channel.send("Hubo un error al remover las infracciones")
   }
   }
    }
}
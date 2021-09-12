const Guild = require('./models/Guild')
const {search, searchNumber, getUser } = require('./models/functions');

    module.exports = {
    name : 'clear-infractions',
    category: "Moderacion",
    description : 'Este comando borra las infracciones de un usuario mencionado o con su ID, o de todos los miembros si se usa "all"',
    aliases: ['clear-warns', 'clearinfractions', 'clearwarns', 'clear-strikes', 'clearstrikes'],
    usage: '!clear-infractions <Usuario o \"all\"> <Número>',
    examples: ['!clear-infractions @Wumpus', '!clear-infractions 12345678987654321', '!clear-infractions all'],
    run: async (client, message, args, prefix, contentPrefix) => {
    if (!message.member.permissions.has("BAN_MEMBERS" || "ADMINISTRATOR" || "KICK_MEMBERS" || "MANAGE_MEMBERS")) return message.channel.send("No tienes permisos para usar este comando!");
    if (!args.length >= 1) return message.channel.send("Debes mencionar a un usuario o remover todas las infracciones con \"all\"")

    let bUser = mmessage.mentions.members.first() || message.guild.members.cache.get(args[0])
    if (contentPrefix !== prefix) bUser = message.guild.members.cache.get(getUser(args[0], client))
    
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
     try {
     await db.save()
     return message.channel.send(`Se han eliminado todas las infracciones de ${bUser}`)
     } catch (err) {
     console.error(err)
     return message.channel.send("Hubo un error al remover las infracciones")
     }
    }
      else if (parseInt(args[1])) {
        if (args[1] === "0") return message.channel.send("Debes elegir un número después de 0")
        
        let warned = doc.warnedByID
        let reason = doc.warnReason
        let warnLevel = doc.warnLevel
        for (let a = 0; a < args[1]; a++) {
          
          warned.pop()
          reason.pop()

        doc.warnLevel = warnLevel - 1
        warnLevel = warnLevel - 1
        if (warnLevel === 0) break;
        }
        }
      if (doc.warnLevel === 0) {
        db.warns.splice(number, 1)
      }

      try { 
      await db.save()
        return message.channel.send(`Se han eliminado las infracciones de ${bUser}`)
      } catch (err) {

        console.error(err)
        return message.channel.send("Hubo un error al remover las infracciones")
    }
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
   else return message.channel.send("Esa no es una opción válida para eliminar advertencias")
    }
}
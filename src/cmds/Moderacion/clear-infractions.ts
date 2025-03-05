import { Message, PermissionFlagsBits, TextChannel } from 'discord.js';
import ExtendedClient from '../../classes/extendedClient';
import GuildModel from './models/Guild';
import { search, searchNumber, getUser } from './models/functions';

export default {
  name: 'clear-infractions',
  category: "Moderacion",
  description: 'Este comando borra cierta cantidad de infracciones de un usuario mencionado o todas ellas, o de todos los miembros si se usa "all"',
  aliases: ['clear-warns', 'clearinfractions', 'clearwarns', 'clear-strikes', 'clearstrikes'],
  usage: "!clear-infractions <Usuario o \"all\"> <Número>",
  examples: ['!clear-infractions @Wumpus', '!clear-infractions 12345678987654321 all', '!clear-infractions all 1'],
  run: async ({ client, message, args, prefix, contentPrefix }: {
    client: ExtendedClient,
    message: Message,
    args: string[],
    prefix: string,
    contentPrefix: string
  }) => {
    if (!message.member?.permissions.has(PermissionFlagsBits.BanMembers || PermissionFlagsBits.KickMembers)) return (message.channel as TextChannel).send("No tienes permisos para usar este comando!");
    if (args.length == 0) return (message.channel as TextChannel).send("Debes mencionar a un usuario o remover todas las infracciones con \"all\"")

    let bUser = message.mentions.members?.first() || message.guild?.members.cache.get(args[0])
    if (contentPrefix !== prefix) bUser = message.guild?.members.cache.get(getUser(args[0], client)?.id ?? "")

    const db = await GuildModel.findOne({ guildID: message.guildId })

    if (bUser) {
      if (!db || !db.warns || db.warns.length == 0) return (message.channel as TextChannel).send("Ese usuario no tiene advertencias")
      const doc = search(bUser?.id, db.warns)

      if (!doc) return (message.channel as TextChannel).send("Ese usuario no tiene advertencias")

      const number = searchNumber(bUser.id, db.warns) ?? 0

      if (args[1] === "all") {
        db.warns.splice(number, 1)
        try {
          await db.save()
          return (message.channel as TextChannel).send(`Se han eliminado todas las infracciones de ${bUser}`)
        } catch (err) {
          console.error(err)
          return (message.channel as TextChannel).send("Hubo un error al remover las infracciones")
        }
      }
      else if (parseInt(args[1])) {

        const num = parseInt(args[1])

        if (num == 0) return (message.channel as TextChannel).send("Debes elegir un número después de 0")

        const warned = doc.warnedByID
        const reason = doc.warnReason
        let warnLevel = doc.warnLevel
        for (let a = 0; a < num; a++) {

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
        return (message.channel as TextChannel).send(`Se han eliminado las infracciones de ${bUser}`)
      } catch (err) {

        console.error(err)
        return (message.channel as TextChannel).send("Hubo un error al remover las infracciones")
      }
    }
    else if (args[0] === 'all') {
      if (!db || !db.warns || db.warns.length == 0) return (message.channel as TextChannel).send("Ningún usuario tiene advertencias")

      try {
        db.warns = []

        await db.save()
        await (message.channel as TextChannel).send("Se han eliminado todas las infracciones")
      } catch (err) {
        console.error(err)
        await (message.channel as TextChannel).send("Hubo un error al remover las infracciones")
      }
    }
    else return (message.channel as TextChannel).send("Esa no es una opción válida para eliminar advertencias")
  }
}

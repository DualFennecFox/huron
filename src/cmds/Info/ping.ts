import { EmbedBuilder, Message, TextChannel } from "discord.js"
import ExtendedClient from "../../classes/extendedClient"

export default {
  name: 'ping',
  category: "Info",
  description: 'Un comando básico que sirve para probar el bot, si escribes "!ping" este dira "Pong"',
  usage: '!ping',
  run: async ({ client, message }: { client: ExtendedClient, message: Message }) => {

    const embed = new EmbedBuilder()
      .setAuthor({ name: "Pong!", iconURL: message.author.displayAvatarURL({ size: 2048, extension: "png" }) })
      .setColor("#FF0000")
      .setFields([
        {
          name: "Ping de mensajes",
          value: `${Date.now() - message.createdTimestamp}ms`,
          inline: true
        },
        {
          name: "Ping de API",
          value: `${Math.round(client.ws.ping)}ms`,
          inline: true
        }
      ])

    await (message.channel as TextChannel).send({ embeds: [embed] })
  }
}
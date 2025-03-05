import { Message, EmbedBuilder, TextChannel } from "discord.js";

export default {
  name: 'server-icon',
  description: 'Este comando envia el icono del servidor con distintos formatos',
  category: "Info",
  aliases: ["servericon"],
  usage: `!server-icon`,
  run: async ({ message }: { message: Message }) => {

    if (!message.guild?.iconURL()) return (message.channel as TextChannel).send({ content: "Este servidor no tiene ningún icono" })

    const embed = new EmbedBuilder()
      .setAuthor({ name: `Icono de ${message.guild.name}` })
      .setFields({
        name: 'Formato de Imagen',
        value: `[png](${message.guild.iconURL({ extension: "png", forceStatic: true, size: 2048 })}) | [jpg](${message.guild.iconURL({ extension: "jpg", forceStatic: true, size: 2048 })}) | [webp](${message.guild.iconURL({ extension: "webp", forceStatic: true, size: 2048 })})`
      })
      .setTimestamp()
      .setImage(message.guild.iconURL({ size: 2048 }))
      .setColor('Random')
    await (message.channel as TextChannel).send({ embeds: [embed] })
  }
}

import { EmbedBuilder, Message, TextChannel } from "discord.js";

export default {
    name: 'emoji',
    category: "Info",
    description: 'Muestra un rol que haya sido usado en el servidor como una imagen',
    aliases: ['jumbo'],
    usage: '!emoji <Emoji>',
    examples: ['!emoji :super-wumpus:', '!emoji 12345678987654321'],
    run: async ({ message, args }: { message: Message, args: string[] }) => {

        if (!args[0]) return (message.channel as TextChannel).send("Debes usar un emoji del servidor para poder mostrarlo")

        const emoji = message.guild?.emojis.cache.find(em => `<:${em.name}:${em.id}>` === args[0] || `<a:${em.name}:${em.id}>` === args[0] || em.id === args[0])
        if (!emoji) return (message.channel as TextChannel).send("Ese no parece ser un emoji valido")

        const embed = new EmbedBuilder()
            .setAuthor({ name: `Emoji ${emoji.name}` })
            .setFields([{
                name: 'Link de Formato',
                value: `[png](https://cdn.discordapp.com/emojis/${emoji.id}.png) | [jpg](https://cdn.discordapp.com/emojis/${emoji.id}.jpg)`
            }])
            .setTimestamp()
            .setImage(emoji.url)
            .setColor('Random')
        await (message.channel as TextChannel).send({ embeds: [embed] })
    }
}

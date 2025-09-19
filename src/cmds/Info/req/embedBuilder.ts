import { CollectorFilter, ColorResolvable, EmbedBuilder, Message, MessageReaction, resolveColor, TextChannel, User } from 'discord.js';

interface Reaction {
    key: string,
    name: string
}
interface Sequence {
    title: string,
    description: string,
    color?: string,
    responseType: string,
    reactions: Reaction[]
}
interface EmbData {
    title?: string,
    description?: string,
    color?: string,
    url?: string,
    image?: string,
    thumbnail?: string,
    fields?: string,
    footer?: string,
    footer_icon?: string,
    author?: string,
    author_icon?: string,
    author_url?: string
}

async function embedProcess(sequence: Sequence[], iconURL: string, message: Message, newEmbed: EmbData, prefix: string, iteration: number = 0) {

    let msg2: Message | null = null;
    if (iteration < 0) iteration = 0;
    const current = sequence[iteration >= sequence.length ? sequence.length - 1 : iteration];
    if (!current) return;
    const Embed = new EmbedBuilder()
        .setAuthor({ name: current.title, iconURL: iconURL })
        .setDescription(current.description)
        .setColor(current.color ? current.color as ColorResolvable : "Random")

    const Embed2 = new EmbedBuilder()
    if (newEmbed.title) Embed2.setTitle(newEmbed.title)
    if (newEmbed.description) Embed2.setDescription(newEmbed.description)
    if (newEmbed.color) Embed2.setColor(newEmbed.color as ColorResolvable)
    if (newEmbed.url) Embed2.setURL(newEmbed.url == "" ? null : newEmbed.url)
    if (newEmbed.image) Embed2.setImage(newEmbed.image == "" ? null : newEmbed.image)
    if (newEmbed.thumbnail) Embed2.setThumbnail(newEmbed.thumbnail == "" ? null : newEmbed.thumbnail)
    if (newEmbed.fields) {
        const field = newEmbed.fields.split("&332431312e@##")
        let fields = [{ name: "", value: "", inline: false }]
        if (!newEmbed.fields.includes("&332431312e@##")) {
            const split = newEmbed.fields.split("|")
            fields = [{ name: split[0] || "\u200B", value: split[1] || "\u200B", inline: split[2]?.toLowerCase() === "true" ? true : false }]
        }
        else {
            fields = field.map(f => {
                const split = f.split("|")
                return { name: split[0] || "\u200B", value: split[1] || "\u200B", inline: split[2]?.toLowerCase() === "true" ? true : false }
            })
        }
        Embed2.setFields(fields)
    }
    if (newEmbed.footer) Embed2.setFooter({ text: newEmbed.footer, iconURL: newEmbed.footer_icon == "" ? undefined : newEmbed.footer_icon })
    if (newEmbed.author) Embed2.setAuthor({ name: newEmbed.author, url: newEmbed.author_url == "" ? undefined : newEmbed.author_url, iconURL: newEmbed.author_icon == "" ? undefined : newEmbed.author_icon })

    if (Embed2.length > 0) msg2 = await (message.channel as TextChannel).send({ content: "**Embed actual**", embeds: [Embed2] })
    const msg = await (message.channel as TextChannel).send({ embeds: [Embed] })
    for (const reaction of current.reactions) {
        msg.react(reaction.key).catch(() => { });
    }

    const filterMessages: CollectorFilter<[Message]> = (response: Message) => {
        return message.author.id === response.author.id && !response.content.startsWith(prefix);
    }
    const collectorFilter: CollectorFilter<[MessageReaction, User]> = (reaction: MessageReaction, user: User) => {
        return current.reactions.find(r => r.key == reaction.emoji.name!) != undefined && user.id === message.author.id;
    };
    const reactions = msg.awaitReactions({ filter: collectorFilter, max: 1, time: 60000, errors: ['time'] })
    const messages = (message.channel as TextChannel).awaitMessages({ filter: filterMessages, max: 1, time: 60000, errors: ['time'] })
    try {
        const result = await Promise.race([reactions, messages]);
        if (!result) {
            if (msg.deletable) await msg.delete().catch(() => { });;
            if (msg2 && msg2.deletable) await msg2.delete().catch(() => { });
            return await (message.channel as TextChannel).send("Tiempo de espera agotado, proceso cancelado.");
        }
        const first = result.first();

        if (first instanceof Message) {
            if (msg.deletable) await msg.delete().catch(() => { });
            if (msg2 && msg2.deletable) await msg2.delete().catch(() => { });
            if (first.deletable) await first.delete().catch(() => { });
            const key = current.responseType as keyof EmbData
            if (key == "color") {
                try {
                    newEmbed.color = resolveColor(first.content as ColorResolvable).toString(16)
                } catch {
                    await (message.channel as TextChannel).send("Color inválido");
                    return embedProcess(sequence, iconURL, message, newEmbed, prefix, iteration)
                }
            }
            else if (key == "url" || key == "image" || key == "thumbnail" || key == "author_url" || key == "footer_icon" || key == "author_icon") {
                if (!first.content.startsWith("https://")) {
                    await (message.channel as TextChannel).send("URL inválida");
                    return embedProcess(sequence, iconURL, message, newEmbed, prefix, iteration)
                }
                newEmbed[key] = first.content;
            }
            else if (key == "fields") {
                const splitted = first.content.split("|")
                if (splitted.length < 2 || splitted.length > 3 || splitted[2].toLowerCase().trim() != "true" && splitted[2].toLowerCase().trim() != "false") {
                    await (message.channel as TextChannel).send("Formato inválido");
                }
                if (newEmbed[key] == undefined || newEmbed[key] == "") newEmbed[key] = first.content
                else newEmbed[key] += "&332431312e@##" + first.content
            }
            else {
                newEmbed[key] = first.content;
            }
            return embedProcess(sequence, iconURL, message, newEmbed, prefix, iteration + 1)
        }
        if (first instanceof MessageReaction) {
            current.reactions.forEach(async creaction => {
                if (creaction.key === first?.emoji.name) {
                    if (creaction.name === "back") {
                        if (msg.deletable) await msg.delete().catch(() => { });
                        if (msg2 && msg2.deletable) await msg2.delete().catch(() => { });
                        const key = sequence[iteration - 1].responseType as keyof EmbData
                        newEmbed[key] = "";
                        if (current.responseType == "fields") {
                            Embed2.data.fields?.pop()
                        }
                        return embedProcess(sequence, iconURL, message, newEmbed, prefix, iteration - 1)
                    }
                    if (creaction.name === "skip") {
                        if (msg.deletable) await msg.delete().catch(() => { });
                        if (msg2 && msg2.deletable) await msg2.delete().catch(() => { });
                        const key = current.responseType as keyof EmbData
                        newEmbed[key] = "";
                        return embedProcess(sequence, iconURL, message, newEmbed, prefix, iteration + 1)
                    }
                    if (creaction.name === "stop") {
                        if (msg.deletable) await msg.delete().catch(() => { });
                        if (msg2 && msg2.deletable) await msg2.delete().catch(() => { });
                        return;
                    }
                    if (creaction.name === "end") {
                        if (msg.deletable) await msg.delete().catch(() => { });
                        if (msg2 && msg2.deletable) await msg2.delete().catch(() => { });
                        await (message.channel as TextChannel).send({ embeds: [Embed2] });
                        return;
                    }
                }
            });
        }
    } catch {
        await (message.channel as TextChannel).send("Tiempo de espera agotado, proceso cancelado.");
    }
}

export default embedProcess
export { EmbData }
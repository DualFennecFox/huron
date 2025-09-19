import { CollectorFilter, Colors, EmbedBuilder, Message, MessageReaction, TextChannel, User } from 'discord.js';
import ExtendedClient from '../../classes/extendedClient';
import { parse, ParseError, printParseErrorCode } from 'jsonc-parser';
import embedProcess, { EmbData } from './req/embedBuilder';


const sequence = [{
    title: "Título",
    description: "Escriba el título que desea para el embed",
    responseType: "title",
    reactions: [{ key: "⏭️", name: "skip" }, { key: "❌", name: "stop" }]
}, {
    title: "Descripción",
    description: "Escriba una descripción para el embed",
    responseType: "description",
    reactions: [{ key: "⏮️", name: "back" }, { key: "⏭️", name: "skip" }, { key: "❌", name: "stop" }]
}, {
    title: "Color",
    description: "Escriba un color para el embed en formato hexadecimal (#FF5733) o el nombre de un color (Blue, Red)",
    responseType: "color",
    reactions: [{ key: "⏮️", name: "back" }, { key: "⏭️", name: "skip" }, { key: "❌", name: "stop" }]
}, {
    title: "URL",
    description: "Escriba una URL para el título del embed (si existe un titulo)",
    responseType: "url",
    reactions: [{ key: "⏮️", name: "back" }, { key: "⏭️", name: "skip" }, { key: "❌", name: "stop" }]
}, {
    title: "Imagen",
    description: "Escriba la URL de una imagen para el embed",
    responseType: "image",
    reactions: [{ key: "⏮️", name: "back" }, { key: "⏭️", name: "skip" }, { key: "❌", name: "stop" }]
}, {
    title: "Miniatura",
    description: "Escriba la URL de una miniatura para el embed",
    responseType: "thumbnail",
    reactions: [{ key: "⏮️", name: "back" }, { key: "⏭️", name: "skip" }, { key: "❌", name: "stop" }]
}, {
    title: "Pie de página",
    description: "Escriba el texto del pie de página para el embed",
    responseType: "footer",
    reactions: [{ key: "⏮️", name: "back" }, { key: "⏭️", name: "skip" }, { key: "❌", name: "stop" }]
}, {
    title: "Icono del pie de página",
    description: "Escriba la URL del icono del pie de página para el embed (si se agrego texto)",
    responseType: "footer_icon",
    reactions: [{ key: "⏮️", name: "back" }, { key: "⏭️", name: "skip" }, { key: "❌", name: "stop" }]
}, {
    title: "Autor",
    description: "Escriba el nombre del autor para el embed",
    responseType: "author",
    reactions: [{ key: "⏮️", name: "back" }, { key: "⏭️", name: "skip" }, { key: "❌", name: "stop" }]
}, {
    title: "Icono del autor",
    description: "Escriba la URL del icono del autor para el embed (si se agrego un nombre)",
    responseType: "author_icon",
    reactions: [{ key: "⏮️", name: "back" }, { key: "⏭️", name: "skip" }, { key: "❌", name: "stop" }]
}, {
    title: "URL del autor",
    description: "Escriba la URL del autor para el embed (si se agrego un nombre)",
    responseType: "author_url",
    reactions: [{ key: "⏮️", name: "back" }, { key: "⏭️", name: "skip" }, { key: "❌", name: "stop" }]
}, {
    title: "Campos",
    description: "Escriba el nombre, valor, y *inline (true/false)* en el siguiente formato: `nombre|valor|inline`, Ej: `Campo 1|Valor 1|true\n\nCuando termine reaccione con ✅",
    responseType: "fields",
    reactions: [{ key: "⏮️", name: "back" }, { key: "✅", name: "end" }, { key: "❌", name: "stop" }]
}]

function highlightJsonError(json: string): string | null {
    const errors: ParseError[] = [];
    parse(json, errors, { allowTrailingComma: false });

    if (errors.length === 0) return null;

    const error = errors[0];
    const lines = json.split('\n');
    let charCount = 0;
    let lineIndex = 0;
    let column = 0;

    for (let i = 0; i < lines.length; i++) {
        const lineLength = lines[i].length + 1;
        if (charCount + lineLength > error.offset) {
            lineIndex = i;
            column = error.offset - charCount;
            break;
        }
        charCount += lineLength;
    }

    const errorLine = lines[lineIndex];
    const pointerLine = ' '.repeat(column) + '^';

    return [
        errorLine,
        pointerLine,
        `Error: ${printParseErrorCode(error.error)} en la línea ${lineIndex + 1}, columna ${column + 1}`
    ].join('\n');
}

export default {
    name: 'embed',
    description: 'Notifica a los demás que estás ausente cuando te mencionen.',
    category: "Info",
    usage: `!afk [duración en minutos o 0 para tiempo indefinido] [mensaje]`,
    examples: ['!afk 0 Jugando Silksong', '!afk 15 Comiendo', '!afk'],
    run: async ({ client, message, args, prefix }: {
        client: ExtendedClient,
        message: Message,
        args: string[],
        prefix: string,
        contentPrefix: string
    }) => {
        if (args[0] == "<JSON>") return await (message.channel as TextChannel).send("No lo dije literalmente...")
        if (args.length > 0) {
            try {
                const JSONString = JSON.parse(args.join(" ").trim())
                if (typeof JSONString.color == "string" && JSONString.color.startsWith("#")) JSONString.color = parseInt(JSONString.color.replace("#", ""), 16)
                else if (typeof JSONString.color == "string" && Object.keys(Colors).map(k => k.toLowerCase()).includes(JSONString.color.toLowerCase())) JSONString.color = Colors[Object.keys(Colors).find(k => k.toLowerCase() == JSONString.color.toLowerCase()) as keyof typeof Colors]

                if (!JSONString.image || !JSONString.image?.url) JSONString.image = { url: JSONString.image }
                if (!JSONString.thumbnail || !JSONString.thumbnail?.url) JSONString.thumbnail = { url: JSONString.thumbnail }
                return await (message.channel as TextChannel).send({ embeds: [JSONString] })
            }
            catch (err: unknown) {
                if (err instanceof SyntaxError) {
                    return await (message.channel as TextChannel).send("No se ha podido enviar el mensaje, revise que el formato JSON sea correcto\n\n" + highlightJsonError(args.join(" ").trim()))
                }
            }
        } else {
            let newEmbed: EmbData = {}
            const introEmbed = new EmbedBuilder()
                .setAuthor({ name: "Creador de Embeds", iconURL: client.user?.displayAvatarURL() })
                .setDescription("Desea crear un embed personalizado? Si escribe h!embed <JSON> puede hacerlo directamente en formato JSON, sino continue con el proceso interactivo")
                .setColor("Blue")

            const imsg = await (message.channel as TextChannel).send({ embeds: [introEmbed] })
            await imsg.react("✅")
            await imsg.react("❌")

            const collectorFilter: CollectorFilter<[MessageReaction, User]> = (reaction: MessageReaction, user: User) => {
                return ['✅', '❌'].includes(reaction.emoji.name!) && user.id === message.author.id;
            };
            try {
                const reactions = await imsg.awaitReactions({ filter: collectorFilter, max: 1, time: 60000, errors: ['time'] })

                const reaction = reactions.first();

                if (reaction?.emoji.name === "✅") {
                    if (imsg.deletable) await imsg.delete()
                    embedProcess(sequence, client.user?.displayAvatarURL() ?? "", message, newEmbed, prefix)
                }
                else {
                    if (imsg.deletable) await imsg.delete()
                    return
                }
            } catch {
                await (message.channel as TextChannel).send("Tiempo de espera agotado, proceso cancelado.");
            }
        }
    }
}

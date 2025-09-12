import { EmbedBuilder, Message, TextChannel } from 'discord.js';
import { getUser } from '../Moderacion/models/functions';
import ExtendedClient from '../../classes/extendedClient';
import afkStatus from './req/afkStatus';

export default {
    name: 'afk',
    description: 'Notifica a los demás que estás ausente cuando te mencionen.',
    category: "Info",
    usage: `!afk [duración en minutos o 0 para tiempo indefinido] [mensaje]`,
    examples: ['!afk 0 Jugando Silksong', '!afk 15 Comiendo', '!afk'],
    run: async ({ client, message, args, prefix, contentPrefix }: {
        client: ExtendedClient,
        message: Message,
        args: string[],
        prefix: string,
        contentPrefix: string
    }) => {

        const time = args[0] ? parseFloat(args[0]) : 0;
        let currentStatus = afkStatus[message.author.id] ? afkStatus[message.author.id] : null;
        if (time < 0) return await (message.channel as TextChannel).send("El tiempo debe ser positivo o 0 (indefinido)");
        currentStatus = { minutes: time, start: new Date(), status: currentStatus == null ? true : !currentStatus.status, customMessage: args.join(" ").replace(args[0], '').trim() };
        afkStatus[message.author.id] = currentStatus;

        await (message.channel as TextChannel).send(`Se ha ${currentStatus!.status == false ? 'desactivado' : 'activado'} tu estado AFK${currentStatus!.status == true ? `${currentStatus!.minutes > 0 ? ` por **${currentStatus!.minutes} minutos*\*` : ' **indefinidamente**'}${currentStatus!.customMessage ? ` con el mensaje: **${currentStatus!.customMessage}**` : ''}` : ""}.`);

    }
}
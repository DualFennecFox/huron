import { Message } from 'discord.js';
import ExtendedClient from '../../classes/extendedClient';
import { getAll, getCMD } from '../Moderacion/models/functions';

export = {
    name: "help",
    category: "Info",
    description: 'Te dice todos los comandos del bot o uno en específico',
    usage: '!help [Comando]',
    examples: ["!help", "!help ping"],
    run: async ({ client, message, args, prefix }: {
        client: ExtendedClient,
        message: Message,
        args: string[],
        prefix: string
    }) => {
        if (args[0]) {
            return getCMD(client, message, args[0]);
        } else {
            getAll(client, message, prefix);
        }
    }
}
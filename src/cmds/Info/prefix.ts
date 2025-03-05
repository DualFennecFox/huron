import { Message, TextChannel } from "discord.js";

export default {
    name: "prefix",
    category: "Info",
    description: "Con este comando puedes ver el prefix en el servidor se cambia con !config prefix \"prefix\"",
    usage: '!prefix',
    run: async ({ message, prefix }: { message: Message, prefix: string }) => {
        (message.channel as TextChannel).send(`Mi prefix en este server es **${prefix}**`);
    }
}
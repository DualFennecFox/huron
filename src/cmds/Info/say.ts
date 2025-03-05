import { Message, PermissionFlagsBits, TextChannel } from "discord.js";

export default {
    name: 'say',
    category: "Info",
    description: 'El bot envia un mensaje escrito por un usuario al canal',
    usage: '!say <Mensaje>',
    examples: ['!say Hola Mundo'],
    run: async ({ message, args }: { message: Message, args: string[] }) => {

        let argsresult;
        if (message.guild?.members.me?.permissions.has(PermissionFlagsBits.ManageMessages)) await message.delete()

        argsresult = args.join(" ")
        if (!argsresult) return (message.channel as TextChannel).send("Debes escribir un mensaje para yo enviarlo")

        if (!message.member?.permissions.has(PermissionFlagsBits.MentionEveryone)) {
            argsresult = argsresult.replace(/@/, "@\u200b")
        }
        if (!message.member?.permissions.has(PermissionFlagsBits.ManageMessages)) {

            argsresult = argsresult.replace(/(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li|com)|discordapp\.com\/invite)\/.+[A-z0-9]/, "")

        }

        (message.channel as TextChannel).send(argsresult)
    }
}

import { GuildMember, Message, PermissionFlagsBits, TextChannel } from 'discord.js';

export default {
    name: 'echo',
    category: "Info",
    description: 'El bot envia un mensaje escrito por un usuario a un canal mencionado o con su ID',
    aliases: ['announcement', 'acc'],
    usage: '!echo <Canal> <Mensaje>',
    examples: ['!echo #general Hola Mundo'],
    run: async ({ message, args }: { message: Message, args: string[] }) => {

        let argsresult;

        let id = false
        let mChannel = message.mentions.channels.first() as TextChannel

        if (!mChannel && args[0]) {
            mChannel = message.guild?.channels.cache.get(args[0]) as TextChannel
            id = true
        }

        if (message.guild?.members.me?.permissions.has(PermissionFlagsBits.ManageMessages)) message.delete()

        if (!mChannel) return (message.channel as TextChannel).send({ content: 'Debes mencionar un canal o darme su ID' })
        if (!mChannel.permissionsFor(message.guild?.members.me as GuildMember).has(PermissionFlagsBits.SendMessages)) return (message.channel as TextChannel).send('No tengo permisos para hablar en ese canal')
        if (!mChannel.permissionsFor(message.member as GuildMember).has(PermissionFlagsBits.SendMessages)) return (message.channel as TextChannel).send('No tienes permisos para enviar mensajes en ese canal')

        argsresult = args.join(" ")
        if (!id) argsresult = argsresult.replace(`<#${mChannel.id}>`, '')
        else argsresult = argsresult.replace(args[0], '');

        if (argsresult.length == 0) return (message.channel as TextChannel).send({ content: 'Vuelve a usar el comando, pero di un mensaje para enviar' })

        if (!message.member?.permissions.has(PermissionFlagsBits.MentionEveryone)) {
            argsresult = argsresult.replace(/@everyone/, "@\u200beveryone").replace(/@here/, "@\u200bhere")
        }
        if (!message.member?.permissions.has(PermissionFlagsBits.ManageMessages)) {

            argsresult = argsresult.replace(/(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li|com)|discordapp\.com\/invite)\/.+[A-z0-9]/, "")

            if (message.guild?.members.me?.permissions.has(PermissionFlagsBits.ManageMessages)) await message.delete()
        }
        mChannel.send(argsresult)
    }
}

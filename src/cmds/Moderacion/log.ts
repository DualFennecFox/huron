import { EmbedBuilder, Message, PermissionFlagsBits, TextChannel } from 'discord.js'
import GuildModel, { ILog } from "./models/Guild"
import { updateGuild, changePerm } from "./models/functions"
import ExtendedClient from '../../classes/extendedClient'
import logType from '../../classes/logType'

export default {
    name: 'log',
    category: "Moderacion",
    description: 'Este comando te permite activar los logs y ver cuales están activos, para que funcione debes poner un canal con !logchannel #Canal',
    aliases: ['logs'],
    usage: '!log <evento>',
    examples: ['!log messagedelete', '!log nickname', '!log channel'],
    run: async ({ client, message, args, prefix }: {
        client: ExtendedClient,
        message: Message,
        args: string[],
        prefix: string
    }) => {

        if (!message.member?.permissions.has(PermissionFlagsBits.ManageGuild)) return (message.channel as TextChannel).send("No tienes permisos para usar este comando")

        let active = "";
        let unable = "";
        let command: logType | undefined;
        let method: "enable" | "disable" | undefined;

        const doc = await GuildModel.findOne({ guildID: message.guildId })
        if (!doc?.log) {
            const newGuild = {
                log: {
                    Premium: false,
                    channelCreate: false,
                    channelDelete: false,
                    channelUpdate: false,
                    emojiCreate: false,
                    emojiDelete: false,
                    emojiUpdate: false,
                    banAdd: false,
                    banRemove: false,
                    MemberAdd: false,
                    MemberRemove: false,
                    MemberUpdate: false,
                    guildUpdate: false,
                    inviteCreate: false,
                    inviteDelete: false,
                    messageDelete: false,
                    messageDeleteBulk: false,
                    messageUpdate: false,
                    roleCreate: false,
                    roleDelete: false,
                    roleUpdate: false,
                    userUpdate: false,
                    voiceState: false
                }
            }
            try {
                if (message.guild) await updateGuild(message.guild, newGuild)
            } catch (err) {
                console.error(err)
            }
        }
        for (const key in doc?.log) {
            if (doc?.log[key as keyof ILog] == true && changePerm[key as keyof typeof changePerm] != undefined) {
                active += `${changePerm[key as keyof typeof changePerm]}\n`
            }
            else if (doc.log[key as keyof ILog] == false && changePerm[key as keyof typeof changePerm] != undefined) {
                unable += `${changePerm[key as keyof typeof changePerm]}\n`
            }
        }
        if (args.length == 0) {
            const embed = new EmbedBuilder()
                .setAuthor({ name: "Registros", iconURL: client.user?.displayAvatarURL() })
                .setColor("#FFFF00")
                .setDescription(`Para que funcionen los registros se debe poner un canal con ${prefix}config logchannel enable #Canal-Mencionado, se pueden seleccionar todos los eventos con "All"\n\n**Eventos:**\nchannel, channelcreate, channeldelete, channelupdate, emoji, emojicreate, emojidelete, emojiupdate, bans, ban, unban, member, memberadd, memberremove, memberupdate, guildupdate, message, messagedelete, messageupdate, role, rolecreate, roledelete`)
            embed.setFields([
                {
                    name: "Todos",
                    value: "Canal Creado\nCanal Eliminado\nEmoji Creado\nEmoji Eliminado\nEmoji Actualizado\nBaneo\nDesbaneo\nNuevo Miembro\nMiembro se va\nMiembro Actualizado\nServidor Actualizado\nMensaje Eliminado\nMensaje Editado\nRol Creado\nRol Eliminado"
                }])
            if (active != "") embed.addFields([{ name: "Activados", value: active.replace(/undefined/g, "") }])
            if (unable != "") embed.addFields([{ name: "Desactivados", value: unable.replace(/undefined/g, "") }]);

            (message.channel as TextChannel).send({ embeds: [embed] })
            return
        }
        else if (args[0].toLowerCase() === "enable" || args[0].toLowerCase() === "disable") {
            if (args[0].toLowerCase() === "enable") method = "enable"
            else if (args[0].toLowerCase() === "disable") method = "disable";

            const cmd = args[1].toLowerCase()

            if (client.log.has(cmd)) {
                command = client.log.get(cmd)
            };
            if (command && method) command.run(message, method)
            else return (message.channel as TextChannel).send("Ese no es un evento válido")
        }
        else return (message.channel as TextChannel).send("Dime si quieres activarlo o desactivarlo")
    }
}
import { APIEmbedField, EmbedBuilder, PermissionFlagsBits, Role, TextChannel } from 'discord.js'
import GuildModel from '../cmds/Moderacion/models/Guild'
import { changeRole } from '../cmds/Moderacion/models/functions'

export default async function roleUpdate(oldRole: Role, newRole: Role) {

    const doc = await GuildModel.findOne({ guildID: newRole.guild.id })
    if (!doc) return
    if (doc.log?.roleUpdate == true) {
        if (!doc.LogChannel) return
        const Channel = newRole.guild.channels.cache.get(doc.LogChannel)
        if (!Channel) return
        if (!Channel.permissionsFor(newRole.guild.members.me ?? "")?.has(PermissionFlagsBits.SendMessages)) return

        let name = false
        let newperm = false
        let removeperms = false
        const getremoveperm = []
        let position = false
        let mentionable = false
        let hoist = false
        const getnewperm = []

        const boolean: { [key: string]: string } = {
            "false": "No",
            "true": "Si"
        }

        if (oldRole.name != newRole.name) {
            name = true
        }

        for (const perm of newRole.permissions.toArray()) {
            if (oldRole.permissions.has(PermissionFlagsBits.Administrator)) {
                getnewperm.push("Todos (Administrador)")
                break;
            }
            else if (!oldRole.permissions.has(perm, false)) {
                newperm = true
                getnewperm.push(changeRole[perm])
            }
        }
        for (const perm of oldRole.permissions.toArray()) {
            if (newRole.permissions.has(PermissionFlagsBits.Administrator)) {
                getremoveperm.push("Todos (Administrador)")
                break;
            }
            else if (!newRole.permissions.has(perm, false)) {
                removeperms = true
                getremoveperm.push(changeRole[perm])
            }
        }

        if (oldRole.position != newRole.position) {
            position = true
        }
        if (oldRole.mentionable != newRole.mentionable) {
            mentionable = true
        }
        if (oldRole.hoist != newRole.hoist) {
            hoist = true
        }
        if (name == false && newperm == false && position == false && removeperms == false && mentionable == false && hoist == false) return

        const arr: APIEmbedField[] = []
        const embed = new EmbedBuilder()
            .setAuthor({ name: "Rol Actualizado", iconURL: newRole.guild.iconURL() ?? "" })
            .setFooter({ text: `${newRole.name} | ${newRole.id}` })
            .setColor("#FF0000")
            .setDescription(`<@&${newRole.id}>`)
        if (name == true) arr.push({ name: "Nombre Antes | Después", value: `${oldRole.name} | ${newRole.name}` })
        if (newperm == true) arr.push({ name: "Permisos Agregados", value: `${getnewperm.join(", ")}` })
        if (removeperms == true) arr.push({ name: "Permisos Removidos", value: `${getremoveperm.join(", ")}` })
        if (position == true) arr.push({ name: "Posición", value: `**De:** ${oldRole.rawPosition}\n**A:** ${newRole.rawPosition}` })
        if (mentionable == true) arr.push({ name: "Mencionable", value: `**${boolean[String(newRole.mentionable)]}**` })
        if (hoist == true) arr.push({ name: "Mostrar Separado", value: `**${boolean[String(newRole.hoist)]}**` })

        embed.setFields(arr)

        await (Channel as TextChannel).send({ embeds: [embed] })
    }
}
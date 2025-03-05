import { Role, EmbedBuilder, TextChannel, PermissionFlagsBits } from "discord.js"
import GuildModel from '../cmds/Moderacion/models/Guild'

export default async function roleCreate(role: Role) {

    const doc = await GuildModel.findOne({ guildID: role.guild.id })
    if (!doc) return
    if (doc.log?.roleCreate == true) {
        if (!doc.LogChannel) return
        const Channel = role.guild.channels.cache.get(doc.LogChannel)
        if (!Channel) return
        if (!Channel.permissionsFor(role.guild.members.me ?? "")?.has(PermissionFlagsBits.SendMessages)) return

        const boolean: { [key: string]: string } = {
            "false": "No",
            "true": "Si"
        }
        const embed = new EmbedBuilder()
            .setAuthor({ name: "Rol Creado", iconURL: role.guild.iconURL() ?? "" })
            .setColor("#FF0000")
            .setFooter({ text: `${role.name} | ${role.id}` })
            .setDescription(`<@&${role.id}> \n\n**Color:** ${role.hexColor}\n**Mencionable:** ${boolean[String(role.mentionable)]}\n**Mostrar Separado:** ${boolean[String(role.hoist)]}`)

        await (Channel as TextChannel).send({ embeds: [embed] })
    }
}
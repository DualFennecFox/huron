import { ColorResolvable, GuildBasedChannel, Message, PermissionFlagsBits, TextChannel } from "discord.js"
import GuildModel, { IGuild } from "../cmds/Moderacion/models/Guild"
import { getGuild, updateGuild } from "../cmds/Moderacion/models/functions"
import validateColor from "validate-color"

export default {
    name: "muterole",
    run: async (message: Message, args: string[], method: "enable" | "disable") => {

        if (!message.member?.permissions.has(PermissionFlagsBits.ManageRoles)) return (message.channel as TextChannel).send("No tienes permisos para usar este comando")

        if (method === "enable") {
            if (!args[2]) return (message.channel as TextChannel).send(`Menciona un rol, su ID o crea uno especificandolo`)
            if (!message.guild?.members.me?.permissions.has(PermissionFlagsBits.ManageRoles || PermissionFlagsBits.ManageChannels)) return (message.channel as TextChannel).send("No tengo permisos para Gestionar Roles o Gestionar Canales!")


            let mRole = message.mentions.roles.first() || message.guild.roles.cache.get(args[2])
            if (!mRole) {
                let Color = "#9b9b9b"
                if (args[3]) {
                    Color = args[3].toUpperCase()
                    if (!validateColor(Color)) Color = "#9b9b9b"
                }

                try {
                    const muterole = await message.guild.roles.create({
                        name: args[2],
                        color: Color as ColorResolvable,
                        permissions: []
                    })
                    message.guild.channels.cache.forEach(async (channel: GuildBasedChannel) => {
                        await (channel as TextChannel).permissionOverwrites.create(muterole, {
                            SendMessages: false,
                            CreateInstantInvite: false,
                            AddReactions: false,
                            SendTTSMessages: false,
                            AttachFiles: false,
                            Speak: false
                        })
                    })
                    mRole = muterole
                } catch (err) {
                    console.error(err)
                    return (message.channel as TextChannel).send(`Se ha ocurrido un error al crear o modificar el rol ${mRole}`)
                }
            }
            const doc = await GuildModel.findOne({ guildID: message.guildId })
            if (!doc) {
                const newGuild: Partial<IGuild> = {
                    guildID: message.guildId ?? "",
                    guildName: message.guild.name,
                    guildOwner: message.client.users.cache.get(message.guild?.ownerId ?? "")?.username,
                    guildOwnerID: message.guild.ownerId,
                    prefix: '!',
                    muterole: mRole.id,
                };
                try {
                    await getGuild(message.guild);
                    await updateGuild(message.guild, newGuild)

                } catch (error) {
                    console.error(error);
                }
                return (message.channel as TextChannel).send(`Se ha establecido el Rol **${mRole.name}**`)
            }
            else {

                if (mRole.id == doc?.muterole) return (message.channel as TextChannel).send("Este rol ya fue establecido")

                await updateGuild(message.guild, { muterole: mRole.id })
                return (message.channel as TextChannel).send(`Se ha establecido el Rol **${mRole.name}**`)
            }
        }
        else if (method === "disable") {
            const doc = await GuildModel.findOne({ guildID: message.guildId })
            if (!doc) {
                (message.channel as TextChannel).send("No existe un rol de Muteado")
                return getGuild(message.guild!)
            }
            else if (!doc.muterole) return (message.channel as TextChannel).send("No existe un rol de Muteado")
            else {
                await updateGuild(message.guild!, { muterole: "" })

                await (message.channel as TextChannel).send("Se ha eliminado el rol")
            }
        }
    }
}

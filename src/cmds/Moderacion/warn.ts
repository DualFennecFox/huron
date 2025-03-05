import GuildModel from './models/Guild';
import { search, getUser, getGuild, updateGuild } from './models/functions';
import { Message, PermissionFlagsBits, TextChannel } from 'discord.js';
import ExtendedClient from '../../classes/extendedClient';

export default {
    name: 'warn',
    category: "Moderacion",
    description: 'Este comando warnea al usuario mencionado con su ID o mención, también puedes dar una razón de ello',
    usage: '!warn <Usuario> [Razón]',
    aliases: ['strike'],
    examples: ['!warn @Wumpus', '!warn 12345678987654321', '!warn @Wumpus Presumir ser Wumpus'],
    run: async ({ client, message, args, prefix, contentPrefix }: {
        client: ExtendedClient,
        message: Message,
        args: string[],
        prefix: string,
        contentPrefix: string
    }) => {

        if (!message.member?.permissions.has(PermissionFlagsBits.BanMembers || PermissionFlagsBits.KickMembers)) return (message.channel as TextChannel).send("No tienes permisos para usar este comando!");
        if (args.length == 0) return (message.channel as TextChannel).send("Debes mencionar a un usuario o darme su id")

        let bUser = message.mentions.members?.first() || message.guild?.members.cache.get(args[0]);
        if (contentPrefix !== prefix) bUser = message.guild?.members.cache.get(getUser(args[0], client)?.id ?? "")

        if (!bUser) {
            const UserID = args[0].replace(/([^0-9])/g, '')
            bUser = await message.guild?.members.fetch(UserID);
        }
        if (!bUser) return (message.channel as TextChannel).send("Ese no parece ser un usuario valido")
        if (!message.guild?.members.cache.get(bUser?.id)) return (message.channel as TextChannel).send("Ese no parece ser un usuario valido")

        let bReason = args.slice(1).join(" ");
        if (!bReason) bReason = "No se específico una razón"

        if (bUser.id === message.author.id) return (message.channel as TextChannel).send("No te puedes advertir a ti mismo")
        if (bUser.id === client.user?.id) return (message.channel as TextChannel).send("No me puedo advertir a mi mismo")

        const muterole = bUser.roles.highest
        if (message.guild?.ownerId !== message.author.id) {

            if (message.member.roles.highest.comparePositionTo(muterole) < 1) {
                return (message.channel as TextChannel).send("Tus roles no son lo suficientemente altos para advertir a este usuario");

            }
        }

        const db = await GuildModel.findOne({ guildID: message.guildId })

        const result = await GuildModel.findOne({ guildID: message.guildId }, { warns: { $elemMatch: { warnUserID: bUser.id } } })

        let warnLevel
        const doc = db ? search(bUser.id, db.warns) : null
        if (!result) {
            warnLevel = 0
            const newGuild = new GuildModel({
                guildID: message.guild.id,
                guildName: message.guild.name,
                guildOwner: client.users.cache.get(message.guild.ownerId)?.username,
                guildOwnerID: message.guild.ownerId,
                prefix: '!',
                JoinMsg: "",
                JoinBool: false,
                LeaveMsg: "",
                LeaveBool: false,
                WelcomeChannel: "",
                LeaveChannel: "",
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
                },
                warns: ({
                    warnUser: bUser.user.username,
                    warnUserID: bUser.id,
                    warnedByID: [message.author.id],
                    warnReason: [bReason],
                    warnLevel: warnLevel + 1
                })
            })
            await getGuild(message.guild)
            await updateGuild(message.guild, newGuild)
        }
        else if (!doc) {
            warnLevel = 0
            db?.warns.push({
                warnUser: bUser.user.username,
                warnUserID: bUser.id,
                warnedByID: [message.author.id],
                warnReason: [bReason],
                warnLevel: warnLevel + 1,
            })
            db?.save()
        }
        else {
            warnLevel = result.warns[0].warnLevel

            doc.warnedByID.push(message.author.id)
            doc.warnReason.push(bReason)
            doc.warnLevel = warnLevel + 1
            db?.save()
        }
        let number
        if (doc) number = doc.warnLevel
        else number = 1
        warnLevel = number

        await (message.channel as TextChannel).send(`Se ha advertido a ${bUser}, tiene ${warnLevel} warns`)

        if (!bUser.user.bot) {
            bUser.user.send(`Has sido advertido en **${message.guild.name}** Por la razón: ${bReason}`)
        }
    }
}

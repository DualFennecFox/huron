const Guild = require('./models/Guild')
const mongoose = require('mongoose');
const {search, createGuild, getUser, perms } = require('./models/functions');

    module.exports = {
    name : 'warn',
    category: "Moderacion",
    description : 'Este comando warnea al usuario mencionado con su ID o mención, también puedes dar una razón de ello',
    usage: '!warn <Usuario> [Razón]',
    aliases: ['strike'],
    examples: ['!warn @Wumpus', '!warn 12345678987654321', '!warn @Wumpus Presumir ser Wumpus'],
    run: async (client , message, args, prefix, contentPrefix) => {

    if(!message.member.permissions.has(perms.ban_members || perms.administrator || perms.kick_members)) return message.channel.send("No tienes permisos para usar este comando!");
    if (!args.length >= 1) return message.channel.send("Debes mencionar a un usuario o darme su id")

    let bUser = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (contentPrefix !== prefix) bUser = message.guild.members.cache.get(getUser(args[0], client))

    if (!bUser) {
    let UserID = args[0].replace(/([^0-9])/g, '')
           try {
            User = await client.users.fetch(UserID);
           } catch (err) {
               return message.channel.send("Ese no parece ser un usuario valido")
           }
        }
    if (!bUser) return message.channel.send("Ese no parece ser un usuario valido")
    if (!message.guild.members.cache.get(bUser?.id)) return message.channel.send("Ese no parece ser un usuario valido")

    let bReason = args.slice(1).join(" ");
    if(!bReason) bReason = "No se específico una razón"

    if (bUser.id === message.author.id) return message.channel.send("No te puedes advertir a ti mismo")
    if (bUser.id === client.user.id) return message.channel.send("No me puedo advertir a mi mismo")  

    let muterole = bUser.roles.highest
    if (message.guild.ownerId !== message.author.id) {

    if (message.member.roles.highest.comparePositionTo(muterole) < 1) {
    return message.channel.send("Tus roles no son lo suficientemente altos para advertir a este usuario");
    
    }
}

   let db = await Guild.findOne({ guildID: message.guild.id })

   Guild.findOne({ guildID: message.guild.id}, {warns: { $elemMatch: { warnUserID: bUser.id } } }).then((result) => {

    let warnLevel
    let doc = search(bUser.id, db.warns)
        if (!result) {
           let number = 0
           warnLevel = parseInt(number)
           const newGuild = {
            guildID: message.guild.id,
            guildName: message.guild.name,
            guildOwner: client.users.cache.get(message.guild.ownerId).username,
            guildOwnerID: message.guild.ownerID,
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
                _id: mongoose.Types.ObjectId(),
                warnUser: bUser.user.username,
                warnUserID: bUser.id,
                warnedByID: [message.author.id],
                warnReason: [bReason],
                warnLevel: warnLevel + 1
                })
            }
            createGuild(newGuild)
        } 
        else if (!doc) {
            let number = 0
            warnLevel = parseInt(number)
            db.warns.push({
                _id: mongoose.Types.ObjectId(),
                warnUser: bUser.user.username,
                warnUserID: bUser.id,
                warnedByID: [message.author.id],
                warnReason: [bReason],
                warnLevel: warnLevel + 1,
                })
            db.save()
        }
        else {
            let number = result.warns[0].warnLevel
            warnLevel = parseInt(number)

            doc.warnedByID.push(message.author.id)
            doc.warnReason.push(bReason)
            doc.warnLevel = warnLevel + 1
            db.save()
        }
        let number
       if (doc) number = doc.warnLevel
       else number = 1
        warnLevel = parseInt(number)
        
       message.channel.send(`Se ha advertido a ${bUser}, tiene ${warnLevel} warns`)

       if (!bUser.user.bot) {
       bUser.user.send(`Has sido advertido en **${message.guild.name}** Por la razón: ${bReason}`)
       }
    }).catch(err => {
        console.error(err)
        return message.channel.send("Hubo un error al advertir a este usuario")
    })
    }
}

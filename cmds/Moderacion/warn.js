const Discord = require('discord.js');
const Guild = require('./models/Guild')
const mongoose = require('mongoose');
const { updateGuild, createGuild } = require('./models/functions');
const { bulkWrite } = require('./models/Guild');
    module.exports = {
    name : 'warn',
    category: "Moderacion",
    description : 'Este comando warnea al usuario mencionado con su ID o mención, también puedes dar una razón de ello',
    aliases: ['Warn', 'WARN'],
    usage: '!warn',
    examples: ['!warn @Firulais', '!warn 556540723235651584', '!warn @Firulais Razon'],
    run: async (client , message, args) => {

    if (message.author.id !== process.env.OWNER) return

    if(!message.member.hasPermission("BAN_MEMBERS" || "ADMINISTRATOR") || !message.guild.owner) return message.channel.send("No tienes permisos para usar este comando!");

    if (!args.length >= 1) return message.channel.send("Debes mencionar a un usuario o darme su id")
    let bUser = message.guild.member(message.mentions.members.first() || message.guild.members.cache.get(args[0]));
    if(!bUser) return message.channel.send("Ese no parece ser un usuario valido");
    
    let bReason = args.slice(1).join(" ");
    if(!bReason) bReason = "No se específico una razón"

    if (bUser.id === message.author.id) return message.channel.send("No te puedes warnear a ti mismo")  
    if(bUser.hasPermission("BAN_MEMBERS" || "ADMINISTRATOR") || !message.guild.owner) return message.channel.send("No puedes advertir a un moderador!");
 
   let db = await Guild.findOne({ guildID: message.guild.id })

   let userID = Guild.findOne({ guildID: message.guild.id}, {warns: { $elemMatch: { warnUserID: bUser.id } } }).then((result) => {
       console.log(result.warns)
   
        if (!result) {
           let number = 0
           let warnLevel = parseInt(number)
           const newGuild = {
            guildID: guild.id,
            guildName: guild.name,
            guildOwner: guild.owner.user.username,
            guildOwnerID: guild.ownerID,
            prefix: '!',
            JoinMsg: "",
            JoinBool: false,
            LeaveMsg: "",
            LeaveBool: false,
            WelcomeChannel: "",
            LeaveChannel: "", 
            warns: ({
                _id: mongoose.Types.ObjectId(),
                warnUser: bUser.user.username,
                warnUserID: bUser.id,
                warnedByID: [message.author.id],
                warnReason: [bReason],
                warnLevel: warnLevel++
                })
            }
            createGuild(newGuild)
        } 
        else if (!result.warns[0] || !result.warns[0].warnUserID) {
            let number = 0
            let warnLevel = parseInt(number)
            db.warns.push({
                _id: mongoose.Types.ObjectId(),
                warnUser: bUser.user.username,
                warnUserID: bUser.id,
                warnedByID: [message.author.id],
                warnReason: [bReason],
                warnLevel: warnLevel++
                })
            db.save()
        }
        else {
            let number = result.warns[0].warnLevel
            let warnLevel = parseInt(number)

            result.warns[0].warnedByID.push(message.author.id)
            result.warns[0].warnReason.push(bReason)
            result.warns[0].warnLevel = warnLevel++
            db.save()
        }
        let number = result.warns[0].warnLevel
        let warnLevel = parseInt(number)
        
       message.channel.send(`Se ha advertido a ${bUser}, tiene ${warnLevel++} warns`)
    }).catch(err => {
        console.error(err)
        return message.channel.send("Hubo un error al advertir a este usuario")
    })
    }
}
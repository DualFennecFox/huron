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
        function search(nameKey, myArray) {
        for (var i = 0; i < myArray.length; i++) {
            if (myArray[i].warnUserID === nameKey) {
                return myArray[i];
            }
        }
    }
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

   let warnArr = await Guild.findOne({ guildID: message.guild.id }, {warns: { $elemMatch: { warnUserID: bUser.id }}})
   await Guild.findOne({ guildID: message.guild.id}, {warns: { $elemMatch: { warnUserID: bUser.id } } }).then((result) => {
    console.log(result)
    if (result) console.log(result.warns)
    let warnLevel
    let doc = search(bUser.id, result.warns)
        if (!result) {
           let number = 0
           warnLevel = parseInt(number)
           const newGuild = {
            guildID: message.guild.id,
            guildName: message.guild.name,
            guildOwner: message.guild.owner.user.username,
            guildOwnerID: message.guild.ownerID,
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
                warnLevel: warnLevel + 1
                })
            db.save()
        }
        else {
            let number = result.warns[0].warnLevel
            warnLevel = parseInt(number)

            result.warns[0].warnedByID.push(message.author.id)
            result.warns[0].warnReason.push(bReason)
            result.warns[0].warnLevel = warnLevel + 1
            result.save()
        }
        let number
       if (result.warns && doc.warnLevel) number = result.warns[0].warnLevel
       else number = 1
        warnLevel = parseInt(number)
        
       message.channel.send(`Se ha advertido a ${bUser}, tiene ${warnLevel} warns`)
    }).catch(err => {
        console.error(err)
        return message.channel.send("Hubo un error al advertir a este usuario")
    })
    }
}
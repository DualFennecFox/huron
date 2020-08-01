const Discord = require('discord.js');
const Guild = require('./models/Guild')
const mongoose = require('mongoose');
const { updateGuild, createGuild } = require('./models/functions');
    module.exports = {
    name : 'warn',
    category: "Moderacion",
    description : 'Este comando warnea al usuario mencionado con su ID o mención, también puedes dar una razón de ello',
    aliases: ['Warn', 'WARN'],
    usage: '!warn',
    examples: ['!warn @Firulais', '!warn 556540723235651584', '!warn @Firulais Razon'],
    run: async (client , message, args) => {

    if (message.author.id !== process.env.OWNER) return
    if (!args.length >= 1) return message.channel.send("Debes mencionar a un usuario o darme su id")
    let bUser = message.guild.member(message.mentions.members.first() || message.guild.members.cache.get(args[0]));
    if(!bUser) return message.channel.send("Ese no parece ser un usuario valido");
    
    let bReason = args.slice(1).join(" ");
    if(!bReason) bReason = "No se específico una razón"

    if (bUser.id === message.author.id) return message.channel.send("No te puedes warnear a ti mismo")  
    if(!message.member.hasPermission("BAN_MEMBERS" || "ADMINISTRATOR") || !message.guild.owner) return message.channel.send("No tienes permisos para usar este comando!");
    if(bUser.hasPermission("BAN_MEMBERS" || "ADMINISTRATOR") || !message.guild.owner) return message.channel.send("No puedes warnear a un moderador!");
 
   let db = await Guild.findOne({ guildID: message.guild.id })

   let userID = Guild.findOne({ guildID: message.guild.id}, {warns: { $elemMatch: { warnUserID: bUser.id } } }).then((result) => {
       console.log(result.warns[0].warnUserID)
   
        if (!result) {
           let warnLevel = 0
            db.warns.push({ 
                _id: mongoose.Types.ObjectId(),
                warnUser: bUser.user.username,
                warnUserID: bUser.id,
                warninfo: [{
                    warnedBy: message.author.tag,
                    warnedByID: message.author.id,
                    warnReason: bReason,
                    warnLevel: warnLevel + 1
                }]
            })
        } 
        else {
            userID.warns.addToSet({
                _id: mongoose.Types.ObjectId(),
                warnUser: bUser.user.username,
                warnUserID: bUser.id,
            })
            userID.warns.push({warninfo: [{
                warnedBy: message.author.tag,
                warnedByID: message.author.id,
                warnReason: bReason,
                warnLevel: warnLevel + 1
            }]})
        }
        db.save()
       message.channel.send(`Se ha warneado a ${bUser}, tiene ${warnLevel} warns`)
    }).catch(err => {
        console.error(err)
        return message.channel.send("Hubo un error al warnear a este usuario")
    })
    }
}
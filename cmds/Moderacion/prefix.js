const Discord = require('discord.js');
const mongoose = require('mongoose')
const fs = require('fs')
const Guild = require('./models/Guild')
const { getGuild, updateGuild, createGuild } = require('./models/functions')
module.exports = {
    name: "prefix",
    category: "Moderacion",
    description : "Con este comando puedes ver tu prefix o cambiarlo elijiendo uno",
    aliases: ['Prefix', 'PREFIX'],
    usage: '!prefix',
    examples: ['!prefix -', '!prefix --='],
    run: async (client, message, args, prefix) => {
            if (args.length === 0){
            message.channel.send(`Mi prefix en este server es ${prefix}`);
        } else if (args.length === 1){
            if(!message.member.hasPermission("KICK_MEMBERS" || "BAN_MEMBERS" || "ADMINISTRATOR") || !message.guild.owner) return message.channel.send("No tienes permisos para usar este comando!")
            let nPrefix = args.join(' ');

  
  await updateGuild(message.guild, { prefix: nPrefix });

    message.channel.send(`Su nuevo Prefix es ${nPrefix}`)
    .catch(err => {
        console.log(err);
    })
    }
}
}
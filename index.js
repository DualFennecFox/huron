const Discord = require('discord.js');
const fs = require('fs');
require('dotenv-flow').config();
const client = new Discord.Client();
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
const mongoose = require("mongoose");
const Guild = require('./cmds/Moderacion/models/Guild');
const { checkDays } = require('./cmds/Moderacion/models/functions');
mongoose.connect(`${process.env.MONGOURI}/Guild`, { useNewUrlParser: true, useUnifiedTopology: true })
require('./util/eventLoader')(client);

client.categories = fs.readdirSync("./cmds/");

fs.readdir("./cmds/", (files) => {

["command"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
}); 
});

client.on('userUpdate', (oldUser, newUser) => {
    Guild.findOne({ guildID: newUser.guild.id }).then(doc => {
        if (!doc) return
        if (doc.log.userUpdate == true) {
          if (!doc.LogChannel) return
          let Channel = newMember.guild.channels.cache.get(doc.LogChannel)
          if (!Channel) return
          if (!Channel.permissionsFor(newUser.guild.me).has("SEND_MESSAGES")) return

        let name = false
        let avatar = false
    
      if (newUser.tag != oldUser.tag) {
        nickname = true
      }
      if (oldUser.displayAvatarURL() != newUser.displayAvatarURL())
        if (avatar == true) {
          iconURL = oldUser.displayAvatarURL()
        } else {
          iconURL = newUser.displayAvatarURL()
        }
      
        if (name == false && newRole == false && removeRole == false && avatar == false && nickname == false) return
      
        const embed = new Discord.MessageEmbed()
        .setAuthor("Usuario Actualizado", iconURL)
        .setThumbnail(newUser.displayAvatarURL())
        .setFooter(`${newUser.username} | ${newUser.id}`)
        .setColor("#FF0000")
        if (name == true) embed.addField("Nombre Antes | Después", `${oldUser.tag} | ${newUser.tag}`)
        if (avatar == true) embed.addField("Avatar Actualizado", `[Antes](${oldUser.displayAvatarURL({ dynamic: true })}) | [Después](${newUser.displayAvatarURL({ dynamic: true })})`)
      
        Channel.send({ embed })
      }
      }).catch(err => {
        console.error(err)
        })
})

client.login(process.env.TOKEN);
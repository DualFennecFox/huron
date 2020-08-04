const Discord = require('discord.js');
const fs = require('fs');
require('dotenv-flow').config();
const client = new Discord.Client();
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
const mongoose = require("mongoose");
const ytdl = require('ytdl-core');
const Youtube = require("simple-youtube-api");
youtube = new Youtube(process.env.YOUTUBE_API_KEY)
const musicData = require("./cmds/Musica/requirements/musicData")
const Guild = require('./cmds/Moderacion/models/Guild')
const config = require('./cmds/Moderacion/models/config');
const { getGuild, updateGuild, createGuild, checkDays } = require('./cmds/Moderacion/models/functions');
mongoose.connect(`${process.env.MONGOURI}/Guild`, { useNewUrlParser: true, useUnifiedTopology: true })
const DBL = require('dblapi.js')
const dbl = new DBL(process.env.DBL, client)

let prefix;
const token = process.env.TOKEN;
const owner = process.env.OWNER

var opts = {
  maxResults: 10,
  key: process.env.YOUTUBE_API_KEY
}

client.categories = fs.readdirSync("./cmds/");


fs.readdir("./cmds/", (files) => {

["command"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
}); 
});
    
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  const scount = client.guilds.cache.size
  dbl.postStats(client.guilds.cache.size)
  client.user.setPresence({
    status: "online",
    activity: {
        name: `Estoy en ${scount} Servidores!`,
        type: "WATCHING",
        url: "https://www.twitch.tv/unfirulais"
    }

}); 
});

client.on('message', (message) => {
  if (message.channel.type === "dm") return;

    Guild.findOne({ guildID: message.guild.id }).then((result) => {
     if (result) prefix = result.prefix
     else prefix = '!'
     }).then(() => {
    if (message.author.bot) return;
    
    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    let cmd = args.shift().toLowerCase();
    let command;

    if (message.content === "Reset Status") {
      if (message.author.id !== owner) return
      
      const scount = client.guilds.cache.size
      client.user.setPresence({
        status: "online",
        activity: {
            name: `Estoy en ${scount} Servidores!`,
            type: "WATCHING",
            url: "https://www.twitch.tv/unfirulais"
        }
    }); 
    }
    if (message.content === "<@728100449047019534>" || message.content === "<@!728100449047019534>") {
     message.channel.send(`Mi prefix en este server es ${prefix}, si es la primera vez que me usa escriba ${prefix}help`)
   }
 
    if (!message.content.startsWith(prefix)) return;

     if (client.commands.has(cmd)) {
    message.guild.members.cache.filter(user => user.user.bot !== user.user.id).map(member => `<@!<${member.id}>`)
       command = client.commands.get(cmd);
     } else {
       command = client.commands.get(client.aliases.get(cmd));
     }
       if (command) command.run(client, message, args, prefix);
  }).catch(err => {
    console.error(err)
  })
   });


client.on('guildCreate', async gData => {
  const scount = client.guilds.cache.size
  dbl.postStats(client.guilds.cache.size)
  client.user.setPresence({
    status: "online",
    activity: {
        name: `Estoy en ${scount} Servidores!`,
        type: "WATCHING",
        url: "https://www.twitch.tv/unfirulais"
    }
})
getGuild(gData)
})
client.on('guildDelete', async gData => {
const scount = client.guilds.cache.size
dbl.postStats(client.guilds.cache.size)
client.user.setPresence({
  status: "online",
  activity: {
      name: `Estoy en ${scount} Servidores!`,
      type: "WATCHING",
      url: "https://www.twitch.tv/unfirulais"
  }
})
let data = Guild.findOne({ guildID: gData.id }).then((result) => {
  if (!result) return;
  else return result.remove()
}).catch(err => {
  console.error(err)
})
});

client.on("channelCreate", channel => {
  if (channel.type === "dm") return
  Guild.findOne({ guildID: channel.guild.id }).then(doc => {
    if (!doc) return
    if (doc.log.channelCreate == true) {
      if (!doc.LogChannel) return
      let Channel = channel.guild.channels.cache.get(doc.LogChannel)
      if (!Channel) return
      if (!Channel.permissionsFor(channel.guild.me).has("SEND_MESSAGES")) return

      let type = {
        "category": "Categoría",
        "text": "Texto",
        "voice": "Voz",
        "news": "Noticias",
        "store": "Tienda",
        "unknown": "Desconocido"
      }
      const embed = new Discord.MessageEmbed()
      .setAuthor("Canal Creado", channel.guild.iconURL())
      .setColor("#FF0000")
      .setDescription(`Se ha creado el canal **${channel.name}**`)
      .addField("Tipo de canal", type[channel.type])
      .setFooter(`${channel.name} | ${channel.id}`);

  Channel.send({ embed })
    } 
  }).catch(err => {
    console.error(err)
  })
});

client.on("channelDelete", channel => {
  if (channel.type === "dm") return
  Guild.findOne({ guildID: channel.guild.id }).then(doc => {
  if (!doc) return
  if (doc.log.channelDelete == true) {
    if (!doc.LogChannel) return
    let Channel = channel.guild.channels.cache.get(doc.LogChannel)
    if (!Channel) return
    if (!Channel.permissionsFor(channel.guild.me).has("SEND_MESSAGES")) return

    let type = {
      "category": "Categoría",
      "text": "Texto",
      "voice": "Voz",
      "news": "Noticias",
      "store": "Tienda",
      "unknown": "Desconocido"
    }
    
    const embed = new Discord.MessageEmbed()
      .setAuthor("Canal Eliminado", channel.guild.iconURL())
      .setColor("#FF0000")
      .setDescription(`Se ha eliminado el canal **${channel.name}**`)
      .addField("Creado", checkDays(channel.createdAt))
      .addField("Tipo de canal", type[channel.type])
      .setFooter(`${channel.name} | ${channel.id}`);

  Channel.send({ embed })
  }
  }).catch(err => {
    console.error(err)
  })
})

client.on('guildMemberAdd', member => {
  Guild.findOne({ guildID: member.guild.id }).then(doc => {
  if (!doc) return
  if (doc.JoinBool == true) {
  if (!doc.JoinMsg) return
  if (!doc.WelcomeChannel) return
  let Channel = member.guild.channels.cache.get(doc.WelcomeChannel)
  if (!Channel) return
  if (!Channel.permissionsFor(member.guild.me).has("SEND_MESSAGES")) return
  
  let msg = doc.JoinMsg.replace("{user}", member).replace("{server}", member.guild.name).replace("{username}", member.user.tag).replace("{members}", member.guild.memberCount).replace("{owner}", member.guild.owner.user.tag)
 
 Channel.send(msg)
  }
 if (doc.log.MemberAdd == true) {
  if (!doc.LogChannel) return
  let Channel = member.guild.channels.cache.get(doc.LogChannel)
  if (!Channel) return
  if (!Channel.permissionsFor(member.guild.me).has("SEND_MESSAGES")) return

  const embed = new Discord.MessageEmbed()
  .setAuthor(member.user.tag, member.user.displayAvatarURL())
  .setColor("#FF0000")
  .setDescription(`**${member.user.tag}** Se ha unido a el servidor`)
  .addField("Creado", checkDays(member.user.createdAt))
  .setFooter(`${member.user.username} | ${member.user.id}`);

  Channel.send({ embed })
}
}).catch(err => {
  console.error(err)
})
 })

client.on('guildMemberRemove', member => {
  Guild.findOne({ guildID: member.guild.id }).then(doc => {
    if (!doc) return
    if (doc.LeaveBool == true) {
    if (!doc.LeaveMsg) return
    if (!doc.LeaveChannel) return
    let Channel = member.guild.channels.cache.get(doc.LeaveChannel)
    if (!Channel) return
    if (!Channel.permissionsFor(member.guild.me).has("SEND_MESSAGES")) return

    let msg = doc.LeaveMsg.replaceAll("{user}", member).replace("{server}", member.guild.name).replace("{username}", member.user.tag).replace("{members}", member.guild.memberCount).replace("{owner}", member.guild.owner.user.tag)

    Channel.send(msg)
    }
    if (doc.log.MemberRemove == true) {
      if (!doc.LogChannel) return
      let Channel = member.guild.channels.cache.get(doc.LogChannel)
      if (!Channel) return
      if (!Channel.permissionsFor(member.guild.me).has("SEND_MESSAGES")) return

      const embed = new Discord.MessageEmbed()
      .setAuthor(member.user.tag, member.user.displayAvatarURL())
      .setColor("#FF0000")
      .setDescription(`**${member.user.tag}** Ha dejado el servidor`)
      .addField("Creado", checkDays(member.user.createdAt))
      .addField("Miembro Desde", checkDays(member.joinedAt))
      .addField("Roles", member.roles.cache.filter(r => r.name !== "@everyone").map(r => `<@&${r.id}>`).join(", "))
      .setFooter(`${member.user.username} | ${member.user.id}`);

      Channel.send({ embed })
    }
  }).catch(err => {
    console.error(err)
  })
})

client.on("guildMemberUpdate", (oldMember, newMember) => {
  
  Guild.findOne({ guildID: newMember.guild.id }).then(doc => {
  if (!doc) return
  if (doc.log.MemberUpdate == true) {
    if (!doc.LogChannel) return
    let Channel = newMember.guild.channels.cache.get(doc.LogChannel)
    if (!Channel) return
  newMember.fetch()
  let name = false
  let newRole = false
  let getNewRole;
  let removeRole = false
  let getRemovedRole;
  let avatar = false
  let nickname = false
  let iconURL

  console.log(oldMember)
  console.log(newMember)

  if (newMember.user.username != oldMember.user.username) {
  name = true
  }
  for (const role of newMember.roles.cache.map(x => x.id)) {
    if (!oldMember.roles.cache.has(role)) {
        newRole = true
        getNewRole = newMember.guild.roles.cache.get(role)
    }
}
for (const role of oldMember.roles.cache.map(x => x.id)) {
  if (!newMember.roles.cache.has(role)) {
      removeRole = true
      getRemovedRole = newMember.guild.roles.cache.get(role)
  }
}

  if (newMember.user.avatarURL() != oldMember.user.avatarURL()) {
    avatar = true
  }
if (newMember.nickname !== oldMember.nickname) {
  nickname = true
}
  if (avatar == true) {
    iconURL = oldMember.user.displayAvatarURL()
  } else {
    iconURL = newMember.user.displayAvatarURL()
  }

  if (name == false && newRole == false && removeRole == false && avatar == false && nickname == false) return

  const embed = new Discord.MessageEmbed()
  .setAuthor(newMember.user.tag, iconURL)
  .setThumbnail(newMember.user.displayAvatarURL())
  .setFooter(`${newMember.user.username} | ${newMember.user.id}`)
  .setColor("#FF0000")
  if (name == true) embed.addField("Nombre Antes | Después", `${oldMember.user.tag} | ${newMember.user.tag}`)
  if (newRole == true) embed.addField("Nuevo Rol", `<@&${getNewRole.id}>`)
  if (removeRole == true) embed.addField("Rol Removido",`<@&${getRemovedRole.id}>`)
  if (avatar == true) embed.addField("Avatar Actualizado", `[Antes](${oldMember.user.displayAvatarURL({ dynamic: true })}) | [Después](${newMember.user.displayAvatarURL({ dynamic: true })})`)
  if (nickname == true) embed.addField("Apodo Antes | Después", `${oldMember.displayName} | ${newMember.displayName}`)

  Channel.send({ embed })
}
}).catch(err => {
  console.error(err)
  })
})

client.on('emojiCreate', emoji => {
  Guild.findOne({ guildID: emoji.guild.id }).then(doc => {
    if (!doc) return
    if (doc.log.emojiCreate == true) {
      if (!doc.LogChannel) return
      let Channel = emoji.guild.channels.cache.get(doc.LogChannel)
      if (!Channel) return

      const embed = new Discord.MessageEmbed()
      .setAuthor("Emoji Creado", `https://cdn.discordapp.com/emojis/${emoji.id}.png`)
      .setColor("#FF0000")
      .setDescription(`<:${emoji.name}:${emoji.id}> | ${emoji.name}`)
      .setThumbnail(`https://cdn.discordapp.com/emojis/${emoji.id}.png`)
      .setFooter(`ID: ${emoji.id}`);

      Channel.send({ embed })
    }
  }).catch(err => {
    console.error(err)
  })
})

client.login(process.env.TOKEN);
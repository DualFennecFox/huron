const Discord = require("discord.js");
const { perms } = require('../Moderacion/models/functions');

module.exports = {
    name : 'server-info',
    category: "Info",
    description : 'Este comando muestra la información del server, como el nombre, el id, el dueño, Etc... Se pueden ver los roles del servidor con \"roles\" y los canales con \"channels\" ',
    aliases: ['serverinfo'],
    usage: '!server-info',
    run: async (client , message, args) => {
    function checkDays(date) {
        let now = new Date();
        let diff = now.getTime() - date.getTime();
        let days = Math.floor(diff / 86400000);
        return `Hace ${days} ${days == 1 ? "día" : "días"}`;
    };
    let verifLevels = {
        "NONE": "No Hay",
        "LOW": "Bajo",
        "MEDIUM": "Medio",
        "HIGH": "Alto",
        "VERY_HIGH": "Muy Alto"
    };

    const roleEmbed = new Discord.MessageEmbed()
    if (args[0] == "roles" || args[0] === 'r' || args[0] === 'role') {

        if (message.guild.roles.cache.size == 1) return message.channel.send({ content: "Este servidor no tiene roles" })
       if(!message.member.permissions.has(perms.administrator || perms.manage_roles)) return message.channel.send({ content: "No tienes permisos para ver los roles del servidor"})
       let roles = await message.guild.roles.cache.map(r => `<@&${r.id}>`).join(", ")

       await message.channel.send({ embeds: [roleEmbed.setColor("RANDOM").setDescription(roles).setAuthor(`Roles del servidor`, message.guild.iconURL()).setThumbnail(message.guild.iconURL()).setFooter(`${message.guild.name} | ${message.guild.id}`)]})
    }
    else if (args[0] === "channels" || args[0] === "channel" || args[0] === "c") {

        if (message.guild.channels.cache.size == 0) return message.channel.send({ content: "Este servidor no tiene canales" })

        if(!message.member.permissions.has(perms.administrator || perms.manage_channels)) return message.channel.send({ content: "No tienes permisos para ver los canales del servidor"})
        const channelEmbed = new Discord.MessageEmbed()
        let channels = await message.guild.channels.cache.filter(channel => channel.type === "GUILD_TEXT" || channel.type === "GUILD_NEWS" || channel.type === "GUILD_STORE").map(channel => `<#${channel.id}>`).join(", ")

        await message.channel.send({ embeds: [channelEmbed.setColor("RANDOM").setDescription(channels).setAuthor(`Canales del servidor`, message.guild.iconURL()).setThumbnail(message.guild.iconURL()).setFooter(`${message.guild.name} | ${message.guild.id}`)]})
    }
    else {
       let channels = message.guild.channels.cache.size 
       let textChannel = message.guild.channels.cache.filter(channel => channel.type === "GUILD_TEXT").size
       let voiceChannel = message.guild.channels.cache.filter(channel => channel.type === "GUILD_VOICE").size
       let newsChannel = message.guild.channels.cache.filter(channel => channel.type === "GUILD_NEWS").size
       let storeChannel = message.guild.channels.cache.filter(channel => channel.type === "GUILD_STORE").size
       let stageChannel = message.guild.channels.cache.filter(channel => channel.type === "GUILD_STAGE_VOICE").size 

       let channelName = `Canales | ${textChannel == 0 ? "" : `Texto | `}${voiceChannel == 0 ? "" : `Voz | `}${newsChannel == 0 ? "" : `Noticias | `}${storeChannel == 0 ? "" : "Tienda | "}${stageChannel == 0 ? "" : "Estadios"}`
       let channelOrder = `${textChannel == 0 ? "" : `${textChannel} | `}${voiceChannel == 0 ? "" : `${voiceChannel} | `}${newsChannel == 0 ? "" : `${newsChannel} | `}${storeChannel == 0 ? "" : `${storeChannel} | `} ${stageChannel == 0 ? "" : stageChannel}`

    const embed = new Discord.MessageEmbed()
        .setAuthor(message.guild.name, message.guild.iconURL())
        .setColor("RANDOM")
        .addField("Nombre", message.guild.name, true)
        .addField("ID", message.guild.id, true)
        .addField("Dueñ@", message.guild.members.cache.get(message.guild.ownerId).toString(), true)
        .addField("Miembros | Usuarios | Bots", `${message.guild.members.cache.size} | ${message.guild.members.cache.filter(member => !member.user.bot).size} | ${message.guild.members.cache.filter(member => member.user.bot).size}`, true)
        .addField("Nivel de Verificación", verifLevels[message.guild.verificationLevel], true)
        .addField(channelName, `${channels} | ${channelOrder}`, true)
        .addField("Creado a las", `${message.guild.createdAt.toUTCString().substr(0, 16)} (${checkDays(message.guild.createdAt)})`, true)
        .setThumbnail(message.guild.iconURL({ format: "png", dynamic: true }))

        if (message.guild.roles.cache.size != 1) {
            embed.addField("Roles", `${message.guild.roles.cache.size - 1}`, true)
    }


    message.channel.send({ embeds: [embed] })
    .catch(err => {
        console.log(err);
    })
}
}
}
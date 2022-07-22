const Discord = require("discord.js");
const { trusted } = require("mongoose");
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

    const roleEmbed = new Discord.EmbedBuilder()
    if (args[0] == "roles" || args[0] === 'r' || args[0] === 'role') {

        if (message.guild.roles.cache.size == 1) return message.channel.send({ content: "Este servidor no tiene roles" })
       if(!message.member.permissions.has(perms.administrator || perms.manage_roles)) return message.channel.send({ content: "No tienes permisos para ver los roles del servidor"})
       let roles = await message.guild.roles.cache.map(r => `<@&${r.id}>`).join(", ")

       await message.channel.send(
        { 
            embeds: [roleEmbed.setColor("RANDOM")
            .setDescription(roles)
            .setAuthor({name: `Roles del servidor`, iconURL: message.guild.iconURL()})
            .setThumbnail(message.guild.iconURL())
            .setFooter({ text: `${message.guild.name} | ${message.guild.id}`})]})
    }
    else if (args[0] === "channels" || args[0] === "channel" || args[0] === "c") {

        if (message.guild.channels.cache.size == 0) return message.channel.send({ content: "Este servidor no tiene canales" })

        if(!message.member.permissions.has(perms.administrator || perms.manage_channels)) return message.channel.send({ content: "No tienes permisos para ver los canales del servidor"})
        const channelEmbed = new Discord.EmbedBuilder()

        let channels = await message.guild.channels.cache.filter(
            channel => channel.type === "GUILD_TEXT" || 
            channel.type === "GUILD_NEWS" || 
            channel.type === "GUILD_STORE")
            .map(channel => `<#${channel.id}>`).join(", ")

        await message.channel.send(
            {
                embeds: [channelEmbed.setColor("RANDOM")
                .setDescription(channels).setAuthor({name: `Canales del servidor`, iconURL: message.guild.iconURL()})
                .setThumbnail(message.guild.iconURL())
                .setFooter({text: `${message.guild.name} | ${message.guild.id}`})]})
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

    const embed = new Discord.EmbedBuilder()
        .setAuthor({name: message.guild.name, iconURL: message.guild.iconURL()})
        .setColor("Random")
        .setFields([
            {
                name: "Nombre",
                value: message.guild.name,
                inline: true
            },
            {
                name: "Dueñ@",
                value: message.guild.members.cache.get(message.guild.ownerId).toString(),
                inline: true
            },
            {
                name: "Miembros | Usuarios | Bots",
                value: `${message.guild.members.cache.size} | ${message.guild.members.cache.filter(member => !member.user.bot).size} | 
                ${message.guild.members.cache.filter(member => member.user.bot).size}`,
                inline: true
            },
            {
                name: "Nivel de Verificación",
                value: verifLevels[message.guild.verificationLevel],
                inline: true
            },
            {
                name: channelName,
                value: `${channels} | ${channelOrder}`,
                inline: true
            },
            {
                name: "Creado a las",
                value: `${message.guild.createdAt.toUTCString().substr(0, 16)} (${checkDays(message.guild.createdAt)})`,
                inline: true
            }
        ])
        .setThumbnail(message.guild.iconURL({ format: "png", dynamic: true }))

        if (message.guild.roles.cache.size != 1) {
            embed.addFields([{
                name: "Roles", 
                value: `${message.guild.roles.cache.size - 1}`, 
                inline: true
        }])
    }


    message.channel.send({ embeds: [embed] })
    .catch(err => {
        console.log(err);
    })
}
}
}
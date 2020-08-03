const Discord = require("discord.js");


module.exports = {
    name : 'server-info',
    category: "Info",
    description : 'Este comando muestra la información del server, como el nombre, el id, el dueño, Etc...',
    aliases: ['Server-info', 'SERVER-INFO', 'serverinfo'],
    usage: '!ban',
    examples: ['!server-info', '!serverinfo'],
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
        "HIGH": "(╯°□°）╯︵  ┻━┻",
        "VERY_HIGH": "┻━┻ミヽ(ಠ益ಠ)ノ彡┻━┻"
    };
    let region = {
        "brazil": ":flag_br: Brazil",
        "eu-central": ":flag_eu: Central Europe",
        "singapore": ":flag_sg: Singapore",
        "us-central": ":flag_us: U.S. Central",
        "sydney": ":flag_au: Sydney",
        "us-east": ":flag_us: U.S. East",
        "us-south": ":flag_us: U.S. South",
        "us-west": ":flag_us: U.S. West",
        "eu-west": ":flag_eu: Western Europe",
        "vip-us-east": ":flag_us: VIP U.S. East",
        "london": ":flag_gb: London",
        "amsterdam": ":flag_nl: Amsterdam",
        "hongkong": ":flag_hk: Hong Kong",
        "russia": ":flag_ru: Russia",
        "southafrica": ":flag_za:  South Africa"
    };
    const roleEmbed = new Discord.MessageEmbed()
    if (args[0] == "roles" || args[0] === 'r' || args[0] === 'role') {
       if(!message.member.hasPermission("ADMINISTRATOR" || "MANAGE_ROLES") || !message.guild.owner) return message.channel.send("No tienes permisos para ver los roles del servidor")
       let roles = await message.guild.roles.cache.map(r => `<@&${r.id}>`).join(", ")

       await message.channel.send(roleEmbed.setColor("RANDOM").setDescription(roles).setAuthor(`Roles del servidor`, message.guild.iconURL()).setThumbnail(message.guild.iconURL()).setFooter(`${message.guild.name} | ${message.guild.id}`))
    }
    else if (args[0] === "channels" || args[0] === "channel") {
        if(!message.member.hasPermission("ADMINISTRATOR" || "MANAGE_CHANNELS") || !message.guild.owner) return message.channel.send("No tienes permisos para ver los canales del servidor")
        const channelEmbed = new Discord.MessageEmbed()
        let channels = await message.guild.channels.cache.filter(channel => channel.type !== "category" && channel.type !== "voice").map(channel => `<#${channel.id}>`).join(", ")

        await message.channel.send(channelEmbed.setColor("RANDOM").setDescription(channels).setAuthor(`Canales del servidor`, message.guild.iconURL()).setThumbnail(message.guild.iconURL()).setFooter(`${message.guild.name} | ${message.guild.id}`))
    }
    else {
       let channels = message.guild.channels.cache.size 
       let textChannel = message.guild.channels.cache.filter(channel => channel.type !== "voice" && channel.type !== "category" && channel.type !== "news" && channel.type !== "store").size
       let voiceChannel = message.guild.channels.cache.filter(channel => channel.type !== "category" && channel.type !== "news" && channel.type !== "store" && channel.type !== "text").size
       let newsChannel = message.guild.channels.cache.filter(channel => channel.type !== "category" && channel.type !== "voice" && channel.type !== "store" && channel.type !== "text").size
       let storeChannel = message.guild.channels.cache.filter(channel => channel.type !== "category" && channel.type !== "news" && channel.type !== "voice" && channel.type !== "text").size
       let channelName = `Canales | ${textChannel == 0 ? "" : `Texto | `}${voiceChannel == 0 ? "" : `Voz | `}${newsChannel == 0 ? "" : `Noticias | `}${storeChannel == 0 ? "" : "Tienda"}`
       let channelOrder = `${textChannel == 0 ? "" : `${textChannel} | `}${voiceChannel == 0 ? "" : `${voiceChannel} | `}${newsChannel == 0 ? "" : `${newsChannel} | `}${storeChannel == 0 ? "" : storeChannel}`
    const embed = new Discord.MessageEmbed()
        .setAuthor(message.guild.name, message.guild.iconURL())
        .setColor("RANDOM")
        .addField("Nombre", message.guild.name, true)
        .addField("ID", message.guild.id, true)
        .addField("Dueñ@", `<@!${message.guild.owner.user.id}>`, true)
        .addField("Región", region[message.guild.region], true)
        .addField("Miembros | Usuarios | Bots", `${message.guild.members.cache.size} | ${message.guild.members.cache.filter(member => !member.user.bot).size} | ${message.guild.members.cache.filter(member => member.user.bot).size}`, true)
        .addField("Nivel de Verificación", verifLevels[message.guild.verificationLevel], true)
        .addField(channelName, `${channels} | ${channelOrder}`, true)
        .addField("Roles", message.guild.roles.cache.size, true)
        .addField("Creado a las", `${message.channel.guild.createdAt.toUTCString().substr(0, 16)} (${checkDays(message.channel.guild.createdAt)})`, true)
        .setThumbnail(message.guild.iconURL())
    message.channel.send({embed})
    .catch(err => {
        console.log(err);
    })
}
}
}
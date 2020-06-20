const Discord = require('discord.js');

    module.exports = {
    name : 'mute',
    category: "Moderacion",
    aliases: ['Mute', 'MUTE'],
    description : 'Este comando Mutea al usuario mencionado con su ID o mención, también puedes dar una razón de ello',
    usage: '!mute',
    examples: ['!mute @Firulais', '!mute 556540723235651584', '!mute @Firulais Razon'],
    run: async (client , message, args) => {
    let mutee = message.guild.member(message.mentions.members.first() || message.guild.members.cache.get(args[0]));
    if(!mutee) return message.channel.send("Debes mencionar a un usuario o darme su id");
    if(tomute.id === message.author.id) return message.channel.send("No te puedes mutear a ti mismo!");
    if(!message.member.hasPermission("KICK_MEMBERS", "BAN_MEMBERS", "ADMINISTRATOR") || !message.guild.owner) return message.channel.send("No tienes permisos para usar este comando!");
    if(!message.guild.me.hasPermission(["MANAGE_ROLES", "ADMINISTRATOR"])) return message.channel.send("No tengo permisos para añadir roles");
    if (mutee.roles.cache.some((role) => role.name === 'Muteado')) return message.channel.send("Esta persona ya esta muteada");
    if(mutee.hasPermission("KICK_MEMBERS", "BAN_MEMBERS", "ADMINISTRATOR")) return message.channel.send("Esta persona no puede ser muteada!");
    

    

    let mReason = args.slice(1).join(" ");
    if(!mReason) mReason = "No se específico una Razón"

    let muterole = message.guild.roles.cache.find(r => r.name === "Muteado")
    if(!muterole) {
        try{
            muterole = await message.guild.roles.create({ data: {  
                name : "Muteado",
                color : "#9b9b9b",
                permissions : []
            }
            })
            message.guild.channels.cache.forEach(async (channel, id) => {
                await channel.createOverwrite(muterole,  {
                    SEND_MESSAGES: false,
                    CREATE_INSTANT_INVITE: false,
                    ADD_REACTIONS: false,
                    SEND_TTS_MESSAGES: false,
                    ATTACH_FILES: false,
                    SPEAK: false
                })
            })
        } catch(e) {
            console.log(e.stack);
    }
}

if (message.guild.me.roles.highest.comparePositionTo(muterole) < 1) {
    return message.channel.send("Mi rol es muy bajo para asignar el rol mute!");
}

mutee.roles.add(muterole.id)

let muteEmbed = new Discord.MessageEmbed()
    .setDescription("~Mute~")
    .setColor("#0088ff")
    .addField("Usuario Muteado", `${mutee} Y su ID es ${mutee.id}`)
    .addField("Muteado Por", `<@!${message.author.id}> Y su ID es ${message.author.id}`)
    .addField("Razón de Mute", mReason);

    message.channel.send( muteEmbed )
}
}
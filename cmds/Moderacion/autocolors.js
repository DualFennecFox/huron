const { autoRoles } = require("./models/functions")

module.exports = { 
name : 'autocolors', 
description : 'Envia varias reacciones predeterminado a un mensaje para un autorol básico, junto con roles y reacciones, no funciona como autorol solo es una plantilla', 
category: "Moderacion", 
usage: `!autocolors <Canal> <Id de Mensaje>`, 
examples: ['!autocolors #autoroles 1234567898765432', '!autocolors 12345678987654321 1234567898765432'],
run: async (client, message, args) => {
    
    if (!message.member.hasPermission("MANAGE_ROLES", "MANAGE_GUILD")) return message.channel.send("No tienes permisos para usar este comando!")
    
    if (!message.guild.me.hasPermission("MANAGE_ROLES")) return message.channel.send("No tengo permisos para añadir roles")
    
    if (!args[0]) return message.channel.send("Debes mencionar un canal o darme su id")
    
    let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])
    
    if (!channel) return message.channel.send("Ese no parece ser un canal válido")

    if (!args[1] && args[1].match(/([^0-9])/g)) return message.channel.send("Debes enviar un id de mensaje válido para reaccionarlo")
    
    if (!message.guild.me.permissionsIn(channel).has("SEND_MESSAGES", "ADD_REACTIONS")) return message.channel.send("No tengo permisos para enviar mensajes o añadir reacciones en ese canal")


    let msg
    
try {

    msg = message.channel.messages.fetch(args[1])

} catch {
    
    return message.channel.send("Parece que ese mensaje no existe o no tengo acceso a él.")
}

    let pmsg = await message.channel.send("Creando roles, Por favor espere...")
   
    await msg.react('❤️')
    await msg.react('📙')
    await msg.react('🧀')
    await msg.react("🧼")
    await msg.react("😈")
    await msg.react("🌚")
    await msg.react("🎮")
    await msg.react("🏳️")
    await msg.react("🚙")
    await msg.react("📘")
    await msg.react("🕵️‍♂️")

    for (let i; i = 0; i++) {

    await message.guild.roles.create({ data: {  
        name : autoRoles[i].name,
        color : autoRoles[i].color,
        permissions : []
    }
    })

    if (i === 10) {
        break;
    }
}
    return pmsg.edit("Listo.").then(message => message.delete({timeout: 5000}))

    }
}

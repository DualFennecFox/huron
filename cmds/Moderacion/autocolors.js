module.exports = { 
name : 'autocolors', 
description : 'Envia un mensaje predeterminado para un autorol básico, no funciona como autorol solo es una plantilla', 
category: "Moderacion", 
usage: `!autocolors <Canal>`, 
examples: ['!autocolors #autoroles', '!autocolors 12345678987654321'],
run: async (client, message, args) => {
    
    if (!message.member.hasPermission("MANAGE_ROLES", "MANAGE_GUILD")) return message.channel.send("No tienes permisos para usar este comando!")
    
    if (!message.guild.me.hasPermission("MANAGE_ROLES")) return message.channel.send("No tengo permisos para añadir roles")
    
    if (!args[0]) return message.channel.send("Debes mencionar un canal o darme su id")
    
    let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])
    
    if (!channel) return message.channel.send("Ese no parece ser un canal válido")
    
    if (!message.guild.me.permissionsIn(channel).has("SEND_MESSAGES", "ADD_REACTIONS")) return message.channel.send("No tengo permisos para enviar mensajes o añadir reacciones en ese canal")
    
    let pmsg = '\`Colores Personalizados\`\n\n**Reacciona dependiendo el emoji para obtener el color que desee**\n\n**❤️ ▹ Rojo**\n**📙 ▹ Naranja**\n**🧀 ▹ Amarillo**\n**🧼 ▹ Rosado**\n**😈 ▹ Morado**\n**🌚 ▹ Gris**\n**🎮 ▹ Negro**\n**🏳️ ▹ Blanco**\n**🚙 ▹ Azul**\n**📘 ▹ Celeste**\n**🕵️‍♂️ ▹ Invisible**'
    
    await channel.send(pmsg)
   
    }
}

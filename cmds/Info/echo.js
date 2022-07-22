const { perms } = require('../Moderacion/models/functions')

module.exports = {
    name : 'echo',
    category: "Info",
    description : 'El bot envia un mensaje escrito por un usuario a un canal mencionado o con su ID',
    aliases: ['announcement', 'acc'],
    usage: '!echo <Canal> <Mensaje>',
    examples: ['!echo #general Hola Mundo'],
    run: async (client, message, args) => {

    let argsresult;

    let id = false
    let mChannel = message.mentions.channels.first()
 
    if (!mChannel && args[0]) {
    mChannel = message.guild.channels.cache.get(args[0])
    id = true
}

    if (message.guild.me.permissions.has(perms.manage_messages || perms.administrator)) message.delete()

    if(!mChannel) return message.channel.send({ content: 'Debes mencionar un canal o darme su ID'})
        if (!mChannel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return message.channel.send({ content: 'No tengo permisos para hablar en ese canal'})
        if (!mChannel.permissionsFor(message.member).has("SEND_MESSAGES")) return message.channel.send({ content: 'No tienes permisos para enviar mensajes en ese canal'})
        
        argsresult = args.join(" ")
        
        if (id = false) argsresult = argsresult.replace(mChannel, '')
        else argsresult = argsresult.replace(args[0], '');

        if(!argsresult) return message.channel.send({ content: 'Vuelve a usar el comando, pero di un mensaje para enviar'} )

        if (!message.member.permissions.has(perms.mention_everyone || perms.administrator)) {
            argsresult = argsresult.replace(/@everyone/, "@\u200beveryone").replace(/@here/, "@\u200bhere")
        }
        if(!message.member.permissions.has(perms.manage_messages || perms.administrator)) {
            
               argsresult = argsresult.replace(/(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li|com)|discordapp\.com\/invite)\/.+[A-z0-9]/, "")
        
         if (message.guild.members.me.permissions.has(perms.manage_messages || perms.administrator)) message.delete()
        }
         mChannel.send({ content: argsresult})
}
}

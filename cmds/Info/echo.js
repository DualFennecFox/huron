module.exports = {
    name : 'echo',
    category: "Info",
    description : 'El bot envia un mensaje escrito por un usuario a un canal mencionado o con su ID',
    aliases: ['announcement', 'acc'],
    usage: '!echo <Canal> <Mensaje>',
    examples: ['!echo #general Hola Mundo'],
    run: async (client, message, args) => {
    let argsresult;
    let mChannel = message.mentions.channels.first();
    if (message.guild.me.hasPermission("MANAGE_MESSAGES" || "ADMINISTRATOR")) message.delete()

    if(!mChannel) return message.channel.send('Debes mencionar un canal o darme su ID')
        if (!mChannel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return message.channel.send('No tengo permisos para hablar en ese canal')
        if (!mChannel.permissionsFor(message.member).has("SEND_MESSAGES")) return message.channel.send('No tienes permisos para enviar mensajes en ese canal')
        
        argsresult = args.join(" ")
        if(!argsresult) return message.channel.send('Vuelve a usar el comando, pero di un mensaje para enviar')
        
        argsresult = argsresult.replace(mChannel, '')

        if (!message.member.hasPermission("MENTION_EVERYONE" || "ADMINISTRATOR") || !message.guild.owner) {
            argsresult = argsresult.replace(/@everyone/, "@\u200beveryone").replace(/@here/, "@\u200bhere")
        }
        if(!message.member.hasPermission("MANAGE_MESSAGES" || "ADMINISTRATOR") || !message.guild.owner) {
            
               argsresult = argsresult.replace(/(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li|com)|discordapp\.com\/invite)\/.+[A-z0-9]/, "")
        
         if (message.guild.me.hasPermission("MANAGE_MESSAGES" || "ADMINISTRATOR")) message.delete()
        
         mChannel.send(argsresult)

const Discord = require('discord.js')
const mongoose = require('mongoose')
const Guild = require('./models/Guild')
const { updateGuild, getGuild } = require('./models/functions')

module.exports = {
    name : 'config',
    category: "Moderacion",
    description : 'El Bot muestra varios comandos para configurar ciertas cosas, como el prefix, mensaje de bienvenida y despedida',
    aliases: ['Config', 'CONFIG', 'settings', 'Settings', 'SETTINGS'],
    usage: '!config',
    examples: ['!config prefix -', 'config welcomemsg'],
    run: async (client, message, args, prefix) => {
        if (!message.member.hasPermission("MANAGE_GUILD" || "ADMINISTRATOR" || "MANAGE_MEMBERS") || !message.guild.owner) return message.channel.send("No tienes permisos para usar este comando")
        if (!args[0]) {
            const embed = new Discord.MessageEmbed()
                .setAuthor("Configuración", client.user.displayAvatarURL())
                .setColor("#FFFF00")
                .setDescription("Estos son los comandos de configuración:")
                .addField("Prefix", `Para cambiar el prefix eliga uno diciendo \"prefix\"\nEjemplo: ${prefix}config prefix - \n`)
                .addField("WelcomeMsg", `Para cambiar el mensaje de bienvenida diga \"welcomemsg\"\nEjemplo: ${prefix}config welcomemsg \`#Canal-mencionado\` Bienvenido {user} a {server}\n`)
                .addField("Leavemsg", `Para cambiar el mensaje de despedida diga \"welcomemsg\"\nEjemplo: ${prefix}config leavemsg \`#Canal-mencionado\` {user} a dejado {server}\n`)
                .addField("DisableWelcome", "Elimina el mensaje de bienvenida, si es que esta activado\n")
                .addField("DisableLeave", "Elimina el mensaje de despedida, si es que esta activado\n")
                .addField("Tags", "Los tags para los mensajes de bienvenida y despedida son:\n\n**{user}** : Menciona al usuario\n**{username}** : Muestra el nombre y el tag del usuario\n**{server}** : Muestra el nombre del servidor\n**{owner}** : Nombra al Owner del servidor con su tag\n**{members}** : Muestra el número de miembros desde que el usuario se unio o dejo el server.")

                message.channel.send({ embed })
                return
        }
        switch (args[0]) {
            case "prefix" || "Prefix" || "PREFIX":
                if (!args[1]) return message.channel.send(`Mi prefix en este server es ${prefix}`)
                let nPrefix = args.slice(1).join(" ");
                await updateGuild(message.guild, { prefix: nPrefix });

                message.channel.send(`Su nuevo Prefix es ${nPrefix}`)
            break;
            case "welcomemsg" || "WelcomeMsg" || "Welcomemsg" || "WELCOMEMSG":
                let welcomeChannel = message.mentions.channels.first();
                if (!welcomeChannel) return message.channel.send("Debes especificar un canal para enviar el mensaje")
                if (!welcomeChannel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return message.channel.send("No tengo permisos para hablar en ese canal")
                let welcomeMsg = args.slice(1).join(" ").replace(welcomeChannel, '')
                if (!welcomeMsg) return message.channel.send("Debes especificar un mensaje de bienvenida")

                updateGuild(message.guild, { JoinMsg: welcomeMsg, JoinBool: true, WelcomeChannel: welcomeChannel.id})

            message.channel.send("Se ha establecido el mensaje de bienvenida")
            break;
            case "leavemsg" || "LeaveMsg" || "Leavemsg" || "LEAVEMSG":
                let leaveChannel = message.mentions.channels.first();
                if (!leaveChannel) return message.channel.send("Debes especificar un canal para enviar el mensaje")
                if (!leaveChannel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return message.channel.send("No tengo permisos para hablar en ese canal")
                let leaveMsg = args.slice(1).join(" ").replace(leaveChannel, '')
                if (!leaveMsg) return message.channel.send("Debes especificar un mensaje de despedida")
        
                updateGuild(message.guild, { LeaveMsg: leaveMsg, LeaveBool: true, LeaveChannel: leaveChannel.id})
        
                message.channel.send("Se ha establecido el mensaje de despedida")                
            break;
            case "disablewelcome" || "DisableWelcome" || "Disablewelcome" || "DISABLEWELCOME" || "disablewelcomemsg" || "DisableWelcomeMsg" || "DisableWelcomeMSG" || "DISABLEWELCOMEMSG":
                Guild.findOne({ guildID: message.guild.id }).then(doc => {
                    if (!doc) {
                       return message.channel.send("No existe un mensaje de bienvenida")
                    }
                    if (doc.JoinBool == false) return message.channel.send("Ya estaba desactivado el mensaje")
                })
                updateGuild(message.guild, { JoinMsg: "", JoinBool: false, WelcomeChannel: ""})
        
                message.channel.send("Se ha eliminado el mensaje de bienvenida")
            break;
            case "disableleave" || "DisableLeave" || "Disableleave" || "DISABLELEAVE" || "disableleavemsg" || "DisableLeavemsg" || "DisableLeaveMsg" || "DisableLeaveMsg" || "DISABLELEAVEMSG":
                Guild.findOne({ guildID: message.guild.id }).then(doc => {
                    if (!doc) {
                        return message.channel.send("No existe un mensaje de bienvenida")
                     }
                    if (doc.LeaveBool == false) return message.channel.send("Ya estaba desactivado el mensaje")
                })
                updateGuild(message.guild, { LeaveMsg: "", LeaveBool: false, LeaveChannel: ""})
        
                message.channel.send("Se ha eliminado el mensaje de despedida")
            break;
            default:
                const embed = new Discord.MessageEmbed()
                .setAuthor("Configuración", client.user.displayAvatarURL())
                .setColor("#FFFF00")
                .setDescription("Estos son los comandos de configuración:")
                .addField("Prefix", "Para cambiar el prefix eliga uno diciendo \"prefix\"\n Ejemplo: config prefix - \n")
                .addField("WelcomeMsg", "Para cambiar el mensaje de bienvenida diga \"welcomemsg\"\n Ejemplo: config welcomemsg \`#Canal-mencionado\` Bienvenido {user} a {server}\n")
                .addField("Leavemsg", "Para cambiar el mensaje de despedida diga \"welcomemsg\"\n Ejemplo: config leavemsg \`#Canal-mencionado\` {user} a dejado {server}\n")
                .addField("DisableWelcome", "Elimina el mensaje de bienvenida, si es que esta activado\n")
                .addField("DisableLeave", "Elimina el mensaje de despedida, si es que esta activado\n")
                .addField("Tags", "Los tags para los mensajes de bienvenida y despedida son:\n {user} : Menciona al usuario\n {username} : Muestra el nombre y el tag del usuario\n {server} : Muestra el nombre del servidor\n {owner} : Nombra al Owner del servidor con su tag\n {members} : Muestra el número de miembros desde que el usuario se unio o dejo el server.")

                message.channel.send({ embed })
            break;
        }
    }
}
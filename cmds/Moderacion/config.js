const { EmbedBuilder } = require('discord.js')
const Guild = require('./models/Guild')
const { perms } = require("./models/functions")

module.exports = {
    name : 'config',
    category: "Moderacion",
    description : 'El Bot muestra varios comandos para configurar ciertas cosas, como el prefix, para más información use !config',
    aliases: ['settings'],
    usage: '!config <Configuración> <Valor>',
    examples: ['!config prefix -', '!config welcomemsg'],
    run: async (client, message, args, prefix) => {
        if (!message.member.permissions.has(perms.manage_guild || perms.administrator)) return message.channel.send("No tienes permisos para usar este comando")
        if (!args[0]) {
                
            let settings = await Guild.findOne({ guildID: message.guild.id })

            const embed = new EmbedBuilder()
                .setAuthor({name: "Configuración", iconURL: client.user.displayAvatarURL()})
                .setColor("#FFFF00")
                .setDescription(`Estos son los comandos de configuración:`)
                .setFields([
                {
                    name: "Prefix",
                    value: `Cambia el prefix.\n**Uso:** ${prefix}config prefix <prefix>\n**Configuración:** ${settings.prefix || "!"}`
                },
                {
                    name: "JoinMsg",
                    value: `Crea o elimina un mensaje de bienvenida.\n**Uso:** ${prefix}config joinmsg <enable o disable> <Canal> <Mensaje>\n**Configuración:** \`${settings.JoinMsg || "Ninguno"}\``
                },
                {
                    name: "LeaveMsg",
                    value: `Igual que los mensajes de bienvenida, pero cuando un usuario deja el servidor.\n**Uso:** ${prefix}config leavemsg <enable o disable> <Canal> <Mensaje>\n**Configuración:** \`${settings.LeaveMsg || "Ninguno"}\``
                },
                {
                    name: "MuteRole",
                    value: `Para que funcione el mute se debe configurar un rol Muteado con este comando, se puede crear uno eligiendo un nombre y un color.\n**Uso:** ${prefix}config muterole <enable o disable> <Rol, ID o Nombre> [Color si se crea]\n**Configuración:** ${message.guild.roles.cache.get(settings.muterole) || "Ninguno"}`
                },
                {
                    name: "Confession",
                    value: `Establece un canal de confesiones.\n**Uso:** ${prefix}config confession <enable o disable> <Canal>\n**Configuración:** ${message.guild.channels.cache.get(settings.confessionChannel) || "Ninguno"}`
                },
                {
                    name: "Suggestion",
                    value: `Establece un canal de sugerencias\n**Uso:** ${prefix}config suggestion <enable o disable> <Canal>\n**Configuración:** ${message.guild.channels.cache.get(settings.suggestionChannel) || "Ninguno"}`
                },
                {
                    name: "LogChannel",
                    value: `Establece un canal para logear con su mención o ID\n**Uso:** ${prefix}config logchannel <enable o disable> <Canal>\n**Configuración:** ${message.guild.channels.cache.get(settings.LogChannel) || "Ninguno"}`
                },
                {
                    name: "Tags",
                    value: `Establece un canal para logear con su mención o ID\n**Uso:** ${prefix}config logchannel <enable o disable> <Canal>\n**Configuración:** ${message.guild.channels.cache.get(settings.LogChannel) || "Ninguno"}`
                }
            ])
            .setFooter({text: "<> es obligatorio, [] es opcional"})

            return message.channel.send({ embeds: [embed] })
        }
        
        let cmd = args[0].toLowerCase()
        let command;
        let method;

        
        if (client.configs.has(cmd)) {
            command = client.configs.get(cmd)
        };
        
        if (cmd !== "prefix" || cmd !== "reset") {
        if (!args[1]) return message.channel.send("Ese no es un parametro valido");

        if (args[1].toLowerCase() === "enable") method = args[1].toLowerCase()
        else if (args[1].toLowerCase() === "disable") method = args[1].toLowerCase()
        }

        if (command) command.run(message, args, method)
        else return message.channel.send("Esa no es una configuración válida");
    }
}
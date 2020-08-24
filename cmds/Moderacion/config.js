const Discord = require('discord.js')
const Guild = require('./models/Guild')
const { updateGuild, getGuild, createGuild } = require('./models/functions')
const validateColor = require('validate-color')

module.exports = {
    name : 'config',
    category: "Moderacion",
    description : 'El Bot muestra varios comandos para configurar ciertas cosas, como el prefix, para más información use !config',
    aliases: ['settings'],
    usage: '!config <Configuración> <Valor>',
    examples: ['!config prefix -', '!config welcomemsg'],
    run: async (client, message, args, prefix) => {
        if (!message.member.hasPermission("MANAGE_GUILD" || "ADMINISTRATOR") || !message.guild.owner) return message.channel.send("No tienes permisos para usar este comando")
        if (!args[0]) {
                
            const embed = new Discord.MessageEmbed()
                .setAuthor("Configuración", client.user.displayAvatarURL())
                .setColor("#FFFF00")
                .setDescription(`Estos son los comandos de configuración:`)
                .addField("Prefix", `Cambia el prefix.\n**Uso:** ${prefix}config prefix <prefix>`)
                .addField("JoinMsg", `Crea o elimina un mensaje de bienvenida.\n**Uso:** ${prefix}config joinmsg <enable o disable> <Canal> <Mensaje>`)
                .addField("LeaveMsg", `Igual que los mensajes de bienvenida, pero cuando un usuario deja el servidor.\n**Uso:** ${prefix}config leavemsg <enable o disable> <Canal> <Mensaje>`)
                .addField("MuteRole", `Para que funcione el mute se debe configurar un rol Muteado con este comando, se puede crear uno eligiendo un nombre y un color.\n**Uso:** ${prefix}config muterole <enable o disable> <Rol, ID o Nombre> [Color si se crea]\n`)
                .addField("Suggestion", `Establece un canal de sugerencias, un color Hex para las sugerencias o ambos.\n**Uso:** ${prefix}config suggestion <enable o disable> <Canal o Color> <Canal o Color>`)
                .addField("LogChannel", `Establece un canal para logear con su mención o ID\n**Uso:** ${prefix}config logchannel <enable o disable> <Canal>`)
                .addField("Tags", "Los tags para los mensajes de bienvenida y despedida son:\n\n**{user}** : Menciona al usuario\n**{username}** : Muestra el nombre y el tag del usuario\n**{server}** : Muestra el nombre del servidor\n**{owner}** : Nombra al Owner del servidor con su tag\n**{members}** : Muestra el número de miembros desde que el usuario se unio o dejo el server.\n")
                .setFooter("<> es obligatorio, [] es opcional")

            return message.channel.send({ embed })
        }
        
        let cmd = args[0].toLowerCase()
        let command;
        let method;

        
        if (client.configs.has(cmd)) {
            command = client.configs.get(cmd)
        }

        if (!args[1] && cmd !== "reset") return message.channel.send("Ese no parece ser un buen del comando");

        if (args[1].toLowerCase() === "enable") method = args[1].toLowerCase()
        else if (args[1].toLowerCase() === "disable") method = args[1].toLowerCase()
        
        if (!method) {
            if (cmd != "prefix" || cmd != "reset") return message.channel.send("Ese no parece ser un buen uso del comando");
        }

        if (command) command.run(message, args, method)
        else return message.channel.send("Esa no es una configuración válida");
    }
}
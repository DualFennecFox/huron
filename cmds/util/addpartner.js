const Guild = require('../Moderacion/models/Guild')

module.exports = {
    name: "addpartner",
    category: "Util",
    description: "Añade un rol de aliado al miembro especificado",
    aliases: ["add-partner"],
    usage: "!addpartner <Usuario>",
    examples: ["!addpartner @Wumpus"],
    run: async (client, message, args) => {

        Guild.findOne({ guildID: message.guild.id }).then(doc => {

            if (!doc) return message.channel.send("Primero configura los roles de los aliados para que funcione este comando")
            let modrole = message.guild.roles.cache.get(doc.allyModRole)
            let allyrole = message.guild.roles.cache.get(doc.allyRole)

            if (!modrole && !message.member.hasPermission("MANAGE_GUILD")) return message.channel.send("No tienes permisos para usar este comando!")
            if (!message.guild.me.hasPermission("MANAGE_ROLES")) return message.channel.send("No tengo permisos para añadir roles")
            if (modrole) {
            if (!message.member.roles.cache.has(modrole.id) || !message.member.hasPermission("MANAGE_GUILD")) return message.channel.send("No tienes permisos para usar este comando!")
            }
            if (!allyrole) return message.channel.send("No existe un rol en mi base de datos para los aliados")
        
            let user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
            if (!user) return message.channel.send("Debes especificar a un usuario")

            if (user.roles.cache.has(allyrole.id)) return message.channel.send("Este usuario ya es un aliado")

            if (message.guild.me.roles.highest.comparePositionTo(allyrole.id) < 1) {
                return message.channel.send("Mi rol es muy bajo para asignar el rol aliado");
            }

            if (message.guild.me.roles.highest.comparePositionTo(user.roles.highest) < 1) {
                return message.channel.send("Mi rol es muy bajo para gestionar a este usuario!");
            }

            try {
                user.roles.add(allyrole.id, "Nuevo aliado")
            } catch (err) {
                console.error(err)
                return message.channel.send("Ha ocurrido un error")
            }

            return message.channel.send(`Se ha añadido el rol **${allyrole.name}** a <@${user.id}>`)
            
        }).catch(err => {
            console.error(err)
            message.channel.send("Ha ocurrido un error")
        })
    }
}
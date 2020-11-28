const Guild = require('../Moderacion/models/Guild')

module.exports = {
    name: "removepartner",
    category: "Util",
    description: "Elimina un rol de aliado al miembro especificado",
    aliases: ["remove-partner"],
    usage: "!removepartner <Usuario>",
    examples: ["!removepartner @Wumpus"],
    run: async (client, message, args) => {

        Guild.findOne({ guildID: message.guild.id }).then(doc => {

            if (!doc) return message.channel.send("Primero configura los roles de los aliados para que funcione este comando")
            let modrole = message.guild.roles.cache.get(doc.allyModRole)
            let allyrole = message.guild.roles.cache.get(doc.allyRole)

            if (!modrole && !message.member.hasPermission("MANAGE_GUILD")) return message.channel.send("No tienes permisos para usar este comando!")
            if (!message.guild.me.hasPermission("MANAGE_ROLES")) return message.channel.send("No tengo permisos para añadir roles")
            if (!modrole) return message.channel.send("No existe un rol para el staff de alianza")
            if (!message.member.roles.cache.has(modrole.id) || !message.member.hasPermission("MANAGE_GUILD")) return message.channel.send("No tienes permisos para usar este comando!")
            if (!allyrole) return message.channel.send("No existe un rol en mi base de datos para los aliados")
        
            let user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
            if (!user) return message.channel.send("Debes especificar a un usuario")

            if (!user.roles.cache.has(allyrole.id)) return message.channel.send("Este usuario no esta alianzado con nosotros")

            if (message.guild.me.roles.highest.comparePositionTo(allyrole.id) < 1) {
                return message.channel.send("Mi rol es muy bajo para asignar el rol aliado");
            }

            if (message.guild.me.roles.highest.comparePositionTo(user.roles.highest) < 1) {
                return message.channel.send("Mi rol es muy bajo para gestionar a este usuario!");
            }

            try {
                user.roles.remove(allyrole.id, "Aliado removido")
            } catch (err) {
                console.error(err)
                return message.channel.send("Ha ocurrido un error")
            }

            return message.channel.send(`Se ha removido el rol **${allyrole.name}** a <@${user.id}>`)
            
        }).catch(err => {
            console.error(err)
            message.channel.send("Ha ocurrido un error")
        })
    }
}
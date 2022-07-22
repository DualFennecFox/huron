module.exports = {
    name: "removerole",
    category: "Moderacion",
    description : 'Este comando quita un rol a un usuario mencionado',
    aliases: ["remove-role"],
    usage: '!removerole <Rol> <Usuario> [Razón]',
    examples: ['!removerole @Rojo @Wumpus Colores', '!removerole 12345678987654321 24681356789043210 Colores'],
    run: async (client, message, args, prefix, contentPrefix) => {

        if (!message.member.permissions.has("MANAGE_ROLES")) return message.channel.send("No tienes permisos para usar este comando!")
        if (!message.guild.members.me.permissions.has("MANAGE_ROLES")) return message.channel.send("No tengo permisos para añadir roles")
        let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0])
        if (!role) return message.channel.send("Debes mencionar un rol o darme su ID")

        if (message.guild.me.roles.highest.comparePositionTo(role.id) < 1) {
            return message.channel.send("Mi rol es muy bajo para asignar este rol");
        }

        let user = message.mentions.members.first() || message.guild.members.cache.get(args[1])
        if (contentPrefix !== prefix) user = message.guild.members.cache.get(getUser(args[0], client))
        if (!user) return message.channel.send("Debes mencionar a un usuario o darme su ID")

        let reason = `[${message.author.tag}]: ${args.slice(2).join(" ") || "No se específico una Razón"}`;

        if (!user.roles.cache.has(role.id)) return message.channel.send("Este usuario no tiene este rol")

        try {
            user.roles.remove(role.id, reason)
            
        } catch (err) {
            console.error(err)
            return message.channel.send("Ha ocurrido un error")
        }

        return message.channel.send(`Se ha removido el rol **${role.name}** a <@${user.id}>`)
    }
}
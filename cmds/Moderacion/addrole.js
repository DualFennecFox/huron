module.exports = {
    name: "addrole",
    category: "Moderacion",
    description : 'Este comando añade un rol a un usuario mencionado',
    aliases: ["add-role"],
    usage: '!addrole <Rol> <Usuario> [Razón]',
    examples: ['!addrole @Rojo @Wumpus Colores', '!addrole 12345678987654321 24681356789043210 Colores'],
    run: async (client, message, args) => {

        if (!message.member.hasPermission("MANAGE_ROLES")) return message.channel.send("No tienes permisos para usar este comando!")

        let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0])
        if (!role) return message.channel.send("Debes mencionar un rol o darme su ID")

        let user = message.mentions.members.first() || message.guild.members.cache.get(args[1])
        if (!user) return message.channel.send("Debes mencionar a un usuario o darme su ID")

        let reason = args.slice(2).join(" ")
        if (!reason) reason = "No se ha proporcionado una razón"

        if (user.roles.has(role.id)) return message.channel.send("Este usuario ya tiene ese rol")
        try {
            user.roles.add(role.id, reason)

        } catch (err) {
            console.error(err)
            return message.channel.send("Ha ocurrido un error")
        }

        return message.channel.send(`Se ha añadido el rol **${role.name}** de <@${user.id}>`)
    }
}
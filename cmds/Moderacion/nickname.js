const { getUser } = require("./models/functions");

    module.exports = {
    name : 'nickname',
    category: "Moderacion",
    aliases: ['Nickname', 'NICKNAME', 'setnickname', 'Setnickname', 'SETNICKNAME', 'SetNickname'],
    description : 'Este comando cambia el apodo de un miembro mencionado con su ID o mención',
    usage: '!nickname',
    examples: ['!nickname @Firulais Nombre', '!nickname 556540723235651584 Nombre'],
    run: async (client , message, args, prefix, contentPrefix) => {

        if (!message.member.hasPermission("MANAGE_NICKNAMES" || "ADMINISTRATOR") || !message.guild.owner) return message.channel.send("No tienes permisos para usar este comando")
        if (!message.guild.me.hasPermission("MANAGE_NICKNAMES" || "ADMINISTRATOR")) return message.channel.send("No tengo permisos para cambiar apodos")
        if (!args.length >= 1) return message.channel.send("Debes elegir un nombre para el usuario")

        let user = message.guild.member(message.mentions.users.first() || client.users.cache.get(args[0]));
        if (contentPrefix !== prefix) user = message.guild.member(getUser(args[0], client))
        if (!user) user = message.member

        let name = args.slice(1).join(" ");
        if (name.length > 32) return message.channel.send("El apodo no debe contener más de 32 caracteres")
        if (user.user.id === client.user.id) return user.setNickname(name).then(message.channel.send("Se ha cambiado mi apodo"))
        let role = user.roles.highest;

        if (message.guild.me.roles.highest.comparePositionTo(role) < 1) {
            return message.channel.send("Mi rol es muy bajo para poder cambiarle el nombre");
        }

        await user.setNickname(name).then(message.channel.send(`Se ha cambiado el apodo de **${user.user.username}**`)).catch(err => {
            console.error(err)
            message.channel.send("Se ha ocurrido un error al cambiar el nombre")
        })

    }
}
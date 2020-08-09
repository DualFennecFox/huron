    module.exports = {
    name : 'nickname',
    category: "Moderacion",
    aliases: ['Nickname', 'NICKNAME', 'setnickname', 'Setnickname', 'SETNICKNAME', 'SetNickname'],
    description : 'Este comando cambia el apodo de un miembro mencionado con su ID o mención',
    usage: '!nickname',
    examples: ['!nickname @Firulais Nombre', '!nickname 556540723235651584 Nombre'],
    run: async (client , message, args) => {

        if (!message.member.hasPermission("MANAGE_NICKNAMES" || "ADMINISTRATOR") || !message.guild.owner) return message.channel.send("No tienes permisos para usar este comando")
        if (!message.guild.me.hasPermission("MANAGE_NICKNAMES" || "ADMINISTRATOR")) return message.channel.send("No tengo permisos para cambiar apodos")
        if (!args.length >= 1) return message.channel.send("Debes elegir un nombre para el usuario")

        let user = message.mentions.users.first() || client.users.cache.get(args[0]);
        if (!user) user = message.author
        let member2 = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!member2) member2 = message.member
        let name = args.slice(1).join(" ");
        if (name.length > 32) return message.channel.send("El apodo no debe contener más de 32 caracteres")
        if (user.id === client.user.id) return member2.setNickname(name).then(message.channel.send("Se ha cambiado mi apodo"))
        let role = member2.roles.highest;

        if (message.guild.me.roles.highest.comparePositionTo(role) < 1) {
            return message.channel.send("Mi rol es muy bajo para poder cambiarle el nombre");
        }

        await member2.setNickname(name).then(message.channel.send(`Se ha cambiado el apodo de **${user.username}**`)).catch(err => {
            console.error(err)
            message.channel.send("Se ha ocurrido un error al cambiar el nombre")
        })

    }
}
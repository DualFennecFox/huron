module.exports = {
    name: "hackban",
    category: "Moderacion",
    description : 'Este comando banea a uno o varios usuarios con IDs o menciones',
    usage: '!hackban <Usuarios>',
    examples: ['!hackban @Wumpus1 @Wumpus2', '!hackban 12345678987654321 24681356789043210'],
    run: async (client, message, args) => {

        if (!message.member.hasPermission("BAN_MEMBERS", "ADMINISTRATOR") || !message.guild.owner) return message.channel.send("No tienes permisos para usar este comando!")
        if(!message.guild.me.hasPermission(["BAN_MEMBERS" || "ADMINISTRATOR"])) return message.channel.send("No tengo permisos para Banear miembros");

        if (!args[0]) return message.channel.send("Debes mencionar a un usuario o darme su ID")

        let msg = await message.channel.send("Baneando usuarios, Por favor espere...")

        let bans = await message.guild.fetchBans();
        let num = parseInt(1)

        args.forEach(arg => {
    
            let id = arg.replace(/([^0-9])/g, '')
    
            let user = client.users.cache.get(id)
    
            if (!user) {
                try {
                    user = await client.users.fetch(id)
                } catch (err) {
                    return message.channel.send(`**${arg}** no es un usuario válido`)
                }
            }
            if (!user) return message.channel.send(`**${arg}** no es un usuario válido`)
    
            if (bans.find(u => u.user.id === user.id)) return message.channel.send(`<@${user.id}> Ya esta baneado`)
    
            if (user.id === message.author.id) return message.channel.send(`**${user.tag}** Eres tu, no puedes banearte a ti mismo`)
            if (user.id === client.user.id) return message.channel.send(`**${user.tag}** Soy yo, no puedo banearme a mi mismo`)
    
            let bUser;
            if (message.guild.member(user)) {
                bUser = message.guild.member(user)
            let role = bUser.roles.highest;
    
        if(bUser.hasPermission("BAN_MEMBERS" || "ADMINISTRATOR") || !message.guild.owner) return message.channel.send(`**${user.tag}** Es un moderador no puede ser baneado`);
        if (message.guild.me.roles.highest.comparePositionTo(role) < 1) {
            return message.channel.send(`Mi rol es muy bajo para banear a **${user.tag}**!`);
        }
            }
    
            try {
               await message.guild.members.ban(user, { reason: "HackBan by Moderators" })
            } catch (err) {
                return message.channel.send(`Hubo un error al banear a <@${user.id}>`)
            }

            message.channel.send(`Se ha baneado a <@${user.id}> con éxito`)  
            num = num + 1
        })
    
        if (msg.deletable) msg.delete()
    
        message.channel.send(`Se han baneado con exito a **${num - 1}** Usuarios`)
    }
}

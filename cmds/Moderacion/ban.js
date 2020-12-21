const Discord = require('discord.js');
const { getUser } = require('./models/functions')

    module.exports = {
    name : 'ban',
    category: "Moderacion",
    description : 'Este comando banea al usuario mencionado con su ID o mención, también puedes dar una razón de ello',
    usage: '!ban <Usuario> [Razón]',
    examples: ['!ban @Firulais', '!ban 556540723235651584', '!ban @Firulais Razon'],
    run: async (client , message, args, prefix, contentPrefix) => {

        if(!message.member.hasPermission("BAN_MEMBERS" || "ADMINISTRATOR")) return message.channel.send("No tienes permisos para usar este comando!");
        if (!args.length >= 1) return message.channel.send("Debes mencionar a un usuario o darme su id")
        let User = message.mentions.users.first() || client.users.cache.get(args[0])
        if (contentPrefix !== prefix) User = getUser(args[0], client)
        if (!User) {
           let UserID = args[0].replace(/([^0-9])/g, '')
           try {
            User = await client.users.fetch(UserID);
           } catch (err) {
               return message.channel.send("Ese no parece ser un usuario valido")
           }
        }
        if (!User) return message.channel.send("Ese no parece ser un usuario valido");
        let bReason = `[${message.author.tag}]: ${args.slice(1).join(" ")}`;
        if(!bReason) bReason = `[${message.author.tag}]: No se específico una Razón`
        try {
        let bans = await message.guild.fetchBans();
    
        let bannedMember = bans.find(user => user.user.id === User.id)
    
        if(bannedMember) return message.channel.send("Este usuario ya esta baneado")
    
        } catch (err) {
            console.error(err)
        }

        if (User.id === message.author.id) return message.channel.send("No te puedes banear a ti mismo")
        if (User.id === client.user.id) return message.channel.send("No puedo banearme a mi mismo")
        if(!message.guild.me.hasPermission(["BAN_MEMBERS" || "ADMINISTRATOR"])) return message.channel.send("No tengo permisos para Banear miembros");

    let bUser
    if (message.guild.member(User)) {
    bUser = message.guild.member(User)
    let role = bUser.roles.highest;
    if(bUser.hasPermission("BAN_MEMBERS" || "ADMINISTRATOR")) return message.channel.send("Esta persona no puede ser baneada!");

    if (message.guild.me.roles.highest.comparePositionTo(role) < 1) {
        return message.channel.send("Mi rol es muy bajo para banearlo!");
    }
    }

    let banEmbed = new Discord.MessageEmbed()
    .setAuthor("Ban", User.displayAvatarURL({ format: "png", dynamic: true}))
    .setColor("#0088ff")
    .addField("Usuario Baneado", `${User}\n**ID:** ${User.id}`)
    .addField("Razón", bReason);

    try {
    message.guild.members.ban(User.id, { reason: bReason })
    } catch (err) {
        console.error(err)
        return message.channel.send("Se ha ocurrido un error al banear a este usuario")
    }

    message.channel.send( banEmbed )
    .catch(err => {
        console.log(err);
    })
}
}

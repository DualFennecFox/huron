const Discord = require('discord.js');
const { getUser, perms } = require('./models/functions')

module.exports = {
    name : 'unban',
    category: "Moderacion",
    description : 'Este comando Desbanea al usuario mencionado con su ID, también puedes dar una razón de ello',
    usage: '!unban <Usuario> [Razón]',
    examples: ['!unban @Wumpus', '!unban 12345678987654321', '!unban @Wumpus Spam'],
    run: async (client , message, args, prefix, contentPrefix) => {
   
    if(!message.member.permissions.has(perms.ban_members || perms.administrator)) return message.channel.send("No tienes permisos para usar este comando!");
    if(!message.guild.me.permissions.has(perms.ban_members || perms.administrator)) return message.channel.send("No tengo permisos para Banear miembros");
    if (!args.length >= 1) return message.channel.send("Debes mencionar a un usuario o darme su id")
    let User = message.mentions.users.first() || client.users.cache.get(args[0])
    if (contentPrefix !== prefix) User = getUser(args[0], client)
    if (!User) {
       let UserID = args[0].replace(/([^0-9])/g, '')
       try {
        User = await client.users.fetch(UserID);
       } catch (err) {
           message.channel.send("Ese no parece ser un usuario valido")
       }
    }
    if (!User) return message.channel.send("Ese no parece ser un usuario valido");
    let bReason = `[${message.author.tag}]: ${args.slice(1).join(" ") || "No se específico una Razón"}`;
    try {
    let bans = await message.guild.bans.fetch();

    let bannedMember = bans.find(user => user.user.id === User.id)
    
    if(!bannedMember) return message.channel.send("Este usuario no esta baneado")

    } catch (err) {
        console.error(err)
    }

    try {
        message.guild.members.unban(User, { reason: [bReason] })
    } catch(err) {
        console.log(err)
        return message.channel.send("Se ha ocurrido un error al desbanear a este usuario")
    }

    let unbanEmbed = new Discord.MessageEmbed()
    .setAuthor("UnBan", User.displayAvatarURL({ format: "png", dynamic: true}))
    .setColor("#0088ff")
    .addField("Usuario Desbaneado", `${User}\n**ID:** ${User.id}`)
    .addField("Razón", bReason);
    
    message.channel.send({ embeds: [unbanEmbed] })
}
}

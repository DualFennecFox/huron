const Discord = require('discord.js');
const { getUser } = require('./models/functions');

module.exports = {
    name : 'unmute',
    category: "Moderacion",
    description : 'Este comando Desmutea al usuario mencionado con su ID o mención Ej: `!unmute @Firulais`, `!unmute 556540723235651584` También puedes dar una razón de ello',
    usage: '!unmute <Usuario> [Razón]',
    examples: ['!unmute @Wumpus', '!unmute 123456789876543210', '!unmute @Wumpus Me equivoque si es Wumpus'],
    run: async (client , message, args, prefix, contentPrefix) => {

    if(!message.member.hasPermission("KICK_MEMBERS" || "BAN_MEMBERS" || "ADMINISTRATOR") || !message.guild.owner) return message.channel.send("No tienes permisos para usar este comando!")
    if (!args.length >= 1) return message.channel.send("Debe mencionar un usuario muteado o darme su id")

    if(!message.guild.me.hasPermission(["MANAGE_ROLES" || "ADMINISTRATOR"])) return message.channel.send("No tengo permisos para añadir roles");

    let unmutee = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (contentPrefix !== prefix) unmutee = message.guild.member(getUser(args[0], client))
    if(!unmutee) return message.channel.send("Ese no parece ser un usuario valido");
    if(unmutee.id === message.author.id) return message.channel.send("No te puedes mutear a ti mismo!");
    if (unmutee.id === client.user.id) return message.channel.send("No estoy muteado y no puedo mutearme")
    if (!unmutee.roles.cache.some((role) => role.name === 'Muteado')) return message.channel.send("Esta persona no esta muteada");

    let mReason = args.slice(1).join(" ");
    if(!mReason) mReason = "No se específico una Razón"

    let doc = await Guild.findOne({ guildID: message.guild.id })
    if (!doc) return message.channel.send("No existe un rol para mutear, asegurate de declararlo en las configuraciones")
    
    let muterole = message.guild.roles.cache.get(doc.muterole)
    if(!muterole) return message.channel.send("No existe un rol para mutear, asegurate de declararlo en las configuraciones")


    user.roles.remove(muterole.id, { reason: mReason });

    let unmuteEmbed = new Discord.MessageEmbed()
    .setAuthor("UnMute", unmutee.user.displayAvatarURL({ format: "png", dynamic: true}))
    .setColor("#0088ff")
    .addField("Usuario Muteado", `${unmutee}\n**ID:** ${unmutee.id}`)
    .addField("Razón", mReason)

    message.channel.send( unmuteEmbed )
    .catch(err => {
        console.log(err);
    })
}
}
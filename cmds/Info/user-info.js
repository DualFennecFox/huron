const Discord = require("discord.js");
const { getUser } = require('../Moderacion/models/functions')

module.exports = {
    name : 'user-info',
    category: "Info",
    description : 'Este comando muestra la información del usuario, su creación, el id, sus roles, Etc... \nSi quiere ver los roles del usuario escriba \"roles\", despues del comando o usuario mencionado',
    usage: '!user-info <Usuario> [roles]',
    aliases: ['userinfo'],
    examples: ['!user-info', '!user-info @Wumpus', '!userinfo roles @Wumpus'],
    run: async (client , message, args, prefix, contentPrefix) => {

    function checkDays(date) {
        let now = new Date();
        let diff = now.getTime() - date.getTime();
        let days = Math.floor(diff / 86400000);
        if (days == 0) return "Hoy"
        else return `Hace ${days} ${days == 1 ? "día" : "días"}`;
        };

    let user = message.mentions.users.first() || client.users.cache.get(args[0]) || client.users.cache.get(args[1]) || message.author
    if (contentPrefix != prefix) user = getUser(args[0], client) || getUser(args[1], client) || message.author

    if (user) {
    if (!message.guild.members.cache.get(user.id)) user = message.author
    } else if (!user) user = message.author

    let memberMention = message.guild.members.cache.get(user.id)

  if (args[0] === 'roles' || args[0] === 'r' || args[0] === 'role' || args[1] === 'roles' || args[1] === 'r' || args[1] === 'role') {

        let embed = new Discord.MessageEmbed()
        let rolesOfTheMember = memberMention.roles.cache.filter(r => r.name !== '@everyone').map(role => `<@&${role.id}>`).join('\n')
        await message.channel.send({ embeds: [embed.setColor("RANDOM").setDescription(rolesOfTheMember).setAuthor(`Roles de ${user.username}`, user.displayAvatarURL()).setThumbnail(user.displayAvatarURL())]})
        return;
    }   else {
        
    let myInfo = new Discord.MessageEmbed()
        .setAuthor(user.username, user.displayAvatarURL({ format: "png", dynamic: true}))
        .setColor('RANDOM')
        .addField("Nombre de Usuario", user.username, true)
        .addField("Discriminador", user.discriminator, true)
        .addField("Usuario", user.tag, true)    
        .addField("Creado A las", `${user.createdAt.toUTCString().substr(0, 16)} (${checkDays(user.createdAt)})`, true)
        .addField("Miembro desde", `${memberMention.joinedAt.toUTCString().substr(0, 16)} (${checkDays(memberMention.joinedAt)})`, true)
        .addField("ID", user.id, true)
        .addField("Roles", `${memberMention.roles.cache.size}`, true)
        .setThumbnail(user.displayAvatarURL({ format: "png", dynamic: true}))

    message.channel.send({ embeds: [myInfo] })
    .catch(err => {
        console.log(err);
        })
    }
    }
}
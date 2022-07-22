const { EmbedBuilder } = require("discord.js");
const { trusted } = require("mongoose");
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

        if (memberMention.roles.cache.size == 1) return message.channel.send({ content: "Este usuario no tiene roles" })
        let embed = new EmbedBuilder()
        let rolesOfTheMember = memberMention.roles.cache.filter(r => r.name !== '@everyone').map(role => `<@&${role.id}>`).join('\n')
        await message.channel.send({ embeds: [embed.setColor("RANDOM")
        .setDescription(rolesOfTheMember)
        .setAuthor({name: `Roles de ${user.username}`, iconURL: user.displayAvatarURL()})
        .setThumbnail(user.displayAvatarURL())]})
        return;
    }   else {
        
    let myInfo = new EmbedBuilder()
        .setAuthor({name: user.username, iconURL: user.displayAvatarURL({ format: "png", dynamic: true})})
        .setColor('Random')
        .setFields(
        [
            {
                name: "Nombre y discriminador",
                value: user.tag,
                inline: true
            },
            {
                name: "Usuario",
                value: memberMention.toString(),
                inline: true
            },
            {
                name: "Creado a las",
                value: `${user.createdAt.toUTCString().substr(0, 16)} (${checkDays(user.createdAt)})`,
                inline: true
            },
            {
                name: "Miembro Desde",
                value: `${memberMention.joinedAt.toUTCString().substr(0, 16)} (${checkDays(memberMention.joinedAt)})`,
                inline: true
            },
            {
                name: "ID",
                value: user.id,
                inline: true
            }
        ])  
        .setThumbnail(user.displayAvatarURL({ format: "png", dynamic: true}))

        if (memberMention.roles.cache.size != 1) {
        myInfo.addFields([{
            name: "Roles", 
            value: `${memberMention.roles.cache.size - 1}`, 
            inline: true
        }])
    }

    message.channel.send({ embeds: [myInfo] })
    .catch(err => {
        console.log(err);
        })
    }
    }
}
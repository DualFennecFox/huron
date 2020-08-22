const Discord = require('discord.js')
const Guild = require('./models/Guild')
const { updateGuild, getGuild, createGuild } = require('./models/functions')
const validateColor = require('validate-color')

module.exports = {
    name : 'config',
    category: "Moderacion",
    description : 'El Bot muestra varios comandos para configurar ciertas cosas, como el prefix, para más información use !config',
    aliases: ['settings'],
    usage: '!config <Configuración> <Valor>',
    examples: ['!config prefix -', '!config welcomemsg'],
    run: async (client, message, args, prefix) => {
        if (!message.member.hasPermission("MANAGE_GUILD" || "ADMINISTRATOR") || !message.guild.owner) return message.channel.send("No tienes permisos para usar este comando")
        if (!args[0]) {
            const embed = new Discord.MessageEmbed()
                .setAuthor("Configuración", client.user.displayAvatarURL())
                .setColor("#FFFF00")
                .setDescription("Estos son los comandos de configuración:")
                .addField("Prefix", `Para cambiar el prefix eliga uno diciendo \"prefix\"\nEjemplo: ${prefix}config prefix - \n`)
                .addField("WelcomeMsg", `Para cambiar el mensaje de bienvenida diga \"welcomemsg\"\nEjemplo: ${prefix}config welcomemsg \`#Canal-mencionado\` Bienvenido {user} a {server}\n`)
                .addField("Leavemsg", `Para cambiar el mensaje de despedida diga \"welcomemsg\"\nEjemplo: ${prefix}config leavemsg \`#Canal-mencionado\` {user} a dejado {server}\n`)
                .addField("MuteRole", `Para establecer el rol Muteado, mencione uno, su ID o cree uno con <Nombre> [Color HTML]\nEjemplo: ${prefix}config muterole Muteado #ff0000\n`)
                .addField("DisableWelcome", "Elimina el mensaje de bienvenida, si es que esta activado\n")
                .addField("DisableLeave", "Elimina el mensaje de despedida, si es que esta activado\n")
                .addField("RemoveMute", "Elimina el Rol para Mutear, si es que existe\n")
                .addField("Tags", "Los tags para los mensajes de bienvenida y despedida son:\n\n**{user}** : Menciona al usuario\n**{username}** : Muestra el nombre y el tag del usuario\n**{server}** : Muestra el nombre del servidor\n**{owner}** : Nombra al Owner del servidor con su tag\n**{members}** : Muestra el número de miembros desde que el usuario se unio o dejo el server.")

                message.channel.send({ embed })
                return
        }
        switch (args[0]) {
            case "prefix":
                if (!message.member.hasPermission("MANAGE_GUILD" || "ADMINISTRATOR")) return message.channel.send("No tienes permisos para usar este comando")
                if (!args[1]) return message.channel.send(`Mi prefix en este server es ${prefix}`)
                let nPrefix = args.slice(1).join(" ");
                Guild.findOne({ guildID: message.guild.id }).then(doc => {
                    if (!doc) {
                        const newGuild = {
                            guildID: message.guild.id,
                            guildName: message.guild.name,
                            guildOwner: message.guild.owner.user.username,
                            guildOwnerID: message.guild.ownerID,
                            prefix: nPrefix,
                            JoinMsg: "",
                            JoinBool: false,
                            LeaveMsg: "",
                            LeaveBool: false,
                            WelcomeChannel: "",
                            LeaveChannel: "",
                            LogChannel: "",
                            log: {
                            Premium: false,
                            channelCreate: false,
                            channelDelete: false,
                            channelPinsUpdate: false,
                            channelUpdate: false,
                            emojiCreate: false,
                            emojiDelete: false,
                            emojiUpdate: false,
                            banAdd: false,
                            banRemove: false,
                            MemberAdd: false,
                            MemberRemove: false,
                            MemberUpdate: false,
                            guildUpdate: false,
                            inviteCreate: false,
                            inviteDelete: false,
                            messageDelete: false,
                            messageDeleteBulk: false,
                            messageUpdate: false,
                            roleCreate: false,
                            roleDelete: false,
                            roleUpdate: false,
                            },
                            warns: []
                          };
                          try {
                            createGuild(newGuild);
                            
                          } catch (error) {
                            console.error(error);
                          }
                          return message.channel.send(`Su nuevo Prefix es ${nPrefix}`)
                    }
                    else {
                    updateGuild(message.guild, { prefix: nPrefix });
                   return message.channel.send(`Su nuevo Prefix es ${nPrefix}`)
                }
                }).catch(err => {
                    console.error(err)
                })
            break;
            case "welcomemsg":
                if (!message.member.hasPermission("MANAGE_GUILD" || "ADMINISTRATOR" || "MANAGE_CHANNELS")) return message.channel.send("No tienes permisos para usar este comando")
                let welcomeChannel = message.mentions.channels.first();
                if (!welcomeChannel) return message.channel.send("Debes especificar un canal para enviar el mensaje")
                if (!welcomeChannel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return message.channel.send("No tengo permisos para hablar en ese canal")
                let welcomeMsg = args.slice(1).join(" ").replace(welcomeChannel, '')
                if (!welcomeMsg) return message.channel.send("Debes especificar un mensaje de bienvenida")
                Guild.findOne({ guildID: message.guild.id }).then(doc => {
                    if (!doc) {
                        const newGuild = {
                            guildID: message.guild.id,
                            guildName: message.guild.name,
                            guildOwner: message.guild.owner.user.username,
                            guildOwnerID: message.guild.ownerID,
                            prefix: '!',
                            JoinMsg: welcomeMsg,
                            JoinBool: true,
                            LeaveMsg: "",
                            LeaveBool: false,
                            WelcomeChannel: welcomeChannel.id,
                            LeaveChannel: "",
                            LogChannel: "",
                            log: {
                            Premium: false,
                            channelCreate: false,
                            channelDelete: false,
                            channelUpdate: false,
                            emojiCreate: false,
                            emojiDelete: false,
                            emojiUpdate: false,
                            banAdd: false,
                            banRemove: false,
                            MemberAdd: false,
                            MemberRemove: false,
                            MemberUpdate: false,
                            guildUpdate: false,
                            inviteCreate: false,
                            inviteDelete: false,
                            messageDelete: false,
                            messageDeleteBulk: false,
                            messageUpdate: false,
                            roleCreate: false,
                            roleDelete: false,
                            roleUpdate: false,
                            },
                            warns: []
                          };
                          try {
                            createGuild(newGuild);
                            
                          } catch (error) {
                            console.error(error);
                          }
                          return message.channel.send("Se ha establecido el mensaje de bienvenida")
                    }
                    else {
                        updateGuild(message.guild, { JoinMsg: welcomeMsg, JoinBool: true, WelcomeChannel: welcomeChannel.id})

                        return message.channel.send("Se ha establecido el mensaje de bienvenida")
                    }
                }).catch(err => {
                    console.error(err)
                })
            break;
            case "leavemsg":
                if (!message.member.hasPermission("MANAGE_GUILD" || "ADMINISTRATOR" || "MANAGE_CHANNELS")) return message.channel.send("No tienes permisos para usar este comando")
                let leaveChannel = message.mentions.channels.first();
                if (!leaveChannel) return message.channel.send("Debes especificar un canal para enviar el mensaje")
                if (!leaveChannel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return message.channel.send("No tengo permisos para hablar en ese canal")
                let leaveMsg = args.slice(1).join(" ").replace(leaveChannel, '')
                if (!leaveMsg) return message.channel.send("Debes especificar un mensaje de despedida")
                Guild.findOne({ guildID: message.guild.id }).then(doc => {
                    if (!doc) {
                        const newGuild = {
                            guildID: message.guild.id,
                            guildName: message.guild.name,
                            guildOwner: message.guild.owner.user.username,
                            guildOwnerID: message.guild.ownerID,
                            prefix: '!',
                            JoinMsg: "",
                            JoinBool: false,
                            LeaveMsg: leaveMsg,
                            LeaveBool: true,
                            WelcomeChannel: "",
                            LeaveChannel: leaveChannel.id,
                            LogChannel: "",
                            log: {
                            Premium: false,
                            channelCreate: false,
                            channelDelete: false,
                            channelUpdate: false,
                            emojiCreate: false,
                            emojiDelete: false,
                            emojiUpdate: false,
                            banAdd: false,
                            banRemove: false,
                            MemberAdd: false,
                            MemberRemove: false,
                            MemberUpdate: false,
                            guildUpdate: false,
                            inviteCreate: false,
                            inviteDelete: false,
                            messageDelete: false,
                            messageDeleteBulk: false,
                            messageUpdate: false,
                            roleCreate: false,
                            roleDelete: false,
                            roleUpdate: false,
                            },
                            warns: [],
                            role: []
                          };
                          try {
                            createGuild(newGuild);
                            
                          } catch (error) {
                            console.error(error);
                          }
                          return message.channel.send("Se ha establecido el mensaje de despedida") 
                    }
                    else {
                        updateGuild(message.guild, { LeaveMsg: leaveMsg, LeaveBool: true, LeaveChannel: leaveChannel.id})
                        return message.channel.send("Se ha establecido el mensaje de despedida") 
                    }
                }).catch(err => {
                    console.error(err)
                })               
                
            break;
            case "disablewelcome":
                if (!message.member.hasPermission("MANAGE_GUILD" || "ADMINISTRATOR" || "MANAGE_CHANNELS")) return message.channel.send("No tienes permisos para usar este comando")

                Guild.findOne({ guildID: message.guild.id }).then(doc => {
                    if (!doc) {
                       message.channel.send("No existe un mensaje de bienvenida")
                       return getGuild(message.guild)
                    }
                   else if (doc.JoinBool == false) return message.channel.send("Ya estaba desactivado el mensaje")
                else {
                updateGuild(message.guild, { JoinMsg: "", JoinBool: false, WelcomeChannel: ""})
        
                message.channel.send("Se ha eliminado el mensaje de bienvenida")
                }
                }).catch(err => {
                    console.error(err)
                    return message.channel.send("Ha ocurrido un error")
                })
            break;
            case "disableleave":
                Guild.findOne({ guildID: message.guild.id }).then(doc => {
                    if (!doc) {
                        message.channel.send("No existe un mensaje de bienvenida")
                        return getGuild(message.guild)
                     }
                   else if (doc.LeaveBool == false) return message.channel.send("Ya estaba desactivado el mensaje")
                else {
                updateGuild(message.guild, { LeaveMsg: "", LeaveBool: false, LeaveChannel: ""})
        
                message.channel.send("Se ha eliminado el mensaje de despedida")
                }
            }).catch(err => {
                console.error(err)
                message.channel.send("Ha ocurrido un error")
            })
            break;
            case "muterole":
                if (!message.member.hasPermission("MANAGE_ROLES" || "ADMINISTRATOR")) return message.channel.send("No tienes permisos para usar este comando")
                if (!args[1]) return message.channel.send(`Menciona un rol, su ID o crea uno especificandolo`)
                if (!message.guild.me.hasPermission("MANAGE_ROLES", "MANAGE_CHANNELS")) return message.channel.send("No tengo permisos para Gestionar Roles o Gestionar Canales!")


                    let mRole = message.mentions.roles.first() || message.guild.roles.cache.get(args[1])
                    if (!mRole) {
                    let Color = args[2]
                    if (!validateColor.validateHTMLColorHex(Color)) Color = "#9b9b9b"
                        try {
                            var muterole = await message.guild.roles.create({ data: {  
                                name : args[1],
                                color : Color,
                                permissions : []
                            }
                            })
                            message.guild.channels.cache.forEach(async (channel, id) => {
                                await channel.createOverwrite(muterole,  {
                                    SEND_MESSAGES: false,
                                    CREATE_INSTANT_INVITE: false,
                                    ADD_REACTIONS: false,
                                    SEND_TTS_MESSAGES: false,
                                    ATTACH_FILES: false,
                                    SPEAK: false
                                })
                            })
                            mRole = muterole
                        } catch (err) {
                            console.error(err)
                           return message.channel.send(`Se ha ocurrido un error al crear o modificar el rol ${mRole}`)
                    }
                }
                Guild.findOne({ guildID: message.guild.id }).then(doc => {
                    if (!doc) {
                        const newGuild = {
                            guildID: message.guild.id,
                            guildName: message.guild.name,
                            guildOwner: message.guild.owner.user.username,
                            guildOwnerID: message.guild.ownerID,
                            prefix: '!',
                            JoinMsg: "",
                            JoinBool: false,
                            LeaveMsg: "",
                            LeaveBool: false,
                            WelcomeChannel: "",
                            LeaveChannel: "",
                            LogChannel: "",
                            log: {
                            Premium: false,
                            channelCreate: false,
                            channelDelete: false,
                            channelUpdate: false,
                            emojiCreate: false,
                            emojiDelete: false,
                            emojiUpdate: false,
                            banAdd: false,
                            banRemove: false,
                            MemberAdd: false,
                            MemberRemove: false,
                            MemberUpdate: false,
                            guildUpdate: false,
                            inviteCreate: false,
                            inviteDelete: false,
                            messageDelete: false,
                            messageDeleteBulk: false,
                            messageUpdate: false,
                            roleCreate: false,
                            roleDelete: false,
                            roleUpdate: false,
                            },
                            warns: [],
                            role: [],
                            muterole: mRole.id
                          };
                          try {
                            createGuild(newGuild);
                            
                          } catch (error) {
                            console.error(error);
                          }
                          return message.channel.send(`Se ha establecido el Rol **${mRole.name}**`) 
                    }
                    else {
                        updateGuild(message.guild, { muterole: mRole.id })
                        return message.channel.send(`Se ha establecido el Rol **${mRole.name}**`) 
                    }
                }).catch(err => {
                    console.error(err)
                    message.channel.send("Ha ocurrido un error")
                })               
            break;
            case "disablemute":
                Guild.findOne({ guildID: message.guild.id }).then(doc => {
                    if (!doc) {
                        message.channel.send("No existe un rol de Muteado")
                        return getGuild(message.guild)
                     }
                   else if (!doc.muterole) return message.channel.send("No existe un rol de Muteado")
                else {
                updateGuild(message.guild, { muterole: "" })
        
                message.channel.send("Se ha eliminado el rol")
                }
            }).catch(err => {
                console.error(err)
                message.channel.send("Ha ocurrido un error")
            })
            break;
            case "logchannel": 
            if (!message.member.hasPermission("MANAGE_GUILD" || "ADMINISTRATOR" || "MANAGE_MEMBERS")) return message.channel.send("No tienes permisos para usar este comando")
        
        let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]);
        if (!channel) return message.channel.send("Debes especificar un canal")

        if (!channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return message.channel.send("No tengo permisos para hablar en ese canal")

        Guild.findOne({ guildID: message.guild.id }).then(doc => {
            if (!doc) {
                const newGuild = {
                    guildID: message.guild.id,
                    guildName: message.guild.name,
                    guildOwner: message.guild.owner.user.username,
                    guildOwnerID: message.guild.ownerID,
                    prefix: '!',
                    JoinMsg: "",
                    JoinBool: false,
                    LeaveMsg: "",
                    LeaveBool: false,
                    WelcomeChannel: "",
                    LeaveChannel: "",
                    LogChannel: channel,
                    log: {
                    Premium: false,
                    channelCreate: false,
                    channelDelete: false,
                    channelUpdate: false,
                    emojiCreate: false,
                    emojiDelete: false,
                    emojiUpdate: false,
                    banAdd: false,
                    banRemove: false,
                    MemberAdd: false,
                    MemberRemove: false,
                    MemberUpdate: false,
                    guildUpdate: false,
                    inviteCreate: false,
                    inviteDelete: false,
                    messageDelete: false,
                    messageDeleteBulk: false,
                    messageUpdate: false,
                    roleCreate: false,
                    roleDelete: false,
                    roleUpdate: false,
                    userUpdate: false,
                    voiceState: false
                    },
                    warns: [],
                    role: []
                  };
                  try {
                    createGuild(newGuild);
                  } catch (error) {
                    console.error(error);
                  }
            }
            else updateGuild(message.guild, { LogChannel: channel })
            
            return message.channel.send("Se ha establecido el canal de registros")
        }).catch(err => {
            console.error(err)
            message.channel.send("Ha ocurrido un error al establecer el canal de registros")
        })
            default:
                const embed = new Discord.MessageEmbed()
                .setAuthor("Configuración", client.user.displayAvatarURL())
                .setColor("#FFFF00")
                .setDescription("Estos son los comandos de configuración:")
                .addField("Prefix", "Para cambiar el prefix eliga uno diciendo \"prefix\"\n Ejemplo: config prefix - \n")
                .addField("WelcomeMsg", "Para cambiar el mensaje de bienvenida diga \"welcomemsg\"\n Ejemplo: config welcomemsg \`#Canal-mencionado\` Bienvenido {user} a {server}\n")
                .addField("Leavemsg", "Para cambiar el mensaje de despedida diga \"welcomemsg\"\n Ejemplo: config leavemsg \`#Canal-mencionado\` {user} a dejado {server}\n")
                .addField("DisableWelcome", "Elimina el mensaje de bienvenida, si es que esta activado\n")
                .addField("DisableLeave", "Elimina el mensaje de despedida, si es que esta activado\n")
                .addField("Tags", "Los tags para los mensajes de bienvenida y despedida son:\n {user} : Menciona al usuario\n {username} : Muestra el nombre y el tag del usuario\n {server} : Muestra el nombre del servidor\n {owner} : Nombra al Owner del servidor con su tag\n {members} : Muestra el número de miembros desde que el usuario se unio o dejo el server.")

                message.channel.send({ embed })
            break;
        }
    }
}
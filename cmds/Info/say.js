const { perms } = require("../Moderacion/models/functions")

module.exports = {
    name : 'say',
    category: "Info",
    description : 'El bot envia un mensaje escrito por un usuario al canal',
    usage: '!say <Mensaje>',
    examples: ['!say Hola Mundo'],
    run: async (client, message, args) => {
        
    let argsresult;
    if (message.guild.me.permissions.has(perms.manage_messages || perms.administrator)) message.delete()
        

        argsresult = args.join(" ")
        if(!argsresult) return;

        if (!message.member.permissions.has(perms.mention_everyone || perms.administrator)) {
            argsresult = argsresult.replace(/@/, "@\u200b")
        }
        if(!message.member.permissions.has(perms.manage_messages || perms.administrator)) {
            
               argsresult = argsresult.replace(/(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li|com)|discordapp\.com\/invite)\/.+[A-z0-9]/, "")

        }

         message.channel.send({ content: argsresult})
        }
}

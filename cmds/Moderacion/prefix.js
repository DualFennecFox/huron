module.exports = {
    name: "prefix",
    category: "Moderacion",
    description : "Con este comando puedes ver tu prefix o cambiarlo elijiendo uno",
    aliases: ['Prefix', 'PREFIX'],
    usage: '!prefix',
    examples: ['!prefix -', '!prefix --='],
    run: async (client,message,args,db,prefix) => {
    if(!message.member.hasPermission("KICK_MEMBERS", "BAN_MEMBERS", "ADMINISTRATOR", "MANAGE_ROLES") || !message.guild.owner) return message.channel.send("No tienes permisos para usar este comando!");
    if (args.length === 0){
        message.channel.send(`Mi prefix en este server es ${prefix}`);
    } else if (args.length === 1){
        let nPrefix = args[0];

        db.collection('guilds').doc(message.guild.id).update({
            'prefix' : nPrefix
        }).then(() => {
            message.channel.send(`Su nuevo Prefix es ${nPrefix}`);
        });
    }

}
}
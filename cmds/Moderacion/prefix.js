const Discord = require('discord.js');
const Prefix = require("./models/prefix.js");
const mongoose = require('mongoose');

module.exports = {
    name: "prefix",
    category: "Moderacion",
    description : "Con este comando puedes ver tu prefix o cambiarlo elijiendo uno",
    aliases: ['Prefix', 'PREFIX'],
    usage: '!prefix',
    examples: ['!prefix -', '!prefix --='],
    run: async (client,message,args,db,prefix) => {
            if (args.length === 0){
            message.channel.send(`Mi prefix en este server es ${prefix}`);
        } else if (args.length === 1){
            if(!message.member.hasPermission("KICK_MEMBERS", "BAN_MEMBERS", "ADMINISTRATOR") || !message.guild.owner) return message.channel.send("No tienes permisos para usar este comando!")
            let nPrefix = args[0];
    const prefixes = new prefixes({
        _id: mongoose.Types.ObjectId(),
        prefix: nPrefix
    });

    prefixes.save()
    .then(result => console.log(result))
    .catch(err => console.log(err));

    message.channel.send(`Su nuevo Prefix es ${nPrefix}`);
    }
}
}

const reqEvent = (event) => require(`../events/${event}`);
module.exports = client => {
  client.on('ready', () => reqEvent('ready')(client));
  client.on('message', reqEvent('message'));
  client.on('error', reqEvent('error'));
  client.on('disconnect', reqEvent('disconnect'))
  client.on('channelCreate', reqEvent('channelCreate'));
  client.on('channelDelete', reqEvent('channelDelete'));
  client.on('emojiCreate', reqEvent('emojiCreate'));
  client.on('emojiDelete', reqEvent('emojiDelete'));
  client.on('emojiUpdate', reqEvent('emojiUpdate'));
  client.on('guildBanAdd', reqEvent('guildBanAdd'));
  client.on('guildBanRemove', reqEvent('guildBanRemove'));
  client.on('guildCreate', reqEvent('guildCreate'));
  client.on('guildDelete', reqEvent('guildDelete'));
  client.on('guildMemberAdd', reqEvent('guildMemberAdd'));
  client.on('guildMemberRemove', reqEvent('guildMemberRemove'));
  client.on('guildMemberUpdate', reqEvent('guildMemberUpdate'));
  client.on('guildUpdate', reqEvent('guildUpdate'));
  client.on('inviteCreate', reqEvent('inviteCreate'));
  client.on('inviteDelete', reqEvent('inviteDelete'));
  client.on('messageDelete', reqEvent('messageDelete'));
  client.on('messageUpdate', reqEvent('messageUpdate'));
  client.on('roleCreate', reqEvent('roleCreate'));
  client.on('roleDelete', reqEvent('roleDelete'));
  client.on('roleUpdate', reqEvent('roleUpdate'));
};
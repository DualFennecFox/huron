import ExtendedClient from "../classes/extendedClient";

const reqEvent = async (event: string, client: ExtendedClient) => {
  const fun = (await import(`../events/${event}`)).default as (...args: unknown[]) => void;
  client.on(event, fun);
};

export default function eventLoader(client: ExtendedClient) {
  reqEvent("ready", client);
  reqEvent("messageCreate", client);
  reqEvent("error", client);
  reqEvent("disconnect", client);
  reqEvent("channelCreate", client);
  reqEvent("channelDelete", client);
  reqEvent("emojiCreate", client);
  reqEvent("emojiDelete", client);
  reqEvent("emojiUpdate", client);
  reqEvent("guildBanAdd", client);
  reqEvent("guildBanRemove", client);
  reqEvent("guildCreate", client);
  reqEvent("guildDelete", client);
  reqEvent("guildMemberAdd", client);
  reqEvent("guildMemberRemove", client);
  reqEvent("guildMemberUpdate", client);
  reqEvent("guildUpdate", client);
  reqEvent("messageDelete", client);
  reqEvent("messageUpdate", client);
  reqEvent("roleCreate", client);
  reqEvent("roleDelete", client);
  reqEvent("roleUpdate", client);
}
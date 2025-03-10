import { Events } from "discord.js";
import ExtendedClient from "../classes/extendedClient";

const reqEvent = async (event: Events, client: ExtendedClient) => {
  const fun = (await import(`../events/${event}`)).default as (...args: unknown[]) => void;
  client.on(event.toString(), fun);
};

export default function eventLoader(client: ExtendedClient) {
  reqEvent(Events.ClientReady, client);
  reqEvent(Events.MessageCreate, client);
  reqEvent(Events.Error, client);
  reqEvent(Events.ShardDisconnect, client);
  reqEvent(Events.ChannelCreate, client);
  reqEvent(Events.ChannelDelete, client);
  reqEvent(Events.GuildEmojiCreate, client);
  reqEvent(Events.GuildEmojiDelete, client);
  reqEvent(Events.GuildEmojiUpdate, client);
  reqEvent(Events.GuildBanAdd, client);
  reqEvent(Events.GuildBanRemove, client);
  reqEvent(Events.GuildCreate, client);
  reqEvent(Events.GuildDelete, client);
  reqEvent(Events.GuildMemberAdd, client);
  reqEvent(Events.GuildMemberRemove, client);
  reqEvent(Events.GuildMemberUpdate, client);
  reqEvent(Events.GuildUpdate, client);
  reqEvent(Events.MessageDelete, client);
  reqEvent(Events.MessageUpdate, client);
  reqEvent(Events.GuildRoleCreate, client);
  reqEvent(Events.GuildRoleDelete, client);
  reqEvent(Events.GuildRoleUpdate, client);
  reqEvent(Events.InteractionCreate, client)
}
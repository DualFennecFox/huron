import { Guild } from "discord.js";
import GuildModel from '../cmds/Moderacion/models/Guild';

export default async function guildDelete(guild: Guild) {
  const doc = await GuildModel.findOne({ guildID: guild })
  if (doc) doc.deleteOne()
}
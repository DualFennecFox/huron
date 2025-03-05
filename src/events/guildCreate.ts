import { Guild } from "discord.js"
import { getGuild } from '../cmds/Moderacion/models/functions'

export default async function guildCreate(guild: Guild) {
  getGuild(guild)
}
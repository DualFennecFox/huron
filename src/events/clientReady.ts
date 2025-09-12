import { ActivityType } from "discord.js";
import ExtendedClient from "../classes/extendedClient";

export default async function ready(client: ExtendedClient) {
  console.log(`Logged in as ${client.user?.tag}!`);
  client.guilds.cache.forEach(async guild => {

    await guild.members.fetch()
  })
  const scount = client.guilds.cache.size
  client.user?.setPresence({
    status: "online",
    activities: [{
      name: `Estoy en ${scount} Servidores!`,
      type: ActivityType.Streaming,
      url: "https://trovo.live/DualFennecFox"
    }],
  });
}
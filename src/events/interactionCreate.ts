import { GuildMember, Interaction, MessageFlags, TextChannel } from "discord.js";
import ExtendedClient from "../classes/extendedClient";
import { YouTubePlugin } from "@distube/youtube";
import Metadata from "../classes/Metadata";

export default async function interactionCreate(interaction: Interaction) {
    const client = interaction.client as ExtendedClient
    const YTPlugin = client.distube.plugins[0] as YouTubePlugin
    if (!interaction.isButton() || !YTPlugin.validate(interaction.customId)) return

    client.distube.play<Metadata>((interaction.member as GuildMember).voice.channel!, interaction.customId, {
        textChannel: interaction.channel as TextChannel,
        metadata: { user: interaction.user, msg: null }
    }).catch(err => {
        console.error(err);
        interaction.reply({ content: "Algo salio mal vuelva a intentarlo" })
    })
    await interaction.deferUpdate()
    await interaction.deleteReply()
    await interaction.followUp({ content: 'Se ha elegido la canción', flags: MessageFlags.Ephemeral })
}
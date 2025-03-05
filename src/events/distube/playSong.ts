import { ColorResolvable, EmbedBuilder } from "discord.js";
import { isURL, Queue, Song } from "distube";
import Metadata from "../../classes/Metadata";

const sourceColor = {
    "youtube": "#FF0000",
    "spotify": "#1DB954",
    "soundcloud": "#F25B02",
    "applemusic": "#FA233B",
    "deezer": "#A238FF",
    "generic": "#A238FF"
}

export default async function playSong(queue: Queue, song: Song) {
    if (queue.previousSongs.length != 0 &&  (queue.previousSongs[0].metadata as Metadata)?.msg?.deletable) {
try {
        (queue.previousSongs[0].metadata as Metadata)?.msg?.delete()
} catch {
}
    }

    const videoEmbed = new EmbedBuilder()
        .setAuthor({ name: "Música", iconURL: (queue.songs[0].metadata as Metadata)?.user.displayAvatarURL({ size: 2048 }) })
        .setThumbnail(song.thumbnail ?? "")
        .setColor(sourceColor[song.source as keyof typeof sourceColor] as ColorResolvable)
        .addFields([
            {
                name: "Escuchando",
                value: `[${song.name}](${song.url})`
            }])
        .setFooter({ text: "¡Ahora con soporte para Spotify, Deezer, Apple Music y más!" })
    if (song.duration != 0) {
        videoEmbed.addFields([{
            name: "Duración",
            value: song.formattedDuration
        }])
    }
    if (song.source != "generic") {
        videoEmbed.addFields([{
            name: song.source == "youtube" ? "Canal" : "Artista",
            value: isURL(song.uploader.url) ? `[${song.uploader.name}](${song.uploader.url})` : `${song.uploader.name}`
        }])
    }
    if (queue.songs.length > 1) {
        const nextsong = queue.songs[1]
        videoEmbed.addFields([{
            name: "Siguiente canción",
            value: `[${nextsong.name}](${nextsong.url})`
        }])
    }

    const msg = await queue.textChannel?.send({ embeds: [videoEmbed] })
    const metadata = (queue.songs[0].metadata as Metadata)
    queue.songs[0].metadata = { user: metadata.user, msg: msg }

}

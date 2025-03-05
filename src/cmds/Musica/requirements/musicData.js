import { AudioPlayer, VoiceConnection } from "@discordjs/voice";
import { Message } from "discord.js";

export interface Song {
    url: string,
    title: string,
    duration: number,
    thumbnail: string,
    channel: string,
    channelURL: string,
    voiceChannel: VoiceConnection,
    provider: "Youtube" | "SoundCloud" | "Spotify"
}
export interface MusicData {
    [index: string]: Server
}
export interface Looped {
    url: string
}

export interface Server {
    [index: string]: {
        queue: Song[];
        loop: boolean;
        isPlaying: Song | null;
        looped: Looped[];
        songDispatcher: AudioPlayer | null;
        pause: boolean;
        unPaused: boolean;
        awaiting: boolean;
        lastEmbed: Message | null;
    }
}

const server: MusicData = {};
export default server;
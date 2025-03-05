import { Client, Collection } from "discord.js";
import commandType from "./commandType";
import logType from "./logType";
import configType from "./configType";
import Distube from 'distube'
import { YouTubePlugin } from "@distube/youtube"
import { SpotifyPlugin } from "@distube/spotify"
import { SoundCloudPlugin } from "@distube/soundcloud"
import { AppleMusicPlugin } from "distube-apple-music"
import { YtDlpPlugin } from "@distube/yt-dlp"
import { DeezerPlugin } from "@distube/deezer"
import { readFileSync } from "fs";
import path from "path";
import { Cookie } from "@distube/ytdl-core";

const youtubePlugin = new YouTubePlugin({
    cookies: JSON.parse(readFileSync(path.join(__dirname, "../../cookies.json"), 'utf-8')) as Cookie[]
});

export default class ExtendedClient extends Client {
    distube = new Distube(this, {
        plugins: [
            youtubePlugin,
            new SpotifyPlugin(),
            new AppleMusicPlugin(),
            new SoundCloudPlugin(),
            new DeezerPlugin(),
            new YtDlpPlugin({ update: false }),
        ],
        emitNewSongOnly: true,
        emitAddListWhenCreatingQueue: true,
        emitAddSongWhenCreatingQueue: true,
        
    })
    commands: Collection<string, commandType> = new Collection<string, commandType>()
    aliases: Collection<string, string> = new Collection<string, string>()
    log: Collection<string, logType> = new Collection<string, logType>
    configs: Collection<string, configType> = new Collection<string, configType>
}
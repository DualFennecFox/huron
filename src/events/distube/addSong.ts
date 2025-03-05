import { Queue, Song } from "distube";

export default async function playSong(queue: Queue, song: Song) {
    return queue.textChannel?.send(`**${song.name}** Se ha añadido a la cola`);
}
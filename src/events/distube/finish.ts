import { Queue } from "distube";

export default async function finish(queue: Queue) {
    setTimeout(() => {
        if (queue.songs.length == 0) queue.voice.connection.destroy()
    }, 60000);
}
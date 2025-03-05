import { Queue } from "distube";

export default async function finish(queue: Queue) {
    await queue.textChannel?.send("Se han terminado todas las canciones")
    setTimeout(() => {
        if (queue.songs.length == 0) queue.voice.connection.destroy()
    }, 60000);
}
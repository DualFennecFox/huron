import { DisTubeEvents, Events } from "distube";
import ExtendedClient from "../classes/extendedClient";

const reqEvent = async (event: Events, client: ExtendedClient) => {
  const fun = (await import(`../events/distube/${event}`)).default as (...args: unknown[]) => void;
  client.distube.on(event as keyof DisTubeEvents, fun);
};

export default function distubeLoader(client: ExtendedClient) {
  reqEvent(Events.PLAY_SONG, client);
  reqEvent(Events.ADD_SONG, client);
  reqEvent(Events.ERROR, client);
  reqEvent(Events.DISCONNECT, client)
  reqEvent(Events.FINISH, client)
  //reqEvent(Events.FFMPEG_DEBUG, client)
}
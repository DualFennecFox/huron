import { readdirSync } from "fs";
import ExtendedClient from "../classes/extendedClient";
import path from "path";
import logType from "../classes/logType";

export default async function logsHandler(client: ExtendedClient) {
    const cmds = path.join(__dirname, "../logs/")
    const commands = readdirSync(cmds).filter(file => file.endsWith(".js"));

    for (const file of commands) {
        const pull = (await import(path.join(cmds, file))).default as logType;

        if (pull.name) {
            client.log.set(pull.name, pull);
        } else {
            continue;
        }
    }
    console.log("Se han cargado los logs");
}
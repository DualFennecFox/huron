import { readdir } from "fs/promises";
import ExtendedClient from "../classes/extendedClient";
import path from "path";
import configType from "../classes/configType";

export default async function configsHandler(client: ExtendedClient) {
    const cmds = path.join(__dirname, "../configs/")
        const commands = (await readdir(cmds)).filter(file => file.endsWith(".js"));
    
        for (const file of commands) {
            const pull = (await import(path.join(cmds, file))).default as configType;
            if (pull.name) {
                client.configs.set(pull.name, pull);
            } else {
                continue;
            }
        }
    console.log("Se han cargado las configuraciones");
}
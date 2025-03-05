import { readdir } from "fs/promises";
import ExtendedClient from "../classes/extendedClient";
import commandType from "../classes/commandType";

import { AsciiTable3 } from "ascii-table3";
import path from "path";

const table = new AsciiTable3("Commands");
table.setHeading("Command", "Load status");

export default async function commandHandler(client: ExtendedClient) {
    const cmds = path.join(__dirname, "../cmds/")
    const dirs = await readdir(cmds)
    const dirPromise = dirs.map(async dir => {
        const commands = (await readdir(path.join(cmds, dir))).filter(file => file.endsWith(".js"));

        for (const file of commands) {
            const pull = (await import(path.join(cmds, dir, file))).default as commandType;
            if (pull.name) {
                client.commands.set(pull.name, pull);
                table.addRow(file, '✅');
            } else {
                table.addRow(file, `❌  -> missing a help.name, or help.name is not a string.`);
                continue;
            }

            if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach(alias => client.aliases.set(alias, pull.name));
        }
    });
    await Promise.all(dirPromise)
    console.log(table.toString());
}
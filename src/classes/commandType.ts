import { Client, Message } from "discord.js";

interface RunParams {
    client: Client;
    message: Message;
    args: string[];
    prefix: string;
    contentPrefix: string;
}

export type runType = (params: RunParams) => void;
export default interface commandType {
    name: string,
    aliases?: string[]
    category: string,
    description: string,
    usage: string,
    examples: string[],
    run: runType
}
import { Message } from "discord.js";

export default interface configType {
    name: string,
    run: (message: Message, args: string[], method: "enable" | "disable") => void
}
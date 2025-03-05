import { Message } from "discord.js";

export default interface logType {
    name: string
    run: (message: Message, method: "enable" | "disable") => void
}
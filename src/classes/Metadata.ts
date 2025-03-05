import { Message, User } from "discord.js";

export default interface Metadata {
    user: User,
    msg: Message | null
}
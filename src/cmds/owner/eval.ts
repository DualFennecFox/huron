import { Message, TextChannel } from "discord.js";

export default {
  name: "eval",
  category: "owner",
  run: async ({ message, args }: {
    message: Message,
    args: string[]
  }) => {

    if (message.author.id !== process.env.OWNER) return

    try {
      const code = args.join(" ");
      let evaled = await eval(code);

      if (typeof evaled !== "string")
        evaled = (await import("util")).inspect(evaled);

      (message.channel as TextChannel).send(clean(evaled));
    } catch (err) {
      (message.channel as TextChannel).send(`Error\n\n${clean(err)}\n`);
    }
  }
}

const clean = (text: unknown) => {
  if (typeof (text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
    return `${text}`;
}
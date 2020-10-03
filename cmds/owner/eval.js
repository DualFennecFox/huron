module.exports = {
    name: "eval",
    category: "owner",
    run: async (client, message, args) => {

        if (message.author.id !== process.env.OWNER) return
        
try {
    const code = args.join(" ");
    let evaled = await eval(code);

    if (typeof evaled !== "string")
      evaled = require("util").inspect(evaled);

    message.channel.send(clean(evaled), {code:"xl"});
  } catch (err) {
    message.channel.send(`Error\n\n${clean(err)}\n`);
  }
}
}

const clean = text => {
    if (typeof(text) === "string")
      return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
  }
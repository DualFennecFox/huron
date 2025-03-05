import { Message, PermissionFlagsBits, TextChannel } from "discord.js";

export default {
  name: 'clear',
  category: "Moderacion",
  description: 'Este comando borra un número de mensajes seleccionados por el usuario',
  aliases: ['purge'],
  usage: '!clear <Número del 1 al 100>',
  examples: ['!clear 50'],
  run: async ({ message, args }: {
    message: Message,
    args: string[]
  }) => {
    if (!message.member?.permissions.has(PermissionFlagsBits.ManageMessages)) return (message.channel as TextChannel).send("No tienes permisos para usar este comando!").then(message => setTimeout(() => message.delete(), 5000)).catch(err => console.error(err))
    if (!message.guild?.members.me?.permissions.has(PermissionFlagsBits.ManageMessages)) return (message.channel as TextChannel).send("No tengo permisos para borrar mensajes!").then(message => setTimeout(() => message.delete(), 5000)).catch(err => console.error(err))
    const amount = parseInt(args[0]);
    if (isNaN(amount)) return (message.channel as TextChannel).send("Dime cuantos mensajes quieres borrar!").then(message => setTimeout(() => message.delete(), 5000)).catch(err => console.error(err))
    else if (amount <= 1 || amount > 100) {
      return (message.channel as TextChannel).send('Debes elegir un número entre 1 y 100');
    }
    if (message) await message.delete()
    const messages = await (message.channel as TextChannel).messages.fetch({ limit: amount })
    await (message.channel as TextChannel).bulkDelete(messages, true)

    const messagesDeleted = [...messages.values()].length;
    await (message.channel as TextChannel).send(`Se han borrado ${messagesDeleted} mensajes`).then(message => setTimeout(() => message.delete(), 5000))
  }
}
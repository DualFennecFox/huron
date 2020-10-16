const fs = require('fs')

module.exports = {
    name: "gift",
    category: "owner",
    run: async (client, message, args) => {

        if (message.author.id !== process.env.OWNER) return

fs.readFile("../../message_2.txt", function(err, data) {

for (let code of data) {

return message.channel.send(`https://discord.gift/${code}`)
}
})
    }
}
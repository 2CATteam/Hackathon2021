const { DMChannel } = require("discord.js")

module.exports = class Signup {
    constructor(data) {
        this.data = data
    }

    look(msg) {
        if (msg.content.match(/^\/support <@!?(\d+)>/i)) {
            var id = msg.content.match(/^\/support <@!?(\d+)>/i)[1]
            this.sendSupportRequest(id, msg.author.username, msg.author.id)
        } else if (msg.content.match(/^\/support (.+#\d{4})/i)) {
            var username = msg.content.match(/^\/support (.+#\d{4})/i)[1]
            var id = this.data.bot.users.cache.find(u => u.tag == username).id
            if (!id) {
                msg.channel.send("I could not find that user. Make sure they're in the same server as me. Try running this command with an @mention to them, or do it with their id.")
                return
            }
            this.sendSupportRequest(id, msg.author.username, msg.author.id)
        } else if (msg.content.match(/^\/support (\d+)/i)) {
            var id = msg.content.match(/^\/support (\d+)/i)[1]
            this.sendSupportRequest(id, msg.author.username, msg.author.id)
        } else if (msg.content.match(/^\/accept (\d+)/i)) {
            if (!this.data.network[msg.author.id]) {
                this.data.network[msg.author.id] = {}
            }
            this.data.network[msg.author.id][msg.content.match(/\/accept (\d+)/i)[1]] = {
                "activity": false,
                "messages": false
            }
            this.data.rw.write("./network.json", this.data.network)
        }
    }

    sendSupportRequest(id, supporter, supporterID) {
        this.data.bot.users.fetch(id).then(async(usr) => {
            var channel = usr.dmChannel
            if (!channel) {
                channel = await usr.createDM()
            }
            channel.send(`${supporter} would like to support your mental health using this bot. What this means is that I will notify them when:

1. You've played more than 40 hours of games in a week
2. You've gone a week without talking in any of your chats (At least, the ones I'm in as well)
3. You send incredibly negative messages

To accept this person's support, type /accept ${supporterID}
If you do not wish to accept this person's support, please contact them to let them know why. If you do not feel comfortable doing that for any reason, feel free to ignore this message.
            `)
        })
    }
}
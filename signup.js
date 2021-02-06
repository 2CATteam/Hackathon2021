const { DMChannel } = require("discord.js")

module.exports = class Signup {
    constructor(data) {
        this.data = data
    }

    look(msg) {
        if (msg.content.match(/^\/support <@!?(\d+)>(?:\s+(\d+)\s+(\d+))?/i)) {
            var supReq = msg.content.match(/^\/support <@!?(\d+)>(?:\s+(\d+)\s+(\d+))?/i)
            var id = supReq[1]
            var videoGameHours = supReq[2]
            var msgDays = supReq[3]
            this.sendSupportRequest(id, msg.author.username, msg.author.id, videoGameHours, msgDays)
        } else if (msg.content.match(/^\/support (.+#\d{4})(?:\s+(\d+)\s+(\d+))?/i)) {
            var supReq = msg.content.match(/^\/support (.+#\d{4})(?:\s+(\d+)\s+(\d+))?/i)
            var username = supReq[1]
            var videoGameHours = supReq[2]
            var msgDays = supReq[3]
            var id = this.data.bot.users.cache.find(u => u.tag == username).id
            if (!id) {
                msg.channel.send("I could not find that user. Make sure they're in the same server as me. Try running this command with an @mention to them, or do it with their id.")
                return
            }
            this.sendSupportRequest(id, msg.author.username, msg.author.id, videoGameHours, msgDays)
        } else if (msg.content.match(/^\/support (\d+)(?:\s+(\d+)\s+(\d+))?/i)) {
            var supReq = msg.content.match(/^\/support (.+#\d{4})(?:\s+(\d+)\s+(\d+))?/i)
            var id = supReq[1]
            var videoGameHours = supReq[2]
            var msgDays = supReq[3]
            this.sendSupportRequest(id, msg.author.username, msg.author.id, videoGameHours, msgDays)
        } else if (msg.content.match(/^\/accept (\d+)(?:\s+(\d+)\s+(\d+))?/i)) {
            if (!this.data.network[msg.author.id]) {
                this.data.network[msg.author.id] = {}
            }
            var acptReq = msg.content.match(/^\/accept (\d+)(?:\s+(\d+)\s+(\d+))?/i)
            this.data.network[msg.author.id][acptReq[1]] = {
                "activity": false,
                "messages": false, 
                "hours": acptReq[2],
                "days": acptReq[3]
            }
            this.data.rw.write("./network.json", this.data.network)
        }
    }

    sendSupportRequest(id, supporter, supporterID, hours, days) {
        this.data.bot.users.fetch(id).then(async(usr) => {
            var channel = usr.dmChannel
            if (!channel) {
                channel = await usr.createDM()
            }
            channel.send(`${supporter} would like to support your mental health using this bot. What this means is that I will notify them when:

1. You've played more than ${hours} hour(s) of games in a week
2. You've gone ${days} day(s) without talking in any of your chats (At least, the ones I'm in as well)
3. You send incredibly negative messages

To accept this person's support, type /accept ${supporterID}
If you do not wish to accept this person's support, please contact them to let them know why. If you do not feel comfortable doing that for any reason, feel free to ignore this message.
            `)
        })
    }
}
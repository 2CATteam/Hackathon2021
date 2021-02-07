const { TextChannel } = require('discord.js')
var fs = require('fs')

module.exports = class PositivityTracker {
	constructor(data) {
		this.data = data
		this.positivityObj = JSON.parse(fs.readFileSync("./AFINN.json"))
	}

	look(msg) {
        if (this.analyze(msg.content) < -20) {
            (async () => {
                var channel = msg.author.dmChannel
                if (!channel) {
                    channel = await msg.author.createDM()
                }
                channel.send("Hey, your last message seemed a little negative. It's okay to be negative sometimes, but maybe take a moment to consider the good in life.")
            })()
        }
        if (msg.content.match(/\/positivity <@!?(\d+)>/i)) {
            msg.channel.send("Got it, working on it...")
            this.crawl(msg, msg.content.match(/\/positivity <@!?(\d+)>/i)[1])
        }
    }
    
    analyze(text) {
        //save message as a string and look through array to calculate positivity score
		var messageArr = text.toLowerCase().split(" ")
		var positivityScore = 0;

		//loop through the array that holds the message
		for(var j = 0; j < messageArr.length; ++j){
			var messageWord = messageArr[j].replace(/[^a-zA-Z]/ig, "")

			//loop through array that hold positivity scores and see if the keys match the message word
			for(var h in this.positivityObj){
				//if the words match sum up the  key values
				if(messageWord == h){
					positivityScore += this.positivityObj[h]
					console.log(positivityScore)
				}
			}
		}
        console.log("Total Score: " + positivityScore)
        return positivityScore
    }

    async crawl(msg, id) {
        var sum = 0
        var count = 0
        var toCheck = msg.guild.channels.cache.array()
        for (var i in toCheck) {
            if (toCheck[i] instanceof TextChannel) {
                console.log(`Looking at channel ${toCheck[i].name}`)
                var earliestMessage = null
                do {
                    let messages = await toCheck[i].messages.fetch((earliestMessage ? {limit: 100, before: earliestMessage.id} : {limit: 100}))
                    messages = messages.array()
                    console.log(messages.length)
                    if (messages.length < 100) {
                        break
                    }
                    for (var j in messages) {
                        if (!earliestMessage || messages[j].id < earliestMessage.id) {
                            earliestMessage = messages[j]
                        }
                        if (messages[j].author.id == id) {
                            console.log(messages[j].content)
                            count++
                            sum += this.analyze(messages[j].content)
                        }
                    }
                } while (earliestMessage)
            }
        }
        msg.channel.send(`This person's total positivity score was ${sum} with ${count} messages in this server`)
    }
}

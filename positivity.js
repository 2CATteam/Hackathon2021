const { TextChannel } = require('discord.js') //We compare to this later

module.exports = class PositivityTracker {
	constructor(data) {
		this.data = data //Set shared data
		this.positivityObj = this.data.rw.read("./AFINN.json") //Read in converted dataset
	}

	look(msg) { //Look at this message
        if (this.analyze(msg.content) < -20) { //If value of message is beneath our arbitrary threshold
            (async () => { //Holy crap this is hacky but hey this is a Hackathon
                var channel = msg.author.dmChannel //Get the DM channel or create one
                if (!channel) {
                    channel = await msg.author.createDM()
                }
                channel.send("Hey, your last message seemed a little negative. It's okay to be negative sometimes, but maybe take a moment to consider the good in life.") //Send a message reaching out
            })() //Imagine seeing this as a cave painting. You would assume the cavemen were idiots. And you'd be right.
        }
        if (this.analyze(msg.content) < -40) {
            for (var i in this.data.network[msg.author.id]) {
                (async (person, text, username) => { //Established needed data
                    var person = await this.data.bot.users.fetch(person) //Get person
                    var channel = person.dmChannel //Get the DM channel or create one
                    if (!channel) {
                        channel = await person.createDM()
                    }
                    channel.send(`Your friend, ${username}, sent a message which we judged to be incredibly negative. They said:
                    
${text}

If this is in fact negative, consider reaching out to the person to make sure everything's alright.`) //Send a message reaching out to this contact
                }).bind(this, i, msg.content, msg.author.username)() //Bind related data
            }
        }
        if (msg.content.match(/\/positivity <@!?(\d+)>/i)) { //Check for the crawl command
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
				//if the words match sum up the key values
				if(messageWord == h){
                    console.log(messageWord, this.positivityObj[h])
					positivityScore += this.positivityObj[h]
				}
			}
        }
        console.log("This message's positivity score is:", positivityScore)
        return positivityScore
    }

    async crawl(msg, id) { //Crawl a server looking for messages by a person
        var sum = 0
        var count = 0
        var toCheck = msg.guild.channels.cache.array() //Get all the channels in a guild
        for (var i in toCheck) { //For each channel
            if (toCheck[i] instanceof TextChannel) { //If it's a text channel...
                console.log(`Looking at channel ${toCheck[i].name}`) //Log it
                var earliestMessage = null //Stores the current earliest message
                do { //Do-while: Because Hackathons make it okay
                    let messages = await toCheck[i].messages.fetch((earliestMessage ? {limit: 100, before: earliestMessage.id} : {limit: 100})) //Ask for the next 100 messages (Or first 100 if this is the first time)
                    messages = messages.array() //Convert to array
                    console.log(messages.length)
                    if (messages.length == 0) { //End if we're at the end
                        break
                    }
                    for (var j in messages) { //For each message
                        if (!earliestMessage || messages[j].id < earliestMessage.id) { //Keep track of the earliest message
                            earliestMessage = messages[j]
                        }
                        if (messages[j].author.id == id) { //If it's by the right person...
                            count++ //Increment the counter
                            sum += this.analyze(messages[j].content) //Analyze the message and save the sum
                        }
                    }
                } while (earliestMessage) //Run while the earliest message exists
            }
        }
        msg.channel.send(`This person's total positivity score was ${sum} with ${count} messages in this server`) //Report results
    }
}

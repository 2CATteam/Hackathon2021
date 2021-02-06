module.exports = class messageChecker {
    constructor(data) {
        this.data = data
        this.data.messageData = this.data.rw.read("messageChecker.json")
        for (var i in this.data.messageData) { 
            this.data.messageData[i].lastMsgDate = new Date(this.data.messageData[i].lastMsgDate)
        }
        this.notifyInterval = setInterval(this.notify.bind(this), 10000)
    }

    look(message) {
        //Change all of this
        if (!(message.author.id in this.data.messageData)) { //checks if user has any data already has data
            this.data.messageData[message.author.id] = []    //adds new user
        }
        this.data.messageData[message.author.id] = { "lastMsgDate" : new Date() } //changes last message date to current date
        this.data.rw.write("./messageChecker.json", this.data.messageData)
    }


    notify() { //Send a DM to contacts when they haven't sent a message after a week
        for (var i in this.data.messageData) { //Loop through each user
            let difference = 0 //difference of date
            difference = (new Date()).getTime() - this.data.messageData[i].lastMsgDate.getTime()
            if (difference > 7 * 24 * 60 * 60 * 1000) { //If the difference is more than one week
                for (var j in this.data.network[i]) { //For each contact
                    if (!this.data.network[i][j].messages) { //If they haven't been contacted
                        this.data.network[i][j].messages = true //Contact them
                        this.data.bot.users.fetch(j).then(async (personId, usr) => {
                            var dms = usr.dmChannel
                            if (!dms) { //Create DM if necessary
                                dms = await usr.createDM()
                            }
                            var person = await this.data.bot.users.fetch(personId)
                            //Send message
                            dms.send(`Your friend, ${person.username}, has not sent a message in a week. It may be a good idea to go check on them.`)
                        }.bind(this, i))
                    }
                }
            } else { //Dipped under 40 hours, so reset stuff
                for (var j in this.data.network[i]) {
                    this.data.network[i][j].messages = false
                }
            }
        }
    }
}
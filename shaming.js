module.exports = class ActivityTracker {
    constructor(data) {
        this.data = data //Set stored data
        this.data.shamingData = this.data.rw.read("./shaming.json") //Get data off disk
        this.zones = this.data.rw.read("./timezones.json")
        this.dayMap = { //Maps the letters of the week to their position relative to Thursday
            "U": 3,
            "M": 4,
            "T": 5,
            "W": 6,
            "R": 0,
            "F": 1,
            "S": 2,
        }
        this.magicNumber = 7 * 24 * 60 * 60 * 1000 //Number of milliseconds in a week
    }

    read(msg) { //Read messages
        if (msg.content.match(/^\/class ((?:U|M|T|W|R|F|S)+) (\d{1,2}):(\d\d)-(\d{1,2}):(\d\d) (\w{3,4})/i)) { //Test
            var pattern = msg.content.match(/^\/class ((?:U|M|T|W|R|F|S)+) (\d{1,2}):(\d\d)-(\d{1,2}):(\d\d) (\w{3,4})/i) //Extract values
            if (!(pattern[6].toUpperCase() in this.zones)) { //If invalid time zone, die
                msg.channel.send("I do not recognize that timezone. Make sure to use its abbreviation, like 'CST' or 'PDT'")
                return
            }
            if (!this.data.shamingData[msg.author.id]) { //Initialize if necessary
                this.data.shamingData[msg.author.id] = []
            }
            for (var i = 0; i < pattern[1].length; i++) { //For each day add an entry
                this.data.shamingData[msg.author.id].push({ 
                    "start": ((((this.dayMap[pattern[1][i]] * 24 + parseInt(pattern[2]) - this.zones[pattern[6].toUpperCase()]) //The start time, converted to milliseconds since midnight Thursday
                        * 60 + parseInt(pattern[3])) * 60 * 1000) + this.magicNumber) % this.magicNumber,
                    "end": ((((this.dayMap[pattern[1][i]] * 24 + parseInt(pattern[4]) - this.zones[pattern[6].toUpperCase()]) //The end time, converted to milliseconds since midnight Thursday
                        * 60 + parseInt(pattern[5])) * 60 * 1000) + this.magicNumber) % this.magicNumber,
                    "channelID": msg.channel.id //Channel to send message in
                })
            }
            this.data.rw.write("shaming.json", this.data.shamingData) //Write to file
        } else if (msg.content.match(/^\/class drop/i)) { //Remove all my classes
            this.data.shamingData[msg.author.id] = []
            this.data.rw.write("shaming.json", this.data.shamingData)
        }
    }

    look(presence) { //Look at a user's presence when they're gaming
        var now = new Date().getTime() % this.magicNumber //Get the number of milliseconds since Thursday at midnight
        var playing = false //Check if playing a game, and if so, write which game
        var game = "nothing"
        for (var i in presence.activities) {
            if (presence.activities[i].type == "PLAYING") {
                playing = true
                game = presence.activities[i].name
                break
            }
        }
        if (!playing) { //Do nothing if they're not gaming
            return
        }
        for (var i in this.data.shamingData[presence.userID]) { //For each entry in this user's data
            if (this.data.shamingData[presence.userID][i].start < now && //If it's happening now
                this.data.shamingData[presence.userID][i].end > now) {
                
                this.data.bot.channels.fetch(this.data.shamingData[presence.userID][i].channelID).then(((id, game, chan) => { //Get the channel
                    chan.send(`<@${id}> is currently playing ${game} when they're supposed to be in class`) //Send the message
                }).bind(this, presence.userID, game))
            }
        }
    }
}
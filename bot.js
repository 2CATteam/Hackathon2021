const Discord = require("discord.js") //Discord library
var bot = new Discord.Client({ //Create a client which immediately fetches all members
    fetchAllMembers: true
})

const consts = require("./consts.json") //Get token (Done this way so we're not pushing any tokens)

var jsonReaderWriterFile = require("./jsonrw.js") //Reads and writes JSON files, so we can store information on disk without having to use a database
var jsonReaderWriter = new jsonReaderWriterFile()

var data = { //Shared data file
    bot: bot,
    network: jsonReaderWriter.read("./network.json"),
    rw: jsonReaderWriter
}

var activityFile = require("./activity.js") //Tracks gaming activity
var activity = new activityFile(data)
var positivityFile = require("./positivity.js") //Tracks overall positivity
var positivity = new positivityFile(data)
var messageFile = require("./messageChecker.js") //Tracks messages number
var messageChecker = new messageFile(data)
var signupFile = require("./signup.js") //Allows you to opt-in to being supported
var signup = new signupFile(data)

bot.on("ready", () => { //Lets us know when it's ready to go
    console.log("Hello, world!")
})

bot.on("message", (msg) => { //Message routing
    console.log(msg.content) //Log message to let us know we got it
    if (msg.content.match(/^\/play (\d+)/i)) { //Add fake gaming activity
        if (!data.activityData[msg.author.id]) { //Create if no record exists
            data.activityData[msg.author.id] = []
        }
        data.activityData[msg.author.id].push({
            start: new Date((new Date()).getTime() - (parseInt(msg.content.match(/^\/play (\d+)/i)[1]) * 60 * 60 * 1000) + 5000), //Start is the specified number of hours ago
            end: new Date(), //End is now
            game: "TEST GAME"
        })
        data.rw.write("activity.json", data.activityData) //Save file
    }
    if (msg.content.match(/^\/forget/i)) { //Clear all history of gaming
        data.activityData[msg.author.id] = []
        data.rw.write("activity.json", data.activityData) //Save file
    }
    if (msg.content.match(/^\/oldify (\d+)/i)) { //Manually set oldest comment
        data.messageData[msg.author.id] = {
            "lastMsgDate": new Date((new Date()).getTime() - (parseInt(msg.content.match(/^\/oldify (\d+)/i)[1])) * 24 * 60 * 60 * 1000) //Manually set last message date to n days ago
        }
        data.rw.write("messageChecker.json", data.messageData) //Save file
        return
    }
    positivity.look(msg) //Send messages to appropriate place
    messageChecker.look(msg)
    signup.look(msg)
})

bot.on("presenceUpdate", (old, current) => {
    console.log("Got update")
    activity.look(current) //Send presence information to activity tracker
})

bot.login(consts.token) //Start to log in
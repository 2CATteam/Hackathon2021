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
var shamingFile = require("./shaming.js") //Allows you to be encouraged to pay attention in class rather than gaming
var shaming = new shamingFile(data)

bot.on("ready", () => { //Lets us know when it's ready to go
    console.log("Hello, world!")
})

bot.on("message", (msg) => { //Message routing
    console.log(msg.content) //Log message to let us know we got it
    if (msg.author.id == "807665502011785246") { return } //Ignore own messages
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
    if (msg.content.match(/^\/help/i)) {
        msg.channel.send(`Harmony is virtual accountability system between discord users where you can sign-up by typing in the channel 
/support @user [hour limit for video games] [day limit for message]
/support user#0000 [hour limit for video games] [day limit for message]
/support <user.id> (if you have discord developer mode enabled) [hour limit for video games] [ day limit for message ]
This system will dm said person a message about the program where they can accept or decline your invitation to be accountability partners. This program can help each user in several ways. 
Using the first optional argument of the command (default value 40 hours), Harmony will keep track of how long each user plays games and if it goes over the designated weekly threshold it will inform the accountability partner that they are over the time. 
Using the second optional argument of the command (default value 7 days), Harmony will keep track of how long user has not sent a message, and in a certain number of days it will inform the other partner that they may need to check in on their friend.
In addition, Harmony observes each user’s message data and based off the type of words the user says it will report a positivity rating on their chats as well as send the sender notifications if a message is too aggressive. Harmony also has a command 
/positivity @user 
that will allow for Harmony to crawl through an entire text channel to see how positive a user has been.
Harmony also has a feature that tries to stop you from playing video games when you should be doing something else, like being in class. Use
/class [single letter day name (For example, M for monday, R for Thursday, U for Sunday)] [Time period in military time (For example 21:00-22:00)] [three letter time zone (For example CST)]`)
    }
    positivity.look(msg) //Send messages to appropriate place
    messageChecker.look(msg)
    signup.look(msg)
    shaming.read(msg)
})

bot.on("presenceUpdate", (old, current) => {
    console.log("Got update")
    activity.look(current) //Send presence information to activity tracker
    shaming.look(current)
})

bot.login(consts.token) //Start to log in
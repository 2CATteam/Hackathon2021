const Discord = require("discord.js")
var bot = new Discord.Client()

const consts = require("./consts.json")

var jsonReaderWriterFile = require("./jsonrw.js")
var jsonReaderWriter = new jsonReaderWriterFile()

var data = {
    bot: bot,
    network: jsonReaderWriter.read("./network.json"),
    rw: jsonReaderWriter
}

var activityFile = require("./activity.js")
var activity = new activityFile(data)
var positivityFile = require("./positivity.js")
var positivity = new positivityFile(data)
var messageFile = require("./messageChecker.js")
var messageChecker = new messageFile(data)
var signupFile = require("./signup.js")
var signup = new signupFile(data)

bot.on("ready", () => {
    console.log("Hello, world!")
})

bot.on("message", (msg) => {
    if (msg.content.match(/^\/play/i)) {
        data.activityData[msg.author.id] = [{
            start: new Date((new Date()).getTime() - (40 * 60 * 60 * 1000) + 5000),
            end: new Date(),
            game: "TEST GAME"
        }]
        data.rw.write("activity.json", data.activityData)
    }
    if (msg.content.match(/^\/forget/i)) {
        data.activityData[msg.author.id] = []
        data.rw.write("activity.json", data.activityData)
    }
    if (msg.content.match(/^\/oldify/i)) {
        data.messageData[msg.author.id] = { "lastMsgDate": new Date((new Date()).getTime() - 7 * 24 * 60 * 60 * 1000) }
        data.rw.write("messageChecker.json", data.messageData)
        return
    }
    positivity.look(msg)
    messageChecker.look(msg)
    signup.look(msg)
})

bot.on("presenceUpdate", (old, current) => {
    console.log("Got update")
    activity.look(current)
})

bot.login(consts.token)
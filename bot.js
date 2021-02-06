const Discord = require("discord.js")
var bot = new Discord.Client()

const consts = require("./consts.json")

var jsonReaderWriterFile = require("./jsonrw.js")
var jsonReaderWriter = new jsonReaderWriterFile()

var data = {
    bot: bot,
    rw: jsonReaderWriter
}

var activityFile = require("./activity.js")
var activity = new activityFile(data)
var positivityFile = require("./positivity.js")
var positivity = new positivityFile(data)

bot.on("ready", () => {
    console.log("Hello, world!")
})

bot.on("message", (msg) => {
    console.log(msg.content)
    positivity.look(msg)
})

bot.on("presenceUpdate", (old, current) => {
    console.log("Got update")
    activity.look(current)
})

bot.login(consts.token)
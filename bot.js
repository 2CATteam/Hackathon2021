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

bot.on("ready", () => {
    console.log("Hello, world!")
})

bot.on("message", (msg) => {
    console.log(msg.content)
    if (msg.content.match(/^\/play/i)) {
        data.activityData[msg.author.id] = [{
            start: new Date() - (40 * 60 * 60 * 1000) + 5000,
            end: new Date(),
            game: "TEST GAME"
        }]
        data.rw.write("activity.json", this.data.activityData)
    }
    if (msg.content.match(/^\/forget/i)) {
        data.activityData[msg.author.id] = []
        data.rw.write("activity.json", this.data.activityData)
    }
    positivity.look(msg)
})

bot.on("presenceUpdate", (old, current) => {
    console.log("Got update")
    activity.look(current)
})

bot.login(consts.token)
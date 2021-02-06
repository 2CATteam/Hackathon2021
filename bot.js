const Discord = require("discord.js")
var bot = new Discord.Client()

const consts = require("./consts.json")

var data = {
    bot: bot
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
    positivityFile.look(msg)
})

bot.on("presenceUpdate", (old, current) => {
    console.log("Got update")
    activity.look(current)
})

bot.login(consts.token)
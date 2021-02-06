const Discord = require("discord.js")
var bot = new Discord.Client()

const consts = require("./consts.json")

var data = {
    bot: bot
}

var activityFile = require("./activity.js")
var activity = new activityFile()

bot.on("ready", () => {
    console.log("Hello, world!")
})

bot.on("message", (msg) => {
    console.log(msg.content)
})

bot.on("presenceUpdate", (old, current) => {
    console.log("Got update")
    activity.look(current)
})

bot.login(consts.token)
const Discord = require("discord.js")
var bot = new Discord.Client()

const consts = require("./consts.json")

bot.on("ready", () => {
    console.log("Hello, world!")
})

bot.on("message", (msg) => {
    console.log(msg.content)
})

bot.on("presenceUpdate", (old, current) => {
    console.log(current.activities)
})

bot.login(consts.token)
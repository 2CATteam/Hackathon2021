module.exports = class ActivityTracker {
    constructor(data) {
        this.data = data
        this.data.activityData = {}
        this.chopInterval = setInterval(this.chop, 10000)
        this.notifyInterval = setInterval(this.notify, 10000)
    }

    look(presence) {
        console.log(presence.activities)
        if (!(presence.userID in this.data.activityData)) { //checks if user has any data already has data
            this.data.activityData[presence.userID] = []    //adds new user
        }
        for(var i = 0; i < this.data.activityData[presence.userID].length; i++){    //adds end date whenever new presence is updated
            if (!("end" in this.data.activityData[presence.userID][i])) {
                this.data.activityData[presence.userID][i].push({ "end": new Date()})
            }
        }
        for(var i = 0; i < presence.activities.length; i++)                         //adds start date and game whenever it detects a playing or streaming presence 
        {
            if(presence.activities[i].type == "PLAYING" || presence.activities[i].type == "STREAMING"){
                this.data.activityData[presence.userID].push({ "start": new Date(), "game": presence.activities[i].name })
            }
        }

    }

    chop() {
        var now = new Date()
        for (var i in this.data.activityData) {
            for (var j = 0; j < this.data.activityData[i].length; j++) {
                if (this.data.activityData[i][j].start < now) {
                    this.data.activityData[i][j].start = now
                    if (this.data.activityData[i][j].start > this.data.activityData[i][j].end) {
                        this.data.activityData[i].splice(j, 1)
                        j--
                    }
                }
            }
        }
    }

    notify() {
        for (var i in this.data.activityData) {
            let sum = 0
            for (var j in this.data.activityData[i]) {
                sum += (this.data.activityData[i][j].end ? this.data.activityData[i][j].end : new Date()) - this.data.activityData[i][j].start
            }
            if (sum > 144000000) {
                for (var j in this.data.network[i]) {
                    if (!this.data.network[i][j]) {
                        this.data.network[i][j] = true
                        this.data.bot.users.fetch(j).then(async (usr) => {
                            var dms = usr.dmChannel
                            if (!dms) {
                                dms = await usr.createDM()
                            }
                            var person = await this.data.bot.users.fetch(i)
                            dms.send(`Your friend, ${person.username}, has played more than ${Math.floor(sum / 1000 / 60 / 60)} hours of video games this week. They're probably not even that good at them.`)
                        })
                    }
                }
            } else {
                for (var j in this.data.network[i]) {
                    this.data.network[i][j] = false
                }
            }
        }
    }
}
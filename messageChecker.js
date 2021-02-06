module.exports = class messageChecker {
    constructor(data) {
        this.data = data
        this.data.activityData = this.data.rw.read("activity.json")
        for (var i in this.data.activityData) {
            for (var j in this.data.activityData[i]) {
                this.data.activityData[i][j].start = new Date(this.data.activityData[i][j].start)
                this.data.activityData[i][j].end = new Date(this.data.activityData[i][j].end)
            }
        }
        this.chopInterval = setInterval(this.chop.bind(this), 10000)
        this.notifyInterval = setInterval(this.notify.bind(this), 10000)
    }

    look(presence) {
        //Change all of this
        if (!(presence.userID in this.data.activityData)) { //checks if user has any data already has data
            this.data.activityData[presence.userID] = []    //adds new user
        }
        for(var i = 0; i < this.data.activityData[presence.userID].length; i++){    //adds end date whenever new presence is updated
            if (!("end" in this.data.activityData[presence.userID][i])) {
                this.data.activityData[presence.userID][i].end = new Date()
            }
        }
        for(var i = 0; i < presence.activities.length; i++)                         //adds start date and game whenever it detects a playing or streaming presence 
        {
            if(presence.activities[i].type == "PLAYING" || presence.activities[i].type == "STREAMING"){
                this.data.activityData[presence.userID].push({ "start": new Date(), "game": presence.activities[i].name })
            }
        }
        this.data.rw.write("activity.json", this.data.activityData)
    }

    chop() { //Function to remove data from more than a week ago
        var now = new Date() //Create date for now
        now = now.getTime() - 7 * 24 * 60 * 60 * 1000 //Subtract a week
        for (var i in this.data.activityData) {  //Loop through all users
            for (var j = 0; j < this.data.activityData[i].length; j++) { //Loop through each user's data
                if (this.data.activityData[i][j].start < now) { //If the start is more than a week go
                    this.data.activityData[i][j].start = now //Set the start to a week ago
                    if (!this.data.activityData[i][j].end) { //If the activity is ongoing, go to next iteration
                        continue
                    }
                    if (this.data.activityData[i][j].start > this.data.activityData[i][j].end) { //If the start has passed the end
                        this.data.activityData[i].splice(j, 1) //Remove this element from the array
                        j--
                    }
                }
            }
        }
    }

    notify() { //Send a DM to contacts when they've played more than 40 hours of games
        for (var i in this.data.activityData) { //Loop through each user
            let sum = 0 //Accumulator
            for (var j in this.data.activityData[i]) { //Sum up how long each gaming session has lasted
                sum += (this.data.activityData[i][j].end ? this.data.activityData[i][j].end.getTime() : (new Date()).getTime()) - this.data.activityData[i][j].start.getTime()
            }
            if (sum > 144000000) { //If sum is more than 40 hours
                for (var j in this.data.network[i]) { //For each contact
                    if (!this.data.network[i][j]) { //If they haven't been contacted
                        this.data.network[i][j] = true //Contact them
                        this.data.bot.users.fetch(j).then(async (usr) => {
                            var dms = usr.dmChannel
                            if (!dms) { //Create DM if necessary
                                dms = await usr.createDM()
                            }
                            var person = await this.data.bot.users.fetch(i)
                            //Send message
                            dms.send(`Your friend, ${person.username}, has played more than ${Math.floor(sum / 1000 / 60 / 60)} hours of video games this week. They're probably not even that good at them.`)
                        })
                    }
                }
            } else { //Dipped under 40 hours, so reset stuff
                for (var j in this.data.network[i]) {
                    this.data.network[i][j] = false
                }
            }
        }
    }
}
module.exports = class ActivityTracker {
    constructor(data) {
        this.data = data
        this.data.activityData = {}
        this.interval = setInterval(this.chop, 10000)
    }

    look(presence) {
        console.log(presence.activities)
        if (!(presence.userID in this.data.activityData)) {
            this.data.activityData[presence.userID] = []
        for(var i = 0; i < presence.activities.length; i++)
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
}
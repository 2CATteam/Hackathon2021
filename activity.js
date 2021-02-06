module.exports = class ActivityTracker {
    constructor(data) {
        this.data = data
        this.data.activityData = {}
    }

    look(presence) {
        console.log(presence.activities)
        if (!(presence.userID in this.data.activityData)) {
            this.data.activityData[presence.userID] = {}
        }
        for(var i = 0; i < presence.activities.length - 1; i++)
        {
            if(presence.activities[i].type == "PLAYING" || presence.activities[i].type == "STREAMING"){
                this.data.activityData[presence.userID].push({ "start": new Date(), "game": presence.activities[i].name })
            }
        }

    }
}
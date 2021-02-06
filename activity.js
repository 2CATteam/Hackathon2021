module.exports = class ActivityTracker {
    constructor(data) {
        this.data = data
        this.data.activityData = {}
        this.interval = setInterval(this.chop, 10000)
    }

    look(presence) {
        console.log(presence.activities)
        if (presence.userID in this.data.activityData) {

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
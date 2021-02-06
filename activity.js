module.exports = class ActivityTracker {
    constructor(data) {
        this.data = data
        this.data.activityData = {}
    }

    look(presence) {
        console.log(presence.activities)
        if (presence.userID in this.data.activityData) {

        }
    }
}
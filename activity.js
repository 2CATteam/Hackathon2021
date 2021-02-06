module.exports = class ActivityTracker {
    constructor(data) {
        this.data = data
    }

    look(presence) {
        console.log(presence.activities)
    }
}
module.exports = class ActivityTracker {
    constructor(data) {
        this.data = data
    }

    look(msg) {
        console.log(msg.content)
    }
}
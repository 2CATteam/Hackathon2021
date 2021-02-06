var fs = require("fs")
module.exports = class jsonReaderWriter {
    constructor() {

    }

    read(filename) {
        var text = fs.readFileSync(filename)
        return JSON.parse(text)
    }

    write(filename, obj) {
        fs.writeFileSync(filename, JSON.stringify(obj, null, "\t"), 'utf8')
    }
}
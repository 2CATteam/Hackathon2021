var fs = require("fs") //File system lib
module.exports = class jsonReaderWriter {
    constructor() {
        //Who needs it?
    }

    read(filename) { //Read and parse a JSON file
        var text = fs.readFileSync(filename)
        return JSON.parse(text)
    }

    write(filename, obj) { //Write a JSON file
        fs.writeFileSync(filename, JSON.stringify(obj, null, "\t"), 'utf8')
    }
}
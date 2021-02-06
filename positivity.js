var fs = require('fs')

module.exports = class PositivityTracker {
	constructor(data) {
		this.data = data
		this.positivityObj = JSON.parse(fs.readFileSync("./AFINN.json"))
	}

	look(msg) {
		//save message as a string and look through array to calculate positivity score
		var messageArr = msg.content.toLowerCase().split(" ")
		var positivityScore = 0;

		//loop through the array that holds the message
		for(var j = 0; j < messageArr.length; ++j){
			var messageWord = messageArr[j].replace(/[^a-zA-Z]/ig, "")

			//loop through array that hold positivity scores and see if the keys match the message word
			for(var h in this.positivityObj){
				//if the words match sum up the  key values
				if(messageWord == h){
					positivityScore += this.positivityObj[h]
					console.log(positivityScore)
				}
			}
		}
		console.log("Total Score: " + positivityScore)
	}
}

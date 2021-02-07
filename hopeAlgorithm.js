//making file into a raw array
//Text file set up has word or words with positivity value on the same line 'word(s) -#
var fs = require("fs")
var rawText = fs.readFileSync("./dataset.txt", "utf-8")
var newLineText = rawText.split("\n")

//array to store possitivity scores
var positivityObj = {}

//Making an array with key and values
//Need to split the string in array location either before a - or a number
for(var i = 0; i < newLineText.length; ++i){
	var splitValue = newLineText[i].match(/^(.+)\s(-?\d+$)/i)

	//Store the array values in splitValue to positivityObj
	if (newLineText[i] == "") {
		continue
	}
	var keyWord = splitValue[1]
	if(keyWord.includes("-")){
		keyWord = keyWord.replace("-", "")
	}
	var valueNumber = parseInt(splitValue[2])
	positivityObj[keyWord] = valueNumber
}

fs.writeFileSync("./AFINN.json", JSON.stringify(positivityObj, null, "\t"), 'utf8') 


//save message as a string and look through array to calculate positivity score
var message = "hope is a wICked person" // msg.content
var messageArr = message.toLowerCase().split(" ")
var positivityScore = 0;

//loop through the array that holds the message 
for(var j = 0; j < messageArr.length; ++j){
	var messageWord = messageArr[j]

	//loop through array that hold positivity scores and see if the keys match the message word
	for(var h in positivityObj){
		//if the words match sum up the  key values
		if(messageWord == h){
			positivityScore += positivityObj[h]
			console.log(positivityScore)
		}
	}
}




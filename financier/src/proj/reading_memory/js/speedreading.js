
//SpeedReader class


//if toggle_start_on, then enables start button and disables pause button.
//opposite effect happens otherwise.
SpeedReader.prototype.toggleStartOn = function(toggle_start_on){

	var disabledButtonId = toggle_start_on ? 'stopButton' : 'startButton';
	var enabledButtonId = toggle_start_on ? 'startButton': 'stopButton';

	document.getElementById(disabledButtonId).setAttribute('disabled', 'disabled');
	//enable stop button
	document.getElementById(enabledButtonId).removeAttribute('disabled');
}

SpeedReader.prototype.initializeOptions = function(){
	//Set up options for wordChunks
	var wordChunkOptions = "";
	for (ind = 1; ind < 7; ind++){
		wordChunkOptions += "<option>" + ind + "</option>";
	} 
	$('#wordChunks').html(wordChunkOptions);
	$('#wordChunks').val(3);

	//Now set up the words per minute
	var wordsPerMinuteOptions = "";
	for (ind = 1; ind < 8; ind++){
		wordsPerMinuteOptions += "<option>" + ind*100 + "</option>";
	}
	$('#wordsPerMinute').html(wordsPerMinuteOptions);
	$('#wordsPerMinute').val(300); 
}

SpeedReader.prototype.initializeEventHandlers = function(){

	// Options handlers
	$('#wordChunks').click(function(){
			reader.stopShowing();
			});
	$('#wordsPerMinute').click(function(){
			reader.stopShowing();
			});

	// Start pause handlers
	$('#startButton').click(function(){
			speedRead();
			});
	$('#stopButton').click(function(){
			reader.stopShowing();
			});
}

//Now that we know there is text in the box, let's start
//speed reading!
SpeedReader.prototype.speedReadWordsInBox = function(){
	this.updateWordArray();
	// Update if there were any changes to the options
	this.updateOptions();
	//Display each element in that array
	// one at a time based on a timer
	this.displayWords();
}

//Populates the array of words from the article
SpeedReader.prototype.updateWordArray = function(){
	// Get the words from the text area, and parse into an array
	var words = document.getElementById("textEntry").value; 

	// Really janky way to get rid of newlines, probably a better way
	var pattern = "\n";
	var re = new RegExp(pattern, "g"); //to remove all instances
	words = words.replace(re, " ");
	this.wordArr = words.split(" ");

	// Update the section of the page with how many words are in th article
	updateNumWordsInPassage(this.wordArr.length);
}

//Loops through the words and displays them in a div
SpeedReader.prototype.displayWords = function(){
	if (this.isDisplayingWords == false){
		this.stopTimedEvent = window.setInterval("reader.showWord()", 
				this.intervalShowWords());
		this.isDisplayingWords = true;
		this.toggleStartOn(false);
	} 
	else{
	}
}

//private functions

//Displays a word in the div
SpeedReader.prototype.showWord = function(){
	var numWords = this.getWordChunks();

	if (this.wordIndex + numWords < this.wordArr.length-1) {
		var endInd = this.wordIndex + numWords; 
		this.updateDisplayedWords(this.wordIndex, endInd);
		this.wordIndex = endInd; //update index's position
	} else{
		//Show end of article if not at the very end already
		if (this.wordIndex != this.wordArr.length -1) {
			this.updateDisplayedWords(this.wordIndex, this.wordArr.length);
		}

		//reset stupid global variables i shouldn't be using
		this.stopShowing();
		this.updateHowLongToReadPassage(); 
		//"destructor" for object
		this.wordArr = [];
		this.wordIndex = -1;
	}
}

SpeedReader.prototype.updateDisplayedWords = function(startInd, endInd){
	//Show words 
	wordsToShow = this.wordArr.slice(startInd, endInd).join(" "); 
	//Get to next index
	this.wordIndex = endInd;
	var rArea = document.getElementById("readingArea");
	rArea.innerHTML = "<b>" + wordsToShow + "</b>";
}

//Stop showing the words in the speed reader
SpeedReader.prototype.stopShowing = function(){
	window.clearInterval(this.stopTimedEvent);
	this.isDisplayingWords = false;
	this.toggleStartOn(true);
}

//Updates where the number of words in the passage is
updateNumWordsInPassage = function(numWords){
	var updateArea = document.getElementById("updateArea");
	updateArea.innerHTML = ("Word count: " + numWords); 
}

//Update how long it took you to read
SpeedReader.prototype.updateHowLongToReadPassage = function(){
	var updateArea = document.getElementById("updateArea");
	var numWords = this.wordArr.length;
	var numSeconds = Math.round(numWords * 60.0 / this.getWordsPerMinute());

	// Put it in terms of minutes
	var updateStr = "";
	if (numSeconds > 59) {
		var numMins = Math.floor(numSeconds / 60);
		var leftOverSecs = numSeconds - (numMins  * 60);
		updateStr = " in " + numMins + " minutes and " + leftOverSecs + " seconds!!";
	} else{
		updateStr = " in " + numSeconds + " seconds!!";
	}
	updateArea.innerHTML = "You read " + this.getNumWords() + " words" + updateStr;
	//updateArea.innerHTML = updateArea.innerHTML + updateStr;
}

//Calculates how often to show the words based on
//words per minute selected, and word chunks.
//@return in microseconds how often to show words
SpeedReader.prototype.intervalShowWords = function(){
	// words per minute
	var wpm = this.getWordsPerMinute(); 
	// num word chunks
	var numWords = this.getWordChunks();

	// 600 wpm. 100 wpsecond. divide by numWords. Frames/second.
	var seconds = numWords / (wpm / 60.0);

	return Math.round(seconds * 1000);   
}

SpeedReader.prototype.updateOptions = function(){
	this.wpm = parseInt(document.getElementById("wordsPerMinute").value);
	this.wordChunks = parseInt(document.getElementById("wordChunks").value);
}

SpeedReader.prototype.getWordsPerMinute = function(){
	return this.wpm;
}

SpeedReader.prototype.getWordChunks = function(){
	return this.wordChunks;
}

SpeedReader.prototype.getNumWords = function(){
	return this.wordArr.length;
}

function SpeedReader() {
	this.wordArr = [];
	this.wordIndex = 0;
	this.stopTimedEvent = 0; //Timed event handle index thing
	this.wpm = -1; //How many words per minute to read
	this.wordChunks = -1; //How many word chunks to read at a time
	this.isDisplayingWords = false; //We need a lock so the user can't press start
	//reading over and over.

	this.initializeOptions();
	//initialize event handlers for the elements that compose this reader.
	this.initializeEventHandlers();
}

//Get article content
function ContentParser(){
	this.source = "";
	this.topic = "";
	this.words = "";
}


//
getVariableInQuery = function(variable, query){
	if (variable == 'speedReadUrl'){
		//find occurence of [
		var url = query.substring(query.indexOf('[')+1, query.indexOf(']'));
		//find occurence of ]
		console.log(url);
		return url;
	} else{
		var vars = query.split("&"); 
		for (var i=0;i<vars.length;i++) { 
			var pair = vars[i].split("="); 
			if (pair[0] == variable) { 
				return pair[1]; 
			} 
		}
	}
}

//global functions
// gets a query variable
getQueryVariable = function(variable){
	var query = window.location.search.substring(1);
	return getVariableInQuery(variable, query);
}

//When the chrome extension or someone specifies a url in the params parse it
parseSpeedReadUrl = function(speedReadUrlParamName){
	var speedReadUrl = getQueryVariable(speedReadUrlParamName);
	if (speedReadUrl.indexOf('http://www.google.com') == 0){
		console.log(speedReadUrl);
	var queryStr = speedReadUrl.split('?')[1];
	console.log(queryStr);
	var url = getVariableInQuery('url', queryStr);
	console.log('starts with google, url: ' + url);
	return url;
}
return getQueryVariable(speedReadUrlParamName);
}

$(document).ready(function(){
		// The current reader object being used to "speed read"
		reader = new SpeedReader;
		// To parse the website
		contentParser = new ContentParser;

		// if there is a url provided then parse it and then call speed reading
		var speedReadUrl = parseSpeedReadUrl('speedReadUrl');
		if(speedReadUrl.length != 0){
		contentParser.setArticleSource(speedReadUrl);
		speedRead();
		};
		});



// Called from the start button
// potentially a global method who knows
speedRead = function(){

	//contentParser.showArticleExtractor();
	if (contentParser.getArticleSource().length != 0) {
		contentParser.getArticleContent();
	}

	else {
		reader.speedReadWordsInBox();
	}
}

// Response from YQL server about the diffbot response. Has funky rendering so we need to parse out the title
// and content.
Parser = function(p) {
  this.p = p;
};

Parser.prototype.content = function() {
  return this.p.substring(this.p.indexOf('"text"') + 8, this.p.indexOf('"html"') - 2)
};

Parser.prototype.title = function() {
  return this.p.substring(this.p.indexOf('"title"') + 9, this.p.indexOf('"text"') - 2)
};

//TODO: save what topics the user has read about

//TODO: save a history of the user's speed and word chunks
// readingSession:int -> curTime:datetime, wpm:int, wordChunks:int, topic:String

//TODO: graph the user's words per minute / time.
//TODO: graphs the user's word chunks / time.

//TODO: automatically find the topic of the article
//TODO: form validation, is it a valid url?

// I want to use this website: http://jimplush.com/blog/goose
// I want his functionality without having to actually implement it. \
// Does Instapaper have an API for that?
// This could be useful as well? https://github.com/mdorn/proose

// This has a python API: http://code.google.com/p/justext/
ContentParser.prototype.getArticleContent = function(){

	//build up diffbot URL to extract text from article
	var diffbotBaseUrl = "http://www.diffbot.com/api/article?token=da0379e09fa32d14ba29d4b9f92b8acc&url=";

	//get url requested, TODO: encodeURI
	diffbotBaseUrl += this.getArticleSource();
	console.log("Article source: " + this.getArticleSource());
	console.log("Encoded source: " + encodeURI(this.getArticleSource()));
	//clear the article source
	this.clearArticleSource();

	YUI().use('gallery-yql', 'node', function(Y) {
			var yql_query = 'select * from html where url = "' + diffbotBaseUrl + '"';
			console.log('yql_query: ' + yql_query);

			var yql_obj = new Y.yql(yql_query);
			yql_obj.on('query', function(response) {
				if (response.results){
                                var p = response.results.body.p;
                                var pars = new Parser(p);
                                var title = pars.title();  // TODO: Display title in another element.
                                var content = pars.content(); 
				console.log('Results p: ' + p);

				//text, author, title, icon, media 
				document.getElementById('articleTitle').innerHTML = title;
				document.getElementById('textEntry').value = content;

				//now call the parser to start speed reading and do its magic
				reader.speedReadWordsInBox();
				}
				else {
				alert("Your link does not have article data, please try again");
				}
				});

	}); 
}

ContentParser.prototype.setArticleSource = function(source){
	document.getElementById('articleWebsiteAddress').value = source;
}
ContentParser.prototype.getArticleSource = function(){
	return document.getElementById('articleWebsiteAddress').value;
}

ContentParser.prototype.clearArticleSource = function(){
	document.getElementById('articleWebsiteAddress').value = "";
}



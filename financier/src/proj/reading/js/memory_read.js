

var Snippets = function() {
	this.snippets = [
	  'James Mountain "Jim" Inhofe (/ˈɪnhɒf/; born November 17, 1934) is the senior United States senator from Oklahoma and a member of the Republican Party. First elected to the Senate in 1994, he is the ranking member of the United States Senate Committee on Environment and Public Works and was its chairman from 2003 to 2007. Inhofe served eight years as the United States representative for Oklahomas 1st congressional district before his election to the Senate in 1994 and also previously served as both an Oklahoma state representative and senator.'
	];
	this.i = 0;
};

Snippets.prototype.next = function() {
  var snip = this.snippets[this.i];
  this.i++;
  return snip;
};

Snippets.prototype.nextRandom = function() {
  var phone = function() {
  	var digits = 10;
  	var ans = '';
  	for (var i = 0; i < digits; i++) {
      var num = Math.floor(Math.random() * 10);
      ans += num;
      if (i == 2 || i == 5) { ans += '-';}
    }
    return ans;
  };

  var names = {
  	'Jim': true,
  	'Sally': true,
  	'Suzie': true
  }
 
  var text = '';
  for (name in names) {
  	text += ' ' + name + ' can be reached at ' + phone() + ' .';
  }
  return text;
};

var Ctrl = function(){
	this.snippets = new Snippets();
	this.textView = $('#mainText');
	// Make into one object.
	this.curText = ''; // Current text being quizzed.
	this.curQuizInd = 0; // Which quiz are we on.
	// How to configure the quiz.
	this.config = {
	  regexVal: 0
	};
	this.answerView = $('#answerText');

	// Time me quizzes.
	this.timeQ = new TimeQ(this.textView, this.answerView);
  // Name the book title quizzes.
  this.bookQ = new BookQ(this.textView, this.answerView);
};

// Creates a quiz out of this text block.
// text - string - all the text in the quiz.
// regexVal - number - which regex to choose.
Ctrl.prototype.createBlankOutText = function(text, regexVal) {

  var getRegex = function(whichOne) {
    var indToRegex = {
      0: /[0-9]+/g, // numbers.
      1: /"*"$/g, // things in quotes.
      2: /[A-Z][a-z]+$/g, // capital words.
    };
    return indToRegex[whichOne];
  };

  // Creates an interactive blank line.
  var blankLine = function(token) {

    // Make it interactive.
    // line - jQuery
    var lineify = function(line) {
      line.click(function(e) {
      	var el = $(e.currentTarget);
      	el.unbind('click');
      	// Write answer to node when user chooses something.
      	var input = $('<input class="myAnswer"></input> ');
      	input.focusout(function(e) {
      		var el = $(e.currentTarget);
      		el.attr('myAns', el.val());
      	});

      	var text = el.attr('ans');
      	input.css('width', (text.length * 9) + 'px');
      	el.html(input);
      	input.focus();
      });
    };

    var text = '';
    for (var i = 0; i < token.length; i++) {
    	text += '_';
    }
    text += ' ';
    var line = $('<span class="answerMe"></span>');
    line.attr('ans', token);
    line.append(text);
    lineify(line);
    return line;
  };

  var tokens = text.split(' ');
  var el = $('<div></div>');
  var regex = getRegex(regexVal);
  tokens.forEach(function(token) {
    var match = regex.exec(token);
    if (match) {
      el.append(blankLine(token));
    } else {
      el.append(token + ' ');
    }
  });

  return el;
}

// Grades the quiz based on the user's answers.
Ctrl.prototype.gradeQuiz = function() {
  // For each answer compare their answer to the correct one.
  var all = 0;
  var right = 0;
  var correctionsEl = $('<div></div>');
  $('.answerMe').each(function(index, answerNode) {
  	all += 1; // Number of questions.
  	var el = $(answerNode);
  	var yourAnsEl = el.find('.myAnswer')[0];
  	if (!yourAnsEl) {
  		return;
  	}
  	var mine = $(yourAnsEl).attr('myAns');
  	var correct = el.attr('ans');
    if (correct == mine) {
    	right += 1;
    } else {
      var correctionEl = $('<div></div>');
      correctionEl.append('<span style="color:red;">' + mine + '</span>');
      correctionEl.append('<span style="color:grey;"> should be </span>');
      correctionEl.append('<span style="color:green;">' + correct + '</span>');
      correctionsEl.append(correctionEl);
    }
  	//window.console.log(correct + ' ' + mine);
  });

  var ansEl = $('<h4></h4>');
  ansEl.append('You got ' + right + ' / ' + all + ' correct.');
  ansEl.append(correctionsEl);
  this.textView.append(ansEl);
};

// Renders the blanks for the quiz.
Ctrl.prototype.showQuizText = function() {
  this.textView.empty();
  this.textView.append('<h3>Fill in the blanks</h3>');

  var answerDiv = $('<div></div>');
  answerDiv.append(this.createBlankOutText(this.curText, this.config.regexVal));
  this.textView.append(answerDiv);

  var submitBtn = $('<button>Submit</button>');
  submitBtn.click(function(e) {
    this.gradeQuiz();
  }.bind(this));
  this.textView.append(submitBtn);
  var nextBtn = $('<button>Next</button>');
  nextBtn.click(function(e) {
    this.nextQuiz();
  }.bind(this));
  this.textView.append(nextBtn);
};

// Have to fill in the blank, either from text or for phone numbers.
Ctrl.prototype.fillInTheBlankQuiz = function() {
  // This is for filling in the blanks.
  this.config.regexVal = 0; this.curQuizInd % 3;
  if (this.curQuizInd % 3 == 0) {
    this.curText = this.snippets.nextRandom();
  }

  var answerSec = 10;
  this.textView.empty();
  this.textView.append('<h3>Read for ' + answerSec + ' seconds!</h3>');
  this.textView.append('<div>' + this.curText + '</div>');
  window.setTimeout(this.showQuizText.bind(this), answerSec * 1000);
  // Increment which quiz we have.
  this.curQuizInd += 1;
};

TimeQ = function(textView, answerView) {
  this.textView = textView;
  this.answerView = answerView;
};

TimeQ.prototype.nextQuiz = function() {
  var btn = $('<button>Starting in 3</button>');
  
  startCountdown = function() {
    this.textView.empty();
    var numSec = Math.floor(Math.random() * 10) + 1;
    this.textView.append('Click stop in ' + numSec + ' seconds.');
    var startDate = new Date();
    var stopBtn = $('<div><button>Stop!</button></div>');
    this.textView.append(stopBtn);

    stopBtn.click(function() {
      var now = new Date();
      var seconds = (now - startDate)/1000;
      var answerDiv = $('<div>You answered in ' + seconds + ' seconds</div>');
      var diff = numSec - seconds;
      var pct = (Math.abs(numSec - seconds)/numSec) * 100;
      var overUnder = seconds - numSec > 0 ? 'over' : 'under';
      answerDiv.append('<div>Only '+ diff.toFixed(2) +' seconds off, or ' + pct.toFixed(0) + '% ' + overUnder + '.</div>');
      this.answerView.append(answerDiv);
    }.bind(this));
  }.bind(this);

  var cancelMe = null;
  var times = 3;
  cancelMe = window.setInterval(function() {
  	btn.text('Starting in ' + (times-1));
  	times -= 1;
    if (times == 0) {
    	clearInterval(cancelMe);
    	startCountdown();
    }
  }, 1000);

  this.textView.append(btn);
};

BookQ = function(textView, answerView) {
  this.textView = textView;
  this.answerView = answerView;

  // books: Object from isbndb database.
  // bookInd: which book we are on, max we can have is 10.
  // topic: what type of books to be quizzed on.
  this.state = {
    books: null,
    bookInd: 1
  };
};

// Get the first couple of books.
BookQ.prototype.initiate = function(topic) {
  callback = function(data) {
    window.console.log('Success pull titles.');
    window.console.log(data);
    this.state['books'] = data;
  }.bind(this);
  FetchJSON('http://isbndb.com/api/v2/json/I751R8PX/books?q=' + topic, callback);
};


BookQ.prototype.gradeQuiz = function() {
  var numWrong = 0;
  $('.quizQ').each(function(index, node) {
    var el = $(node);
    var myAnswer = el.val();
    var correctAnswer = el.attr('answer');
    var q = el.attr('question');

    var corr = function(text) {
      return '<span style="color:green;">' + text + '</span>';
    };

    var incorr = function(text) {
      return '<span style="color:red;">' + text + '</span>';
    };

    if (myAnswer != correctAnswer) {
      this.answerView.append('<div>' + q + ' was supposed to be ' + corr(correctAnswer) + 
        ' not ' + incorr(myAnswer) + '</div>');
      numWrong += 1;
    }
  }.bind(this));

  if (numWrong == 0) {
    this.answerView.append('You got everything right!');
  }

  
  var tryAgainBtn = $('<button>Next one!</button>');
  tryAgainBtn.click(function() {
    this.nextQuiz();
  }.bind(this));
  var container = $('<div></div>');
  container.append(tryAgainBtn);
  this.answerView.append(container);
};

BookQ.prototype.askQuestion = function() {
  this.textView.find('img').css('visibility', 'hidden');
  var table = $('<table></table>');

  addQ = function(els) {
    var tr = $('<tr></tr>');
    els.forEach(function(el) {
      var td = $('<td></td>');
      td.append(el);
      tr.append(td);
    });
    table.append(tr);
  }

  var bookObj = this.getBookObj();
  var titleQ = $('<input class="quizQ"></input>');
  titleQ.attr('answer', bookObj.title);
  titleQ.attr('question', 'Title');
  addQ(['Title: ', titleQ]);
  var authorQ = $('<input class="quizQ"></input>');
  authorQ.attr('answer', bookObj.author_data[0].name);
  authorQ.attr('question', 'Author');
  addQ(['Author: ', authorQ]);
  this.answerView.append(table);

  var submitBtn = $('<button>Submit</button>');
  submitBtn.click(function() {
    this.gradeQuiz();
  }.bind(this));
  this.answerView.append(submitBtn);
};

BookQ.prototype.nextQuiz = function() {
  this.textView.empty();
  this.answerView.empty();

  // Choose a topic if one is not chosen.
  if (!this.state['topic']) {
    this.textView.append('<span>Choose a topic: </span><input id="topicBooks"></input>');
    var btn = $('<div><button>Submit</button></div>');
    btn.click(function() {
      this.state['topic'] = $('#topicBooks').val();
      this.nextQuiz();
    }.bind(this));
    this.textView.append(btn);
    return;
  }

  if (!this.state['books']) {
    // Request some topics and then wait for the 10 books to return.
    this.initiate(this.state['topic']);
    window.setTimeout(function() {
      this.nextQuiz(); // Wait a second to get the JSON info if we don't have it yet.
    }.bind(this), 200);
    return;
  }
  // Finally we have books and a topic.
  this.state['bookInd'] = this.state['bookInd'] + 1;

  // Show book and title. 
  var bookObj = this.getBookObj();
  this.textView.append('<h3>Memorize the title and author for 5 seconds.</h3>');
  var coverImgUrl = 'http://covers.openlibrary.org/b/isbn/' + bookObj.isbn13 + '-L.jpg';
  this.textView.append('<img src="' + coverImgUrl + '"></url>');

  window.setTimeout(function() {
    this.askQuestion();
  }.bind(this), 5000);
};

BookQ.prototype.getBookObj = function() {
  return this.state['books'].data[this.state['bookInd']];
};

// Sets up an entirely new quiz.
Ctrl.prototype.nextQuiz = function() {
  this.textView.empty();
  this.answerView.empty();
  
  // Configure what to show.
  //this.fillInTheBlankQuiz();
  //this.timeQ.nextQuiz();
  this.bookQ.nextQuiz();
};

Ctrl.prototype.init_ = function() {
  this.nextQuiz();
};

function docInit_() {
  var c = new Ctrl();
  c.init_();
}

$(document).ready(docInit_);
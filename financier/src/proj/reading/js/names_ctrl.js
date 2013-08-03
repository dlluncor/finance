
NamesCtrl = function(textDiv) {
  this.body = textDiv;
  this.firstnames = firstnames;
  this.numFirstNames = firstnames.length;
  this.lastnames = lastnames;
  this.numLastNames = lastnames.length;
  this.curLevel = 0;
  this.levels = [
    {timeout: 7, numPics: 2, blank: 1, onlyFirstName: true},
    {timeout: 5, numPics: 2, blank: 1},
    {timeout: 3, numPics: 2, blank: 1},
    {timeout: 7, numPics: 3, blank: 1},
    {timeout: 5, numPics: 3, blank: 1},
    {timeout: 5, numPics: 4, blank: 2, onlyFirstName: true}
  ];
  this.fb = null; // when facebook inits we can use this.
}

NamesCtrl.prototype.fbInit = function() {
  this.fb = new Fber();
  this.fb.call(function() {
  });
};

NamesCtrl.prototype.getFullNames = function() {
  var names = [];
  var numNames = this.levels[this.curLevel].numPics;
  var pictures = this.fb.getRandomPictures(numNames);
  for (var i = 0; i < numNames; i++) {
  	var firstInd = Math.floor(Math.random() * this.numFirstNames);
  	var lastInd = Math.floor(Math.random() * this.numLastNames);
  	var nameObj = {};
  	var name = this.firstnames[firstInd] + ' ' + this.lastnames[lastInd];
  	names.push({
      'name': name,
      'picture': pictures[i]
  	});
  }
  return names;
};

NamesCtrl.prototype.gradeQuiz = function() {
  var incorrect = 0;
  var response = $('<div></div>');

  var corrA = function(text) {
    return '<span style="color:green;">' + text + '</span>';
  };

  $('.yourAnswer').each(function(index, node) {
    var el = $(node);
    var corr = el.attr('corrAnswer');
    var yours = el.val();
    if (corr != yours) {
      incorrect += 1;
      response.append('<div>You said: ' + yours + ' Answer: ' + corrA(corr) + '</div>');
    }
  }.bind(this));

  this.body.append(response);

  if (incorrect == 0) {
    this.body.append('<h3>Correct! Youre a superstar.</h3>');
    if (this.curLevel != 5) {
      this.curLevel += 1;
    } else if (this.curLevel == 5) {
      this.body.append('<h1>Nice memory skills! Next round!</h1>');
      var img = $('<img></img>');
      img.attr('src', 'http://media.theweek.com/img/dir_0101/50778_article_full/you-won-dont-forget-to-thank-dadnbsp.jpg?175');
      this.body.append(img);
    }
  } else {
    if (this.curLevel != 0) {
      this.curLevel -= 1;
    }
  }

  window.setTimeout(function() {
      this.launch();
  }.bind(this), 3000);
  this.body.append('<div>New game in 3 seconds</div>');
  //var tryAgainBtn = $('<div><button>Go again</button></div>');
  //tryAgainBtn.click(function(){
  //  this.launch();
  //}.bind(this));
  //this.body.append(tryAgainBtn);
};

NamesCtrl.prototype.blankOutNames = function() {
  var possInds = [];
  var numNames = this.levels[this.curLevel].numPics;
  for (var i = 0; i < numNames; i++) {
    possInds.push(i);
  }
  var chosen = {};
  var left = numNames;
  // Pull out a couple random indices.
  var blankOut = this.levels[this.curLevel].blank;
  for (var j = 0; j < blankOut; j++) {
    var ind = Math.floor(Math.random() * left);
    chosen[possInds[ind]] = true;
    possInds.splice(ind, 1);
  }

  var gradeQuizOnEnter = function(el) {
    el.keypress(function(e) {
      if (e.which == 13) {
        this.gradeQuiz();
      }
    }.bind(this));
  }.bind(this);

  var level = this.levels[this.curLevel];
  $('.question').each(function(index, node) {
    var el = $(node);
    if (level.onlyFirstName) {
      // Answer is just the first name.
      var els = el.text().split(' ');
      var answer = els[0];
      var lastName = els[1];
      if (index in chosen) {
        // Input box for the first name only.
        el.empty();
        var input = $('<input class="yourAnswer"></input>');
        input.attr('corrAnswer', answer);
        gradeQuizOnEnter(input);
        el.append(input);
        el.append('<span>' + lastName + '</span>');
      }
    } else {
      // Otherwise answer is the first name.
      var answer = el.text();
      // Then have an input box for the entire name.
      if (index in chosen) {
        el.empty();
        var input = $('<input class="yourAnswer"></input>');
        input.attr('corrAnswer', answer);
        gradeQuizOnEnter(input);
        el.append(input);
      }
    }
  });

  var submitBtn = $('<div><button>Submit</button></div>');
  submitBtn.click(function() {
    this.gradeQuiz();
  }.bind(this));
  this.body.append(submitBtn);
};


NamesCtrl.prototype.drawLevelControllers = function() {
  this.levels.forEach(function(level, index) {
    var span = $('<button>Level ' + (index + 1) + '</button>');
    if (this.curLevel == index) {
      span.css('border', '3px solid blue');
    }
    span.attr('level', JSON.stringify(level));
    this.body.append(span);
  }.bind(this));
};

// Starts the name.
NamesCtrl.prototype.launch = function() {
  this.body.empty();

  // Draw the levels controllers.
  this.drawLevelControllers();

  var timeoutSec = this.levels[this.curLevel].timeout;
  this.body.append('<h3>Remember the names (' + timeoutSec + ' sec)</h3>');
  var fullNames = this.getFullNames();

  var renderNames = function(fullName) {
    var div = $('<div style="display:inline-block; padding-right:15px;"></div>');
    var nameText = $('<span class="question">' + fullName['name'] + '</span>');
    var divWithImage = $('<div></div>');
    var picImg = $('<img></img>'); picImg.attr('src', fullName['picture']);
    divWithImage.append(picImg);
    div.append(divWithImage);
    div.append(nameText);
    this.body.append(div);
  }.bind(this);

  for (var i = 0; i < fullNames.length; i++) {
    renderNames(fullNames[i]);
  }

  var interval = window.setTimeout(function() {
    this.blankOutNames();
  }.bind(this), timeoutSec * 1000);
  GLOB.intervals.push(interval);
};
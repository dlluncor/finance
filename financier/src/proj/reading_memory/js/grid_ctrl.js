var Random = {};

Random.order = function(arr) {
  var n = arr.length; 
  var tempArr = []; 
  for ( var i = 0; i < n-1; i++ ) { 
    // The following line removes one random element from arr 
    // and pushes it onto tempArr 
    tempArr.push(arr.splice(Math.floor(Math.random()*arr.length),1)[0]); 
  } 
  // Push the remaining item onto tempArr
  tempArr.push(arr[0]);
  return tempArr;
};

// div - jQuery
GridCtrl = function(div) {
  this.div = div;
  this.curLevel = 0; // Which level you are on.
  this.levelToBoard = {
    0: {'rows': 3, 'cols': 3, 'tsec': 1},
    1: {'rows': 4, 'cols': 4, 'tsec': 2},
    2: {'rows': 5, 'cols': 4, 'tsec': 3}
  };
  this.resetState();
};

GridCtrl.prototype.resetState = function() {
  this.curNumber = 1; // Correct number to guess, always starts at 1.
  this.finalNumber = null; // Last number to get correct.
  this.numIncorrect = 0; // number you guessed wrong.
};

GridCtrl.prototype.endGame = function() {
  var title = $('#inst-title');
  title.empty();
  var msg = $('<span>You win!!!!<span>');
  title.addClass('winner');
  title.append(msg);

  var guessPct = this.finalNumber / (this.numIncorrect + this.finalNumber);
  guessPct = (guessPct * 100).toFixed(0);
  var pctEl = $('<span> (' + guessPct + '% accuracy)</span>');
  title.append(pctEl);

  var whatNext = 'Again!';
  if (guessPct == 100) {
    whatNext = 'Next level!';
    this.curLevel += 1;
  }
  var againBtn = $('<button>' + whatNext + '</button>');
  againBtn.click(function() {
    this.start();
  }.bind(this));
  title.append(againBtn);
};

GridCtrl.prototype.answerGrid = function() {
  
  $('#inst-title').html('Press each number in increasing order.');

  $('.grid-number-q').each(function(ind, element) {
    var el = $(element);
    el.addClass('grid-blend-font');
    el.click(function(e) {
    	var myel = $(e.currentTarget);
        if (myel.html() == ('' + this.curNumber)) {
        	el.removeClass('grid-blend-font');

        	if (this.curNumber == this.finalNumber) {
        		this.endGame();
        	} else {
        	  // Keep going not done yet.
        	  this.curNumber += 1;
        	}
        } else {
        	this.numIncorrect += 1;
        }
    }.bind(this));
  }.bind(this));
};

GridCtrl.prototype.drawGrid = function(rows, cols) {
  var tbl = $('<table></table>');

  var numbers = [];
  for (var num = 0; num < rows * cols; num++) {
    numbers.push(num + 1);
  }

  numbers = Random.order(numbers);

  for (var i = 0; i < rows; i++) {
  	var tr = $('<tr></tr>');
  	for (var j = 0; j < cols; j++) {
  	  var ind = i * cols + j;
      var td = $('<td></td>');
      td.append('<button class="grid-number-q">' + numbers[ind] + '</button>');
      tr.append(td);
  	}
  	tbl.append(tr);
  }
  this.div.append(tbl);
};

GridCtrl.prototype.start = function() {
  this.div.empty();
  this.resetState();
  var boardState = this.levelToBoard[this.curLevel];
  var timeoutSec = boardState.tsec;
  this.div.append('<h3 id="inst-title">You have ' + timeoutSec + ' seconds to memorize the board.</h3>');
  var rows = boardState.rows;
  var cols = boardState.cols;
  this.drawGrid(rows, cols);
  this.finalNumber = rows * cols;
  var tmr = window.setTimeout(function() {
    this.answerGrid();
  }.bind(this), timeoutSec * 1000);
  GLOB.intervals.push(tmr);
};

GridCtrl.prototype.launch = function() {
  this.start();
};
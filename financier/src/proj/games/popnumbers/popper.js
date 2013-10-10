// Controller only knows about the existence of one game.
var ctrl = {};
var randomColor = function() {
  var str = 'rgb(';
  for(var i = 0; i < 3; i++) str += Math.floor(Math.random() * 256) + ',';
  return str.substring(0,str.length-1) + ')';
};

ctrl.canvasSelector = '#canvas';

// Called when the game is ready to start.
ctrl.init = function() {
  ctrl.clearCanvas();

  // Set up default colors, 
  var colors = ['red', 'blue', 'green', 'yellow'];
  var sizes = [20, 30, 50, 40]; // unused.
  var nCols = 4;

  var nRows = 4;
  var n = nCols * nRows;
  var shuffler = new Shuffler(n);
  var randomNums = shuffler.arr_;

  var START_NUM = 1;
  var END_NUM = n;
  var canvas = new Canvas(ctrl.canvasSelector, START_NUM, END_NUM);
  var ctr = 0;
  for (var i = 0; i < nRows; i++) {
    var row = new Row();
    for (var j = 0; j < colors.length; j++) {
      var data = randomNums[ctr];
      var circle = new Circle(sizes[j], randomColor(),
                              data);
      circle.setClickHandler(canvas);
      row.addCircle(circle);
      ctr++;
    }
    canvas.addRow(row);
  }
};

ctrl.clearCanvas = function() {
   // Clear the state of the parent canvas.
  $(ctrl.canvasSelector).html(''); 
};

// selector - parent div selector.

Canvas = function(selector, startNum, finishNum) {
  this.el_ = $(selector);
  // Add a timer to the top.
  this.timer_ = new Timer();
  //this.el_.append(this.timer_.asElement());

  this.correctNum_ = startNum; // Current number the user needs to select.
  this.startNum_ = startNum; // Starting number to click on.
  this.finishNum_ = finishNum; // When user clicks this game over.
};

Canvas.prototype.addRow = function(row) {
  this.el_.append(row.asElement());
};

// Handles a click on the circle.
Canvas.prototype.handleCircleClick = function(circle, e) {
  window.console.log(circle);
  // Validate the user can click on this circle.
  var clickedNum = circle.getData();
  if (clickedNum != this.correctNum_) {
    return;
  };

  // Start the timer if this was the first click.
  if (this.startNum_ == clickedNum) {
    this.timer_.start();
  }

  // The user clicked on the correct circle, hide it.
  circle.hide();
  if (clickedNum == this.finishNum_) {
    this.timer_.stop();
    ctrl.timeElapsed = this.timer_.timeElapsed();
    app.askIfWon();
    return;
  };
  this.correctNum_++;
};

Timer = function() {
  this.el_ = $('<span class="timer">Seconds elapsed: </span>');
  this.timeSpan_ = $('<span></span>');
  this.el_.append(this.timeSpan_);

  // Start and end times for the timer.
  this.timeout_;
  this.start_;
  this.end_;
};

Timer.prototype.start = function() {
  // Update the application state with how much time is
  // remaining.
  this.start_ = new Date();
  var googbind = this;
  this.numIntervals_ = 0;
  this.timeout_ = setInterval(function() {
    // Calculate difference from when we started.
    googbind.numIntervals_++;
    googbind.timeSpan_.html(googbind.numIntervals_);
  }, 1000);
};

Timer.prototype.stop = function() {
  this.end_ = new Date();
  window.clearInterval(this.timeout_);
};

// Returns time elapsed in seconds.
Timer.prototype.timeElapsed = function() {
  return (this.end_ - this.start_)/ 1000;
};

Timer.prototype.asElement = function() {
  return this.el_;
};

Row = function() {
  this.el_ = $('<div></div>');
};

Row.prototype.addCircle = function(circle) {
  this.el_.append(circle.asElement());
};

Row.prototype.asElement = function() {
  return this.el_;
};

// Circles.
Circle = function(sizePx, color, data) {
  this.sizePx = sizePx;
  this.color = color;
  this.data = data;
  // Attach itself to the dom.
  this.el_ = $('<span>' + data + '</span>');
  this.el_.addClass('circle');
  this.el_.css('background-color', color);
  this.setSize_(data);
};

Circle.prototype.setSize_ = function(sizePx) {
  // Make size an interesting calculation.
  // TODO: make reasonable size.
  var MAX_SIZE = 120;
  var MIN_SIZE = 60;
  var sizePx = Math.random() * sizePx * 10;
  sizePx = Math.min(MAX_SIZE, sizePx);
  // Make sure it is large enough.
  sizePx = Math.max(MIN_SIZE, sizePx);
  this.el_.css('position', 'absolute');
  this.el_.css('left', Math.floor(Math.random() * 200));
  this.el_.css('top', Math.floor(Math.random()*360));
  this.el_.css('width', sizePx + 'px');
  this.el_.css('height', sizePx + 'px');
  this.el_.css('background-size', sizePx + 'px');
  this.el_.css('border-radius', sizePx + 'px');
  this.el_.css('line-height', sizePx + 'px');
  this.el_.css('opacity', Math.min(Math.random() + 0.5, 1));
};

Circle.prototype.getData = function() {
  return this.data;
};

Circle.prototype.asElement = function() {
  return this.el_;
};

// The handler must have a function handleCircleClick.
Circle.prototype.setClickHandler = function(handler) {
  var googbind = this; 
  this.el_.bind('touchstart', function(e) {
    handler.handleCircleClick(googbind); 
  });
}

Circle.prototype.hide = function() {
  var tmp = this;
  /**
  tmp.el_.css('box-shadow', '0px 0px 40px 40px rgba(255,255,0,0.3)');
  tmp.el_.animate({
    'opacity': 0
  }, 200, function(){ 
    tmp.el_.css('visibility', 'hidden');
  });
  */
  tmp.el_.css('visibility', 'hidden');
}; 

// Shuffles numbers from 0 to n.
Shuffler = function(n) {
  this.arr_ = this.createArr_(n);
  this.arr_.reverse();
  //this.arr_ = this.shuffleArr_(this.arr_);
  Util.printArr(this.arr_);
};

Shuffler.prototype.createArr_ = function(n) {
  var arr = [];
  // Create numbers from 1 to n :(
  for (var i = 1; i <= n; i++) {
    arr.push(i);
  }
  return arr;
};

Shuffler.prototype.shuffleArr_ = function(nums) {
  var max_num = nums.length - 1;
  for (var i = max_num; i >= 0; i--) {
    var before = nums[i];
    var swapi = Math.floor((Math.random() * max_num) % i);
    window.console.log(swapi);
    //TODO Why is it NaN.
    if (isNaN(swapi)) {
      continue;
    }
    nums[i] = nums[swapi];
    nums[swapi] = before;
  }

  return nums;
};

// Utility functions.
var Util = {};

Util.printArr = function(arr) {
  window.console.log(arr);
  window.console.log(arr.join(' '));
  window.console.log('Length ' + arr.length);
};

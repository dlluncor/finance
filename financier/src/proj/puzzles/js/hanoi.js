var hctrl = {};

print = function(str) {
  $('#results').append('<div>' + str + '</div>');
};

var Hanoi = function(N) {
  this.answers_ = [];
  this.N = N;
  this.d = 1; // first direction to go in, which is right.
  this.blocksMap = null;
  this.columns = [$('#col0'), $('#col1'), $('#col2')];
};

Hanoi.prototype.move = function(N, d) {
  var direction = d > 0 ? 'right' : 'left';
  this.answers_.push('Peg ' + N + ' to the ' + direction);

  var block = this.blocksMap[N];
  // What peg are we moving to.
  var addNum = direction == 'right' ? 1 : -1;
  if (block.peg == 0 && direction == 'left') {
  	addNum = 2; // move two to the right.
  } else if (block.peg == 2 && direction == 'right') {
  	addNum = -2; // move two to the left;
  }
  var newPeg = block.peg + addNum;
  this.animateBlock(block, block.peg, newPeg);
  block.peg = newPeg;
};

// d - +1 move right, -1 move left.
// move(2, +1) - move peg 2 to the right.
Hanoi.prototype.hanoi = function(N, d) {
  if (N == 0) { return; }
  var interval = 100;
  var that = this;
  window.setTimeout(function() {
    that.hanoi(N-1, -d);
  }, interval);
  window.setTimeout(function() {
    that.move(N, d);
    window.setTimeout(function(){
      that.hanoi(N-1, -d);
    }, interval);
  }, interval);
};

Hanoi.prototype.solve = function() {
  this.blocksMap = this.makeBlocks();
  // Draw them in their initial state.
  for (var i = 1; i <= this.N; i++) {
  	this.columns[0].append(this.blocksMap[i].el);
  }
  this.hanoi(this.N, this.d);
};

// For drawing purposes.
// A block {num: 3, peg: 0, 1, 2} pegs go from 1 to 3.
Hanoi.prototype.makeBlocks = function() {
  var blocksMap = {};
  for (var i = 1; i <= this.N; i++) {
  	blocksMap[i] = new Block(i);
  }
  return blocksMap;
};

// animateBlock(Block, 0, 1) move block from left most 0 column to middle 1 column.
Hanoi.prototype.animateBlock = function(block, fromCol, toCol) {
  this.columns[fromCol].remove('#' + block.id);
  this.columns[toCol].prepend(block.el);
}

var Block = function(n) {
  this.num = n;
  this.peg = 0; // They all start on the 0th peg. 0, 1, 2 pegs.
  this.width = n * 10; // 3 == 30px.
  this.height = 10; // height is 10px.
  this.el = $('<div>' + n +'</div>');
  this.id = 'block' + n;
  this.el.attr('id', this.id);
  this.el.css('width', this.width + 'px');
};

hctrl.init_ = function() {
  var hanoi = new Hanoi(10);
  hanoi.solve();
  var rRes = hanoi.answers_.map(function(el) { return '<div>' + el + '</div>'}); 
  print(rRes);
};

$(document).ready(hctrl.init_);
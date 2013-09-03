
Array.prototype.transpose = function(a) {
// Calculate the width and height of the Array
  var a = this,
    w = a.length ? a.length : 0,
    h = a[0] instanceof Array ? a[0].length : 0;

  // In case it is a zero matrix, no transpose routine needed.
  if(h === 0 || w === 0) { return []; }

  /**
   * @var {Number} i Counter
   * @var {Number} j Counter
   * @var {Array} t Transposed data is stored in this array.
   */
  var i, j, t = [];

  // Loop through every item in the outer array (height)
  for(i=0; i<h; i++) {

    // Insert a new row (array)
    t[i] = [];

    // Loop through every item per item in outer array (width)
    for(j=0; j<w; j++) {

      // Save transposed data.
      t[i][j] = a[j][i];
    }
  }
  return t;
};

Gmb = function(coinsToFlip, probOfSuccess, mainDiv) {
  this.prob = probOfSuccess;
  this.flips = coinsToFlip;
  this.odds = 1.0; // I bet 10 dollars, I get 10 back.
  this.start = 10; // Start with 10 dollars.
  // Drawing.
  this.mainDiv = mainDiv;
};

// Returns whether the flip is successful given the probability.
Gmb.prototype.flip = function() {
  var val = Math.random();
  if (val < this.prob) {
  	// If probOfSuccess = 1, all vals will return true.
  	// val < 0.5 when its a fair coin flip.
  	return true;
  }
  return false;
};

// Returns a list of dollar values given the Jackle strategy.
Gmb.prototype.kelly = function() {
  var values = [];
  var curValue = this.start;
  for (var i = 0; i < this.flips; i++) {
    var win = this.flip();
    // What is the edge if this is negative??
    var edge = this.prob - (1 - this.prob);
    var bet = (edge/this.odds) * curValue;
    if (win) {
      curValue += bet;
    } else {
      curValue -= bet;
    }
    values.push(parseFloat(curValue.toFixed(2)));
  }
  return values;
};

// Fixed bet strategy.
Gmb.prototype.fixedBet = function() {
  var values = [];
  var curValue = this.start;
  var bet = curValue / 5.0;
  for (var i = 0; i < this.flips; i++) {
    var win = this.flip();
    if (win) {
      curValue += bet;
    } else {
      curValue -= bet;
    }
    values.push(parseFloat(curValue.toFixed(2)));
  }
  return values;
};

// Martingale. If you lose double up. If not, keep betting the same??
Gmb.prototype.martingale = function() {
  var values = [];
  var curValue = this.start;
  var posBet = curValue / 5.0;
  var negBet = posBet;
  var prevWon = true; // did I win previously?
  for (var i = 0; i < this.flips; i++) {
    var win = this.flip();
    var bet = prevWon ? posBet : negBet * 2;
    if (win) {
      curValue += bet;
    } else {
      curValue -= bet;
    }
    values.push(parseFloat(curValue.toFixed(2)));
  }
  return values;
};

Gmb.prototype.plot = function(chartDiv, allResults) {

    var header = ['Bet'];

    allResults.forEach(function(result){
      header.push(result.strategy);
    });

    var dataTable = [header];
    // Create data table.
    for (var i = 0; i < this.flips; i++) {
      var xlabel = '' + i;
      var row = [xlabel];
      allResults.forEach(function(result) {
        row.push(result.res[i]);
      });
      dataTable.push(row);
    }

    var data = google.visualization.arrayToDataTable(dataTable);
	/*var data = google.visualization.arrayToDataTable([
	      ['Year', 'Sales', 'Expenses'],
	      ['2004',  1000,      400],
	      ['2005',  1170,      460],
	      ['2006',  660,       1120],
	      ['2007',  1030,      540]
	    ]);*/

	var options = {
	  title: 'Gambling trends',
	  hAxis: {title: 'Number of bets.'},
	  vAxis: {title: 'Bankroll ($)'},
	  height: 500
	};
	var chart = new google.visualization.LineChart(chartDiv);
	chart.draw(data, options);
};

Gmb.prototype.draw = function() {
  var div = this.mainDiv;
  var results = this.kelly();
  //div.append('<h3>Jackle</h3>');
  //div.append(results.join(','));

  var results1 = this.fixedBet();
  //div.append('<h3>Fixed bet</h3>');
  //div.append(results1.join(','));

  var results2 = this.martingale();
  //div.append('<h3>Martingale</h3>');
  //div.append(results2.join(','));
  var chartDiv = document.createElement('div');
  div.append(chartDiv);
  var allResults = [
    {strategy: 'Kelly', res: results},
    {strategy: 'Fixed bet', res: results1},
    {strategy: 'Martingale', res: results2}
  ];
  this.plot(chartDiv, allResults);
};

var gambling = {
	'isReady': false
};

gambling.Gamble = function() {
  var resultsDiv = $('#gambleChart');
  resultsDiv.empty();

  var coinsToFlip = parseFloat($('#coinsToFlip').val());
  var probOfSuccess = parseFloat($('#probOfSuccess').val());
  var gmbl = new Gmb(coinsToFlip, probOfSuccess, resultsDiv);
  gmbl.draw();
};

gambling.chartReady = function() {
  gambling.isReady = true;
};

// Triangle gurdel esher.

var tri = {};

Triangle = function(el, levels, triangleWidth) {
  this.el = el;
  this.LEVELS = levels;
  //var height = this.LEVELS * triangleWidth / 2;
  //var width = height * 1.63;
  //this.el.css('width', width + 'px');
  //this.el.css('height', height + 'px');
  this.el.css('border', '1px solid #d3d3d3');
  this.ctx = el.get()[0].getContext('2d');
}

Triangle.prototype.draw = function(start, opt_finish) {
  if (!opt_finish) {
    var finish = start;
  } else {
    window.console.log('Moving to x: ' + start.x + ' y: ' + start.y);
    this.ctx.moveTo(start.x, start.y);
    var finish = opt_finish;
  }
  window.console.log('Line to x: ' + finish.x + ' y: ' + finish.y);
  this.ctx.lineTo(finish.x, finish.y);
  this.ctx.stroke();
};

// Finds the length of the other side of the triangle.
// a - side. c - hypothenuse.
Math.otherSide = function(a, c) {
  return Math.sqrt(Math.pow(c, 2) - Math.pow(a, 2));
};

Triangle.prototype.drawFrac = function(start, end, opt_level) {
  var level = opt_level;
  if (opt_level == undefined) {
    level = 0;
  }
  if (level == this.LEVELS) {
    return;
  }

  // Go halfway.
  var fullx = (end.x - start.x);
  var halfx = fullx / 2.0;
  var halfwayX = start.x + halfx;
  var halfY = Math.otherSide(halfx, fullx);
  var halfwayY = start.y - halfY;
  // Don't need to redraw triangle when level != 0.
  // Draw triangle.
  if (level == 0) {
    this.draw({x:start.x, y:start.y}, {x:end.x, y:end.y});
    this.draw({x:halfwayX, y:halfwayY});
    this.draw({x:start.x, y:start.y});    // Come back.
  }
  // Draw upside down triangle.
  var threeqx = fullx * 3 / 4.0;
  var oneqx = fullx / 4.0;
  var midy = Math.otherSide(oneqx, halfx);
  var qX = start.x + oneqx;
  var threeqX = start.x + threeqx;
  var middleY = start.y - midy; // Middle height of triangle along the slanted side.
  this.draw({x:qX, y:middleY}, {x:threeqX, y:middleY});
  this.draw({x:halfwayX, y:start.y});
  this.draw({x:qX, y:middleY});

  // Find end points for three triangles which repeat.
  // In order, bottle left, bottom right, top.
  this.drawFrac({x:start.x, y:start.y}, {x:halfwayX, y:start.y}, level + 1);
  this.drawFrac({x:halfwayX, y:start.y}, {x:end.x, y:end.y}, level + 1);
  this.drawFrac({x:qX, y:middleY}, {x:threeqX, y:middleY}, level + 1);
  // Start at some recursive point.
};

tri.draw = function() {
  // Add a triangles div.
  var container = $('#trianglesDiv');
  container.empty();
  var el = $('<canvas id="triangles"></canvas>');
  container.append(el);
  var width = 150;
  var userInputLevels = parseInt($('#numFractalPatterns').val());
  var levels = userInputLevels > 6 ? 6 : userInputLevels;
  var t = new Triangle(el, levels, width);
  var starty = 135;
  var startx = 0;
  t.drawFrac({x:startx, y:starty}, {x:(startx + width), y:starty});
};

tri.init = function() {
  tri.draw();
};

$(document).ready(tri.init);
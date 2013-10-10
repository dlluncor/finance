var canvas = document.getElementById("canvas1");

function sketchProc(processing) {
var width = height = 400;
processing.size(width, height);
var bubbles = [];
var timeSinceLast = 0;

var isClose = function(tmp, bubble) {
    var stop = false;
    var x = tmp.x - bubble.x;
    var y = tmp.y - bubble.y;
    var r = tmp.r + bubble.r;
    if (x*x + y*y < r*r) {
      stop = true;   
    }
    return stop;
};

var touchingOtherBubble = function(bubble) {
    for (var j in bubbles) {
        var tmp = bubbles[j];
        if (tmp.x !== bubble.x || tmp.y !== bubble.y) {
            if(isClose(tmp, bubble)) {
               return tmp;
            }
        }
    }
    return null;
};

var makeBubble = function(){
  var tmpBubble = function() {
  return {
        x: processing.random() * width,
        y: processing.random() * height,
        r: 10
    };
  };
  var tmp = tmpBubble();
  while(touchingOtherBubble(tmp)) {
      tmp = tmpBubble();
  }
  return tmp;
};

var drawBubble = function(bubble){
    var r = bubble.r / 5;
    processing.noStroke();
    var rgb = [10,15,24];
    if (bubble.player == 2) {
        rgb = [24,15,10];
    }
    for (var i = 10; i >= 1; i--) {
      processing.fill(i*rgb[0], i*rgb[1], i * rgb[2]);
      processing.ellipse(bubble.x, bubble.y, r * i, r * i);
    }
    return;
};

for (var i = 0; i < 10; i++) {
    bubbles.push(makeBubble());
    bubbles[i].player = (i % 2 == 0) ? 1 : 2;
}

var popAndSpawn = function(evt) {
    var touched = -1;
    for (var i in bubbles) {
        var bubble = bubbles[i];
        if (isClose(bubble, {
            x: evt.touches[0].pageX,
            y: evt.touches[0].pageY,
            r: 10
        })) {
            touched = i;
        }
    }
    if (touched !== -1) {
        bubbles[touched] = makeBubble();
    }
};
processing.draw = function() {
  processing.background(255, 255, 255);
  for (var i in bubbles) {
    var bubble = bubbles[i];
    var neighbor = touchingOtherBubble(bubble);
    if (!neighbor) {
      bubble.r++;
    } else {
        if (neighbor.r > bubble.r) {
           bubble.player = neighbor.player;
        } else {
           neighbor.player = bubble.player;
        }
    }
    drawBubble(bubble);
    timeSinceLast++;
  }  
};
canvas.addEventListener("touchstart", popAndSpawn);
}

var processingInstance = new Processing(canvas, sketchProc);

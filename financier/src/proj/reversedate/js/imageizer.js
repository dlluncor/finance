var ctrl = {};

var Imager = function(canvas, imageUrl) {
  this.canvas = canvas;
  this.imageUrl = imageUrl;
  this.prefix = 'http://imagizer.imageshack.us/';
  this.img = $('#imgChange');
  this.sizes = {
    0: {'width': 400, 'height': 400},
    1: {'width': 500, 'height': 400},
    2: {'width': 400, 'height': 400},
    3: {'width': 400, 'height': 600},
    4: {'width': 100, 'height': 100},
    5: {'width': 400, 'height': 400},
    6: {'width': 1000, 'height': 1000},
    7: {'width': 10, 'height': 10},
  };
};

var carouselRep;

// Makes the image link
var makeImageLink = function(prefix, width, height, filter, url) {
  return prefix + width + 'x' + height + 'f' + filter + '/' + url;
};

Imager.prototype.carousel = function() {
  var that = this;
  var origSize = {'height': 500, 'width': 500};
  var url = this.imageUrl;
  var prefix = this.prefix;
  var i = 0;
  var showImage = function() {
    if (i == 10) {
    	window.clearInterval(carouselRep);
    }
    var filter = i;
    var size = origSize;
    if (i in that.sizes) {
      size = that.sizes[i];
    }
    var imgLink = makeImageLink(prefix, size['width'], size['height'], filter, url);
    that.img.attr('src', imgLink);
    i++;
  };
  carouselRep = window.setInterval(showImage, 1000);
};

// Which image filter do you like the best?
// Passport generator.

ctrl.init_ = function() {
  var canvas = $('#canvas');
  //var img0 = 'http://profile.ak.fbcdn.net/hprofile-ak-snc6/c127.37.466.466/s160x160/247994_10150212086044705_5059070_n.jpg';
  //var img0 = 'http://d1gwxpes5z0r7f.cloudfront.net/grub_user_pics/42235/size_238x238/42235/IMG_0282.JPG?2012';
  var img0 = 'www.hdwallpapernew.com/wp-content/uploads/2013/03/Rainbow-Beach-Pictures-242.jpg';
  var imager0 = new Imager(canvas, img0);
  imager0.carousel();
};

$(document).ready(ctrl.init_);
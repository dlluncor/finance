var gizer = {};

// Makes the image link
gizer.makeImageLink = function(width, height, filter, url) {
  prefix = 'http://imagizer.imageshack.us/';
  return prefix + width + 'x' + height + 'f' + filter + '/' + url;
};

gizer.makeSaveImage = function(scale) {
	var img = $('#aviaryResult');
	var sourceImg = img.attr('src');
	var height = parseInt(img.height() * scale);
	var width = parseInt(img.width() * scale);
	var newUrl = gizer.makeImageLink(width, height, 0, sourceImg);
	return newUrl;
}
gizer.addClickHandlers = function() {
  $('#saveAsStickers').click(function(e) {
  	var newUrl = gizer.makeSaveImage(1/3);
  	window.open(newUrl, '_blank');
  });

  $('#saveAsPictureFrames').click(function(e) {
  	var newUrl = gizer.makeSaveImage(0.6);
  	window.open(newUrl, '_blank');
  });

  $('#saveAsPosters').click(function(e) {
  	var newUrl = gizer.makeSaveImage(1);
  	window.open(newUrl, '_blank');
  });

  $('#continueToPurchaseBtn').click(function(e) {
    window.location.hash = '#page2';
  });
};

gizer.addWalgreens = function() {
  $('#printItButton').click(function() {
  	window.location.hash = '#page3';
  });

  $('#postcardButton').click(function() {
  	window.location.hash = '#page3';
  });
}

gizer.init_ = function() {
  gizer.addClickHandlers();
  gizer.addWalgreens();
};

$(document).ready(gizer.init_);
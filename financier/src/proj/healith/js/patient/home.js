var ShowContentCtrl = function() {
};

// Parameters from the user.
ShowContentCtrl.prototype.setUp = function(params) {
  var theFrame = $('#showContentFrame');
  var url = queryParamValue('url');
  if (!url || url == '') {
  	theFrame.css('display', 'none');
  	$('#errorMessage').css('display', 'block');
  	window.console.log(queryParamValue('url'));
  	return;
  }
  var absUrl = 'http://' + url;
  theFrame.attr('src', absUrl);
  theFrame.css('height', ctrl.clientHeight - 22 + 'px');
  theFrame.css('width', ctrl.clientWidth - 22 + 'px');
}


// Static variables which can be accessed by everyone. Must be called first.
var ctrl = {
	clientHeight: null,
	clientWidth: null
};

ctrl.init_ = function() {
  ctrl.clientWidth = $(window).width();
  ctrl.clientHeight = $(window).height();
};

ctrl.init_();


// Utility functions.

function queryParamValue(key) {
    key = key.replace(/[*+?^$.\[\]{}()|\\\/]/g, "\\$&"); // escape RegEx meta chars
    var match = location.search.match(new RegExp("[?&]"+key+"=([^&]+)(&|$)"));
    return match && decodeURIComponent(match[1].replace(/\+/g, " "));
}

// Get parameters from hash.
getParams = function() {
  var hash = window.location.hash;
  hash = hash.substring(1); // Remove the #
  var params = {};
  hash.split('?').forEach(function(keyVal) {
    var pair = keyVal.split('=');
    params[pair[0]] = pair[1];
  });
  window.console.log(params);
  return params;
};

var hasher = {};

hasher.init_ = function() {
  var params = getParams();
  window.console.log(params);
  if ('scc' in params) {
    var showContentCtrl = new ShowContentCtrl();
    showContentCtrl.setUp(params);
  }
};

$(window).bind('hashchange', hasher.init_);
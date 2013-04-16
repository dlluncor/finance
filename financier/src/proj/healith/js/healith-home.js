// Utility functions.

// Get parameters from hash.
getParams = function() {
  var hash = window.location.hash;
  hash = hash.substring(1);
  var params = {};
  hash.split('?').forEach(function(keyVal) {
    var pair = keyVal.split('=');
    params[pair[0]] = pair[1];
  });
  window.console.log(params);
  return params;
};

var dochome = {};

dochome.setHandlers = function() {
  $('#page0-plus-icon').click(function(e) {
    window.location.hash = '#page1';
  });

  $('#heart-surgery-template').click(function(e) {
    window.location.hash = '#page2';
  });
};

dochome.init_ = function() {
  dochome.setHandlers();
};

doctemplate = {};

doctemplate.setUp = function(templateType) {
  var contentObjs = [
    { day: 'Day 0:', time: '2:00pm', content: 'Surgery Demo Video', check: 'check'},
    { day: 'Day 1:', time: '10:00am', content: 'Tips on Driving Back', check: ''},
    { day: 'Day 2:', time: '8:00am', content: 'How to Shower', check: ''},
    { day: 'Day 8:', time: '8:00am', content: 'Remove Stuture Covering', check: ''},
    { day: 'Days 9:', time: 'nopush', content: 'Follow up Checklist', check: ''},
    { day: 'Day 20:', time: '2:00pm', content: 'Summary/ Road to Recovery', check: ''},
    { day: 'Day 30:', time: '8:00am', content: 'Scab Present?', check: ''},
    { day: 'Day 35:', time: '9:00pm', content: 'Picture Follow Up', check: ''},
    { day: 'Day 36:', time: '8:00am', content: 'Positive Encouragement', check: ''},
    { day: 'Day 40:', time: '8:00am', content: 'Recovery!!!/ Report sheet', check: ''},
  ];
  var templateRowsTmpl = $('#templateRow').template();
  var table = $('#page2-template-table');
  $.tmpl(templateRowsTmpl, contentObjs).appendTo(table);
}

var docctrl = {};

docctrl.init_ = function() {
  dochome.init_();
  docctrl.insertTemplates_();
}

docctrl.insertTemplates_ = function() {
  function loadTemplate(tObj) {
    $.get(tObj.path, function(templateText){
      var text = '<script id="' + tObj.id + '" type="text/x-jquery-tmpl">' + 
               templateText + '</script>';
      $('body').append(text);
    });
  }

  var templates = [
    {path: 'proj/healith/js/template_row.html', id: 'templateRow'}
  ];

  for (var i = 0; i < templates.length; i++) {
    loadTemplate(templates[i]);
  }
};

$(document).ready(docctrl.init_);

var hasher = {};

hasher.init_ = function() {
  var params = getParams();
  var switcher = '';
  if ('page0' in params || 'start' in params) {
    $('#page0').css('display', 'block'); $('#page1').css('display', 'none'); 
    $('#page2').css('display', 'none'); $('#page3').css('display', 'none'); 
    switcher = 'page0';
  } else if ('page1' in params) {
    $('#page0').css('display', 'none'); $('#page1').css('display', 'block'); 
    $('#page2').css('display', 'none'); $('#page3').css('display', 'none'); 
    switcher = 'page1';
  } else if ('page2' in params) {
    $('#page0').css('display', 'none'); $('#page1').css('display', 'none'); 
    $('#page2').css('display', 'block'); $('#page3').css('display', 'none'); 
    switcher = 'page2';
    doctemplate.setUp('heart-surgery');
  } else if ('page3' in params) {
    $('#page0').css('display', 'none'); $('#page1').css('display', 'none'); 
    $('#page2').css('display', 'none'); $('#page3').css('display', 'block'); 
    switcher = 'page3';
  }
  window.console.log(switcher);
};

$(window).bind('hashchange', hasher.init_);
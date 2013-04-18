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

dochome.absoluteUrl = 'http://teacherlunk.appspot.com';

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

doctemplate = {
  contentObjs: null
};

doctemplate.setItemSelectHandlers = function() {
  var itemToContentObj = {};
  var responseIdToContentObj = {};
  var itemClicked = function(e) {
    window.console.log(e);
    var el = e.srcElement;
    var contentObj = itemToContentObj[el.id];
    window.console.log(contentObj);
    $(el).removeClass('right-arrow');
    $(el).addClass('green-check');
    // TODO(dlluncor): send text message when arrow clicked.
    window.console.log(contentObj.message);
  };

  var responseHoveredIn = function(e) {
    var el = e.srcElement;
    var contentObj = responseIdToContentObj[el.id];
    if (contentObj.responseImage == '') {
      return;
    }
    $(el).find('.response-image').css('display', 'block');
    window.console.log($(el));
  };

  var responseHoveredOut = function(e) {
    var el = e.srcElement;
    var contentObj = responseIdToContentObj[el.id];
    if (contentObj.responseImage == '') {
      return;
    }
    $(el).find('.response-image').css('display', 'none');
    window.console.log($(el));
  };

  doctemplate.contentObjs.forEach(function(contentObj) {
    // To send a message.
    $('#' + contentObj.item).click(itemClicked);
    itemToContentObj[contentObj.item] = contentObj;
    responseIdToContentObj[contentObj.responseId] = contentObj;
    // To show what a user responded with.
    $('#' + contentObj.responseId).hover(responseHoveredIn, responseHoveredOut);
  });
};

doctemplate.setUp = function(templateType) {
  var heartSurgeryPdf = dochome.absoluteUrl + '/img/healith//HeartSurgeryPDF.pdf';
  var contentObjs = [
    { day: 'Day 0:', time: '2:00pm', content: 'Surgery Demo Video', check: 'orange',
      message: 'Please check out this heart surgery video. http://www.youtube.com/watch?v=ymVNmmHc-BQ'},
    { day: 'Day 1:', time: '10:00am', content: 'Tips on Driving Back', check: ''},
    { day: 'Day 2:', time: '8:00am', content: 'How to Shower', check: ''},
    { day: 'Day 8:', time: '8:00am', content: 'Remove Stuture Covering', check: 'orange',
      message: 'This document might help explain how to remove stutures. ' + heartSurgeryPdf},
    { day: 'Day 9:', time: 'nopush', content: 'Follow up Checklist', check: ''},
    { day: 'Day 20:', time: '2:00pm', content: 'Summary/ Road to Recovery', check: ''},
    { day: 'Day 30:', time: '8:00am', content: 'Scab Present?', check: 'orange',
      message: 'Do you still have a scab present over the surgery? (Yes/no?)',
      response: 'Yes', responseImage: '/img/healith/mychestscab.jpe'},
    { day: 'Day 35:', time: '9:00pm', content: 'Picture Follow Up', check: 'orange',
      message: 'Could you send me a picture of how the scab is healing?'},
    { day: 'Day 36:', time: '8:00am', content: 'Positive Encouragement', check: ''},
    { day: 'Day 40:', time: '8:00am', content: 'Recovery!!!/ Report sheet', check: ''},
  ];
  var i = 0;
  contentObjs.forEach(function(contentObj) {
    contentObj.item = 'selectitem' + i;
    contentObj.responseId = 'response' + i;
    i++;
    var opKeys = ['response', 'responseImage'];
    opKeys.forEach(function(key) {
      if ((key in contentObj) == false) {
        contentObj[key] = '';
      }
    });
  });
  doctemplate.contentObjs = contentObjs;
  var templateRowsTmpl = $('#templateRow').template();
  var table = $('#page2-template-table');
  $.tmpl(templateRowsTmpl, contentObjs).appendTo(table);

  window.setTimeout(function() {
    doctemplate.setItemSelectHandlers();
  }, 2);
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
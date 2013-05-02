var dochome = {};

dochome.absoluteUrl = 'http://teacherlunk.appspot.com';

dochome.setHandlers = function() {
  $('#page0-plus-icon').click(function(e) {
    window.location.hash = '#page1';
  });

  $('#heart-surgery-template').click(function(e) {
    window.location.hash = '#page2?templateType=heartSurgery';
  });

  $('#new-template').click(function(e) {
    window.location.hash = '#page2?templateType=newTemplate';
  });
};

dochome.init_ = function() {
  dochome.setHandlers();
};


// Doc template controller.
DocTemplateCtrl = function() {
  this.contentObjs = []; // Rows loaded from the database or added by the user.
};

// Handles actions when a user clicks, hovers, or interacts with the rows that
// these content objects represent.
// NOTE: Ids are tied to - modifyContentForInteraction()
DocTemplateCtrl.prototype.setItemSelectHandlers = function(contentObjs) {
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

  var removeItemClicked = function(e) {
    var el = e.srcElement;
    var myEl = $(el);
    myEl.parent().css('display', 'none');
  }

  contentObjs.forEach(function(contentObj) {
    // To send a message.
    $('#' + contentObj.item).click(itemClicked);
    itemToContentObj[contentObj.item] = contentObj;
    responseIdToContentObj[contentObj.responseId] = contentObj;
    // To show what a user responded with.
    $('#' + contentObj.responseId).hover(responseHoveredIn, responseHoveredOut);
    // To remove an item when a user clicks X.
    $('#' + contentObj.removeId).click(removeItemClicked);
  });
};

// Sets up ids on the content objects for interaction.
DocTemplateCtrl.prototype.modifyContentForInteraction = function(contentObjs) {
  var i = this.contentObjs.length;
  contentObjs.forEach(function(contentObj) {
    contentObj.item = 'selectitem' + i;
    contentObj.responseId = 'response' + i;
    contentObj.removeId = 'remove' + i;
    i++;
    // Optional keys must have values.
    var opKeys = ['response', 'responseImage'];
    opKeys.forEach(function(key) {
      if ((key in contentObj) == false) {
        contentObj[key] = '';
      }
    });
  });
};

// Method that needs to be called when a new list of rows with content objects are added.
DocTemplateCtrl.prototype.addContentObjects = function(contentObjs) {
  this.contentObjs = this.contentObjs.concat(contentObjs);
  // Modify content to have interaction then fill in the table.
  this.modifyContentForInteraction(contentObjs);

  var templateRowsTmpl = $('#templateRow').template();
  var table = $('#page2-template-table');
  $.tmpl(templateRowsTmpl, contentObjs).appendTo(table);
  // Set up the row select handlers.
  // TODO(dlluncor): When content objects already exist, the X no longer works.
  window.setTimeout(function() {
    this.setItemSelectHandlers(contentObjs);
  }.bind(this), 2);
};

// templateType - "heartSurgery" or "newTemplate"
// Returns a list of content objects.
DocTemplateCtrl.prototype.loadContentObjects = function(templateType) {
  if (templateType == 'heartSurgery') {
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
    return contentObjs;
  }
  if (templateType == 'newTemplate') {
    return [];
  }
  return [];
};

// Returns an object for the basic page information. Title, emails, etc.
DocTemplateCtrl.prototype.getBasicPageInfo = function(templateType) {
  if (templateType == 'heartSurgery') {
    return {
      'title': 'Post Heart Surgery Template'
    };
  }
  if (templateType == 'newTemplate') {
    return {
      'title': 'Create your own template!'
    };
  }
  return {};
};

DocTemplateCtrl.prototype.setButtonHandlers = function() {
  $('#templatePage-add-row').click(function(e) {
    var newObj = { day: 'Day 1:', time: '8:00am', content: 'Description', check: ''};
    this.addContentObjects([newObj]);
  }.bind(this));
};

// params - {'templateType': 'heartTemplate'} for exapmle.
DocTemplateCtrl.prototype.setUp = function(params) {
  var templateType = params['templateType'];

  // Clear the old page2 information.
  var page2Container = $('#page2');
  page2Container.html('');
  // Fill basic page.
  var templatePageInfoObj = this.getBasicPageInfo(templateType);
  var templatePageTmpl = $('#createTemplatePage').template();
  $.tmpl(templatePageTmpl, templatePageInfoObj).appendTo(page2Container);

  // Load the content objects which will represent the template rows.
  var contentObjs = this.loadContentObjects(templateType);
  this.addContentObjects(contentObjs);

  // Add row needs this.
  window.setTimeout(function() {
    this.setButtonHandlers();
  }.bind(this), 2);
}

// App loader.
var docctrl = {};

docctrl.init_ = function() {
  window.location.hash = '#page0';
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
    {path: 'proj/healith/js/template_row.html', id: 'templateRow'},
    {path: 'proj/healith/js/create_template_page.html', id: 'createTemplatePage'}
  ];

  for (var i = 0; i < templates.length; i++) {
    loadTemplate(templates[i]);
  }
};

$(document).ready(docctrl.init_);

// Utility functions.

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

// Place controller.
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
    var doctempCtrl = new DocTemplateCtrl();
    doctempCtrl.setUp(params);
  } else if ('page3' in params) {
    $('#page0').css('display', 'none'); $('#page1').css('display', 'none'); 
    $('#page2').css('display', 'none'); $('#page3').css('display', 'block'); 
    switcher = 'page3';
  }
  window.console.log(switcher);
};

$(window).bind('hashchange', hasher.init_);
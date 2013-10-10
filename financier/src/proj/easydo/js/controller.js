// To control all the main interactions on the finance page.
var controller = {};

print = function(string) {
  window.console.log(string);
};

controller.init_ = function() {
/*	$('ul.tabs').each(function(){
		  // For each set of tabs, we want to keep track of
		  // which tab is active and it's associated content
		  var $active, $content, $links = $(this).find('a');

		  // Use the first link as the initial active tab
		  $active = $links.first().addClass('active');
		  $content = $($active.attr('href'));

		  // Hide the remaining content
		  $links.not(':first').each(function () {
		      $($(this).attr('href')).hide();
		  });

		  // Bind the click event handler
		  $(this).on('click', 'a', function(e){
		      // Make the old tab inactive.
		      $active.removeClass('active');
		      $content.hide();

		      // Update the variables with the new link and content
		      $active = $(this);
		      $content = $($(this).attr('href'));

		      // Make the tab active.
		      $active.addClass('active');
		      $content.show();

		      // Prevent the anchor's default click action
		      e.preventDefault();
		  });
	}); */

  controller.createAppStateHandler();
  controller.insertTemplates();
  controller.addHandlers();
};

// hash state handler.
var hasher = {};

// #trigger?key1=val1&key2=val2
hasher.getAction = function(hashString) {
  hashString = hashString.replace('#', '');
  var els = hashString.split('?');
  return els[0];
};

controller.handleAction = function(action) {
  print(action);
  if (action == 'trigger') {
    $('#triggerDiv').css('display', 'block');
    $('#preferencesDiv').css('display', 'none');
  } else if (action == 'preferences') {
    $('#triggerDiv').css('display', 'none');
    $('#preferencesDiv').css('display', 'block');
  } else {
    // Make trigger the default action.
  	$('#triggerDiv').css('display', 'block');
    $('#preferencesDiv').css('display', 'none');
  }
};

controller.createAppStateHandler = function() {
	$(window).bind('hashchange', function() {
		var hash = window.location.hash;
        var action = hasher.getAction(hash);
        controller.handleAction(action);
	});

	setTimeout(function() {
      window.location.hash = '#trigger';
	}, 1);
};

// Button handlers.

controller.addHandlers = function() {
  // Trigger.
  $('#flightSearchBtn').click(function(e) {
  	var startDate = $('#startDateInput').val();
  	var endDate = $('#endDateInput').val();
  	print(startDate);
  	print(endDate);

  	var fromLocation = $('#fromLocationSelect').val();
  	var toLocation = $('#toLocationSelect').val();
  	print(fromLocation);
  	print(toLocation);

  	var params = {
      'startDate': startDate,
      'endDate': endDate,
      'fromLocation': fromLocation,
      'toLocation': toLocation
  	};

    gooru.fetchResults_(params);
  });

  $('#scrapeEmailBtn').click(function(e) {
  	var emailText = $('#gmailNote').val();
  	print(emailText);
  	var cityInfo = cityparser.getCity(emailText);
  	print(cityInfo);
  	// Change the hash, and then fill in the values.
  	$('#startDateInput').val(cityInfo.startDate);
  	$('#endDateInput').val(cityInfo.endDate);

    var cityMapping = {
      'San Jose': 'SJC',
      'San Francisco': 'SFO'
    };
  	var cityToName = cityMapping[cityInfo.toLocation];
  	$('#toLocationSelect').val(cityToName);

  	window.location.hash = '#preferences';
  });
};


controller.insertTemplates = function() {
  function loadTemplate(tObj) {
    $.get(tObj.path, function(templateText){
      var text = '<script id="' + tObj.id + '" type="text/x-jquery-tmpl">' + 
               templateText + '</script>';
      $('body').append(text);
    });
  }

  var templates = [
    {path: 'proj/education/js/_searchResult.htm', id: 'searchResultTmpl'}
  ];

  for (var i = 0; i < templates.length; i++) {
    loadTemplate(templates[i]);
  }
};

$(document).ready(controller.init_);

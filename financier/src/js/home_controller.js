// To control all the main interactions on the finance page.
var controller = {};

controller.init_ = function() {
	$('ul.tabs').each(function(){
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
	});

  controller.insertTemplates();
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
    {path: 'js/stockhistory/table.html', id: 'myTemplate'}
  ];

  for (var i = 0; i < templates.length; i++) {
    loadTemplate(templates[i]);
  }
};

$(document).ready(controller.init_);

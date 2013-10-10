var gooru = {};
gooru.resultElId = 'searchGooruResults';

gooru.renderResults_ = function(response) {
  print(response);
  $('#myDialog').dialog();
  /*
  $('#' + gooru.resultElId).html('');
  var el = $('#' + gooru.resultElId);
  if (response.results.length == 0) {
    el.html('No results sorry!');
    return;
  }
  var table = $('<table></table>');
  el.append(table);
  var searchResultTmpl = $('#searchResultTmpl');
  $.tmpl(searchResultTmpl, response.results).appendTo(table); */
};

gooru.renderErrorResults_ = function(xhr, textStatus, errorThrown) {
  $('#' + gooru.resultElId).html('');
  $('#' + gooru.resultElId).html('Boo gooru results failed.');
};

// Object with all the key value pairs needed.
gooru.buildRequestUrl_ = function(params) {
  var reqUrl = '/initiate_trigger?';
  for (var key in params) {
    reqUrl += key + '=' + params[key] + '&';
  }
  return reqUrl;
};

gooru.fetchResults_ = function(params) {
  $.ajax({
    dataType: 'json',
    url: gooru.buildRequestUrl_(params),
    success: gooru.renderResults_,
    error: gooru.renderErrorResults_
  });
};

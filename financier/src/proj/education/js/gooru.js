var gooru = {};
gooru.resultElId = 'searchGooruResults';

gooru.renderResults_ = function(response) {
  $('#' + gooru.resultElId).html('');
  var el = $('#' + gooru.resultElId);
  if (response.results.length == 0) {
    el.html('No results sorry!');
    return;
  }
  var table = $('<table></table>');
  el.append(table);
  var searchResultTmpl = $('#searchResultTmpl');
  $.tmpl(searchResultTmpl, response.results).appendTo(table); 
};

gooru.renderErrorResults_ = function(xhr, textStatus, errorThrown) {
  $('#' + gooru.resultElId).html('');
  $('#' + gooru.resultElId).html('Boo gooru results failed.');
};

gooru.buildRequestUrl_ = function() {
  var reqUrl = '/gooru?';
  var params = {};
  params['query'] = $('#searchGooruInput').val();
  for (var key in params) {
    reqUrl += key + '=' + params[key] + '&';
  }
  return reqUrl;
};

gooru.fetchResults_ = function(opt_e) {
  $.ajax({
    dataType: 'json',
    url: gooru.buildRequestUrl_(),
    success: gooru.renderResults_,
    error: gooru.renderErrorResults_
  });
};

gooru.init_ = function() {
  $('#searchGooruInput').bind('keypress', function(e) {
    if (e.keyCode == 13) {
      // Enter pressed.
      gooru.fetchResults_();
    }
  });
};

$(document).ready(gooru.init_);

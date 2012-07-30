var hist = {};

hist.renderResults_ = function(response) {
  window.console.log(response);
  var resultArea = $('#StockHistoryResults');
  // Clear previous results.
  $('#StockHistoryResults').html('');
  var table = $('<table class="niceTable"></table>');
  for (var ind in response.results) {
    var result = response.results[ind];
    var row = $('<tr></tr>');
    for (var colInd in result.cols) {
      var colText = result.cols[colInd];
      row.append('<td>'+ colText +'</td>');
    }
    table.append(row);
  }
  resultArea.append(table);
};

hist.renderErrorResults_ = function(xhr, textStatus, errorThrown) {
	console.log(xhr);
	console.log(textStatus);
  window.console.log('Boo stock history results failed.');
};

hist.buildRequestUrl_ = function() {
  var requestUrl = '/stock_history_results?';
  var params = {};
  params['whichYear'] = $('#whichYear').val();
  params['ticker'] = $('#ticker').val();
  for (var key in params) {
    requestUrl += key + "=" + params[key] + "&";
  }
  return requestUrl;
};

hist.fetchResults_ = function(opt_e) {
  $.ajax({
      dataType: 'json',
      url: hist.buildRequestUrl_(),
      success: hist.renderResults_,
      error: hist.renderErrorResults_
    });
};

hist.addYearOptions_ = function() {
  var options = '';
  for (var year = 2012; year > 1999; year--) {
    options += '<option value="'+ year + '">' + year + '</option>';
  }
  $('#whichYear').html(options);
};

hist.init_ = function() {
  hist.addYearOptions_();
  $('#runStockHistory').click(hist.fetchResults_);
  hist.addTickerAutocomplete();
};

hist.addTickerAutocomplete = function() {
  var onSuggestionSelected = function(value, data) {
    $('#ticker').val(data);
  };

  var options, a;
  jQuery(function(){
    options = { 
      serviceUrl:'/ticker_symbol_suggestions',
      onSelect: onSuggestionSelected
    };
    a = $('#ticker').autocomplete(options);
  });
};

$(document).ready(hist.init_);

var sim = {};

sim.renderResults_ = function(response) {
  mixpanel.track("Simulation results returned.");
  window.console.log(response);
  var resultArea = $('#SimulationResults');
  // Clear previous results.
  $('#SimulationResults').html('');
  for (var ind in response.results) {
    var resultText = response.results[ind];
    var resultNode = '<div>' + resultText + '</div>';
    resultArea.append(resultNode);
  }
};

sim.renderErrorResults_ = function(xhr, textStatus, errorThrown) {
  window.console.log('Boo simulation results failed.');
};

sim.buildRequestUrl_ = function() {
  var requestUrl = '/simulation_results?';
  var params = {};
  params['numYears'] = $('#numYears').val();
  for (var key in params) {
    requestUrl += key + "=" + params[key] + "&";
  }
  return requestUrl;
};

sim.fetchResults_ = function(opt_e) {
  $.ajax({
      dataType: 'json',
      url: sim.buildRequestUrl_(),
      success: sim.renderResults_,
      error: sim.renderErrorResults_
    });
}


sim.init_ = function() {
  $('#runSimulation').click(sim.fetchResults_);
};

$(document).ready(sim.init_);

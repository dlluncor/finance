var Pearsonstat = function(valuesObj) {
	this.valuesObj = valuesObj;
};

Pearsonstat.prototype.getMeanofMeans_ = function() {
  // Get means of all the values.
  var sum = 0;
  var n = 0;
  for (var groupId in this.valuesObj) {
  	var values = this.valuesObj[groupId];
  	values.forEach(function(val) { sum += val; n += 1;});
  }
  return sum / n;
};

Pearsonstat.prototype.computeChiSquare = function() {
	var m = 2; // 2 groups in the chi square test. (F stat is a generalization.)

    var expectedVals = this.valuesObj[0];
    var observedVals = this.valuesObj[1];
    var n = expectedVals.length; // Number of comparisons.
    var chiSquare = 0;
    for (var i = 0; i < n; ++i) {
    	var control = expectedVals[i];
    	var exp = observedVals[i];
    	chiSquare += Math.pow((exp - control),2) / control;
    }
    var df = n - 1;
    var alpha = 0.05;
    var critical_val = parseFloat(chisquaretable[df][alpha]);
    var is_sig = Math.abs(chiSquare) > critical_val;
	return {
		'chiSquare': chiSquare,
		'critical_val': critical_val,
		'is_sig': is_sig,
		'alpha': alpha
	};
};

var pearsonhelper = {};

pearsonhelper.runStats = function() {
  var csvText = $('#pearson-chi-csv').val();
  var valuesObj = MyCsv.parseCsv(csvText);
  var stat = new Pearsonstat(valuesObj);
  var fstatObj = stat.computeChiSquare();
  $('#pearson-chi-results').html('');
  $('#pearson-chi-results').append($('<span>' + JSON.stringify(fstatObj) + '</span>'));
};
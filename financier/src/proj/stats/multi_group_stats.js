var Multistat = function(valuesObj) {
	this.valuesObj = valuesObj;
};

Multistat.prototype.getMeanofMeans_ = function() {
  // Get means of all the values.
  var sum = 0;
  var n = 0;
  for (var groupId in this.valuesObj) {
  	var values = this.valuesObj[groupId];
  	values.forEach(function(val) { sum += val; n += 1;});
  }
  return sum / n;
};

Multistat.prototype.computeFStat = function() {
	var m = Object.keys(this.valuesObj).length;  // number of groups.
	var n = this.valuesObj[0].length; // number of data points of 0th group.

    var sst = 0; // sum of squares total.
    var ssw = 0; // sum of squares within.
    var ssb = 0; // sum of squares between.
    var uu = this.getMeanofMeans_(); // Mean of means.

	for (var groupId in this.valuesObj) {
		var values = this.valuesObj[groupId];
		var uIth = MyMath.mean(values); // mean of i'th group.
		values.forEach(function(val) {
			sst += Math.pow(val - uu, 2);
			ssw += Math.pow(val - uIth, 2);
			ssb += Math.pow(uIth - uu, 2);
		});
	}

    var fstat = (ssb / (m-1)) / (ssw / (m * (n -1)));

    var df2 = m * (n - 1); // df of denom.
    var df1 = m - 1; // df of numerator.

    if (df2 > 120) { df2 = 150; }
    if (df1 > 120) { df1 = 150; }

    var critical_f = parseFloat(ftable[df2][df1]);
    is_sig = Math.abs(fstat) > critical_f;
	return {
		'fstat': fstat,
		'sst': sst,
		'ssw': ssw,
		'ssb': ssb,
		'critical_f': critical_f,
		'is_sig': is_sig,
		'alpha': 0.05
	};
};

var multihelper = {};

multihelper.runStats = function() {
  var csvText = $('#multi-distrib-csv').val();
  var valuesObj = MyCsv.parseCsv(csvText);
  var stat = new Multistat(valuesObj);
  var fstatObj = stat.computeFStat();
  $('#multi-results').html('');
  $('#multi-results').append($('<span>' + JSON.stringify(fstatObj) + '</span>'));
};
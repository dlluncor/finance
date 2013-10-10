var work1 = {};

work1.work = function() {
  var before = new Date();
  var bodyDiv = 'body';
  for (var i = 0; i < 1000000; i++) {
    var div = 'div';
    div += i;
    bodyDiv += 'div ' + div;
  }
  var after = new Date();
  return (after - before);
};

var worker = {};

worker.main = function() {
  var blob = new Blob([document.querySelector('#woah').textContent]);
  var workerName = window.URL.createObjectURL(blob);
  var startTime = new Date();

  for (var i = 0; i < 7; i++) {
    var worker = new Worker(workerName);
    var div = document.getElementById('messages');
    worker.addEventListener('message', function(e) {
      var msg = 'Worker ' + e.data.input.which + ' said: ' + e.data.message;
      var child = document.createElement('div');
      child.innerHTML = msg;
      div.appendChild(child);
      console.log(msg);
    });
    var loc = document.location.href;

    worker.postMessage({url: loc, startTime: startTime, which: i});
    //setTimeout(postIt, 1);
  }
};

// This file deals with hitting the proxy service to get JSON from any endpoint.

// url - string - url to get JSON from.
// callback - callback which will be given the JSON response.
FetchJSON = function(url, callback) {
  var json = null;
  function successF(data){
  	callback(JSON.parse(data));
  }

  $.ajax({
      url: '/getjson?query=' + encodeURIComponent(url),
      success: successF
   });
};
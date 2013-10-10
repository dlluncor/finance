var cmaps = {};

// Showing the map.

cmaps.showMap = function(y, x) {

  var onLogin = function() {
    window.console.log('On login being called.');
  };

  var prefs = {
    mapTypeId: intel.maps.MapTypeId.ROADMAP,
    zoom: 13,
    center: new intel.maps.LatLng(y, x),
    login: {
      contextUrl: 'https://api.intel.com/location/',
      clientId: C.clientId,
      accessToken: C.token,
      clientSecret: C.secretId,
      callback: onLogin
    }
  };
  ctrl.map = new intel.maps.Map(
      document.getElementById('booty_map'), prefs);
  cmaps.poiSearch();
};

cmaps.drawPopup = function(e, marker) {
  $('.popupCard').remove();

  var div = $('<div style="position:absolute;"></div>');
  div.css('left', e.x + 'px');
  div.css('top', e.y + 'px');
  div.addClass('popupCard');
  div.text(marker.title);
  $('body').append(div);
};

cmaps.search_results = function(response, status) {
            if(!(response === undefined)){
               if (status == intel.maps.GeocoderStatus.OK) {
                  if(response.results.length == 0)
                     alert("Geocoder returned no matches: ZERO_RESULTS");
                  else{ 
                     var c = response.results[0];
                     point = new intel.maps.LatLng(c.geoPoint.y, c.geoPoint.x);
                     var bounds = new intel.maps.LatLngBounds(point,point);
                     for (var i = 0; i < response.results.length; ++i) {
                        var r = response.results[i];
                        var point = null; 
                        var title = null;
                        point = new intel.maps.LatLng(r.geoPoint.y, r.geoPoint.x);
                        if(r.description !== undefined) { 
                          title = r.description;
                        }
                        else {
                           title = r.name+(r.street == null ? "" : ", "+r.street )+(r.city == null ? "" : ", "+r.city)+(r.state == null ? "" : ", "+r.state)+(r.countryCode == null ? "" : ", "+r.countryCode);
                        }
                        var marker = new intel.maps.Marker({
                           position:point, 
                           title:title, 
                           map:ctrl.map});

                        bounds.extend(point);

                        var onMarkerClick = function(mark) {
                           return function(e) {
                             window.console.log(mark);
                             window.console.log(e);
                             window.console.log('marker clicked');
                             cmaps.drawPopup(e, mark);
                           };
                        };

                        intel.maps.event.addListener(marker, 'click', onMarkerClick(marker));
                        intel.maps.event.addListener(marker, 'mousedown', onMarkerClick(marker));
                     }
                     ctrl.map.fitBounds(bounds);
                     if (response.results.length == 1)
                        ctrl.map.setZoom(15);      
                  }
               } else alert("Geocoder returned no matches: " + response);
            }
         }

cmaps.poiSearch = function() {
  var coder = new intel.maps.Geocoder();
  coder.poi({
    'name': 'club',
    'categoryId': 'nightlife',
    'bounds': ctrl.map.getBounds()
  }, cmaps.search_results);
  setTimeout(cmaps.search_results, 5000);
};

function geo_results(response, status) {
            if(!(response === undefined)){
               if (status == intel.maps.GeocoderStatus.OK) {
                  if(response.results.length == 0)
                     alert("Geocoder returned no matches: ZERO_RESULTS");
                  else{ 
                     var c = response.results[0];
                     cmaps.showMap(c.geoPoint.y, c.geoPoint.x);
                  }
            }
         }
}

cmaps.geocode = function() {
   var address = $('#booty_address').val();
   var coder = new intel.maps.Geocoder();
   coder.geocode({'address':address, region:'US'}, geo_results);
   setTimeout(geo_results, 20000);
}
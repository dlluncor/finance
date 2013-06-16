// Learn angular js.
// Stripe - payments

var ctrl = {
	uProfile: null // user profile from Intel.
};

// Global constants.
var C = {
  clientId: '5adf540f141d748be136a56baeed4ed4',
  secretId: '02cd90339b8f0a8e'
};

// Ask the user to login.
ctrl.login = function() {
  var successCallback = function(data) {
    window.console.log('success logging in! ');
    window.console.log(data);
    ctrl.nowLoggedIn();
  };

  var errorCallback = function(data) {
  	window.console.log('there was an error logging in ' + data);
  }

  intel.auth.login({
  	clientId: C.clientId,
  	secretId: C.secretId,
  	scope: 'user:details user:scope profile:full profile:full:write',
  	redirectUri: 'urn:intel:identity:oauth:oob:async',
    specs: 'location=1,status=1,scrollbars=1,width=700,height=400'
  }, successCallback, errorCallback);
};

// Update user profile information.
ctrl.updateUserProfile = function() {
  var successUpdateUserProfile = function(profile) {
    window.console.log('Sucess update user profile.');
    window.console.log(profile);
  };
  var errorCallback = function(data) {
    window.console.log('Update user profile failed.');
  };
  var profile = ctrl.uProfile;
  // Change what properties to update here.
  profile.basic.firstName = 'David';
  profile.update(successUpdateUserProfile, errorCallback);
};

ctrl.getUserProfile = function() {
  var successGetProfile = function(profile) {
  	window.console.log(profile);
  	ctrl.uProfile = profile;
  	ctrl.updateUserProfile();
  };
  var errorCallback = function(data) {
    window.console.log('Get user profile failed.');
  };
  intel.profile.getUserProfile(successGetProfile, errorCallback);
};

// TODO(dlluncor): don't know how to add random key value pairs yet...
ctrl.updateAppProfile = function() {
  addKeySuccess = function() {
    window.console.log('Add key works.');
  };

  addKey = function(myAppProfile, newKey, newValue) {
    myAppProfile.addKey({
      key: newKey,
      value: newValue,
      contentType: 'text/plain'
    }, addKeySuccess, null);
  }
  addKey(ctrl.appProfile, 'drinks', 'Stella');
};

ctrl.getAppProfile = function() {
  var errorCallback = function(data) {
    window.console.log('Get user application profile failed.');
  };
  var getProfile = function(appProfile) {
    window.console.log('Got the app profile.');
    window.console.log(appProfile);
    ctrl.appProfile = appProfile;
    ctrl.updateAppProfile();
  };
  intel.profile.getApplicationProfile(getProfile, errorCallback);
};

// Showing the map.

ctrl.showMap = function() {
  var onLogin = function() {
    window.console.log('On login being called.');
  };

  var map;
  var prefs = {
    mapTypeId: intel.maps.MapTypeId.ROADMAP,
    zoom: 13,
    center: new intel.maps.LatLng(45.52345, -122.676),
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
  ctrl.poiSearch();
};

function search_results(response, status) {
            document.getElementById("hiddenpane").style.display="none";
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
                            if(r.description !== undefined) 
                           title = r.description;
                        else
                           title = r.name+(r.street == null ? "" : ", "+r.street )+(r.city == null ? "" : ", "+r.city)+(r.state == null ? "" : ", "+r.state)+(r.countryCode == null ? "" : ", "+r.countryCode);
                        new intel.maps.Marker({position:point, title:title, map:map});
                        bounds.extend(point);
                     }
                     map.fitBounds(bounds);
                     if (response.results.length == 1)
                        map.setZoom(15);      
                  }
               } else alert("Geocoder returned no matches: " + response);
            }
         }
         
ctrl.poiSearch = function() {
  var coder = new intel.maps.Geocoder();
  coder.poi({
    'name': 'club',
    'categoryId': 'nightlife',
    'bounds': ctrl.map.getBounds()
  }, search_results);
  setTimeout(search_results, 5000);
};

// What gets called now the user is logged in.
ctrl.nowLoggedIn = function() {
  ctrl.getUserProfile();
  //ctrl.getAppProfile();
  ctrl.showMap();
};

ctrl.init_ = function() {
  window.console.log('yo man');
  ctrl.login();
};

/*
 * urn:intel:identity:oauth:oob:async
 * https://api.intel.com/js/location/v2/CodeGenerator/index.html
 */

$(document).ready(ctrl.init_);


// btoa (text to base64 binary encoded)
// atob (base64 binary to text)
// firefeed.io (Twitter just in JS)
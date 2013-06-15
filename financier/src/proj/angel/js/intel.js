
// Learn angular js.
// Stripe - payments

var ctrl = {};

// Ask the user to login.
ctrl.login = function() {
  var successCallback = function(data) {
    window.console.log('success logging in! ');
    window.console.log(data);
  };

  var errorCallback = function(data) {
  	window.console.log('there was an error logging in ' + data);
  }

  intel.auth.login({
  	clientId: '5adf540f141d748be136a56baeed4ed4',
  	secretId: '02cd90339b8f0a8e',
  	scope: 'user:details user:scope profile:full profile:full:write',
  	redirectUri: 'urn:intel:identity:oauth:oob:async',
    specs: 'location=1,status=1,scrollbars=1,width=700,height=400'
  }, successCallback, errorCallback);
};

ctrl.getUserProfile = function() {
  var uProfile;
  var successGetProfile = function(profile) {
  	window.console.log(profile);
  };
  var errorCallback = function(data) {
    window.console.log('Get user profile failed.');
  };
  intel.profile.getUserProfile(successGetProfile, errorCallback);
};

ctrl.init_ = function() {
  window.console.log('yo man');
  ctrl.login();
  ctrl.getUserProfile();
};

/*
 * urn:intel:identity:oauth:oob:async
 * https://api.intel.com/js/location/v2/CodeGenerator/index.html
 */

$(document).ready(ctrl.init_);
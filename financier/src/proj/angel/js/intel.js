// Learn angular js.
// Stripe - payments

var ctrl = {
	uProfile: null // user profile from Intel.
};

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

ctrl.updateUserProfile = function() {

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


// btoa (text to base64 binary encoded)
// atob (base64 binary to text)
// firefeed.io (Twitter just in JS)
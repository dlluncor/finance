
window.fbAsyncInit = function() {
    // init the FB JS SDK
    FB.init({
      appId      : '268702606603881',                        // App ID from the app dashboard
      channelUrl : 'http://localhost:8080/channel.html', // Channel file for x-domain comms
      status     : true,                                 // Check Facebook Login status
      xfbml      : true,                                 // Look for social plugins on the page
      cookies    : true
    });

    // Here we subscribe to the auth.authResponseChange JavaScript event. This event is fired
    // for any authentication related change, such as login, logout or session refresh. This means that
    // whenever someone who was previously logged out tries to log in again, the correct case below 
    // will be handled. 
    FB.Event.subscribe('auth.authResponseChange', function(response) {
      // Here we specify what we do with the response anytime this event occurs. 
      if (response.status === 'connected') {
        // The response object is returned with a status field that lets the app know the current
        // login status of the person. In this case, we're handling the situation where they 
        // have logged in to the app.
        testAPI();
      } else if (response.status === 'not_authorized') {
        // In this case, the person is logged into Facebook, but not into the app, so we call
        // FB.login() to prompt them to do so. 
        // In real-life usage, you wouldn't want to immediately prompt someone to login 
        // like this, for two reasons:
        // (1) JavaScript created popup windows are blocked by most browsers unless they 
        // result from direct interaction from people using the app (such as a mouse click)
        // (2) it is a bad experience to be continually prompted to login upon page load.
        FB.login();
      } else {
        // In this case, the person is not logged into Facebook, so we call the login() 
        // function to prompt them to do so. Note that at this stage there is no indication
        // of whether they are logged into the app. If they aren't then they'll see the Login
        // dialog right after they log in to Facebook. 
        // The same caveats as above apply to the FB.login() call here.
        FB.login();
      }
    });

    function testAPI() {
        console.log('Welcome!  Fetching your information.... ');
        FB.api('/me', function(response) {
        console.log('Good to see you, ' + response.name + '.');
        fbInit_();
      });
    };
    // Additional initialization code such as adding Event Listeners goes here.
  };

  // Load the SDK asynchronously
  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/all.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));


Fber = function() {

  var tryAgain = function() {
    if (!window['FB']) {
      window.setTimeout(function() {
        tryAgain();
      }, 150);
    }
  }
  tryAgain();

  this.resp = null;
}

Fber.prototype.call = function(callback) {
  var that = this;
  FB.api('/me?fields=id,friends.fields(name,gender,id,picture),name,picture',
    function(response) {
      that.resp = response;
      window.console.log(response);
      callback();
  });
 }

// Get this many pictures at random.
Fber.prototype.getRandomPictures = function(numPics) {
  var friendData = this.resp.friends.data;
  var numFriends = friendData.length;
  var pics = [];
  for (var i = 0; i < numPics; i++) {
    var ind = Math.floor(Math.random() * numFriends);
    var url = friendData[ind].picture.data.url;
    url = url.replace('_q.jpg', '_n.jpg');
    pics.push(url);
  }
  return pics;
};
// Remote family holiday cards. Remote Christmas cards.


// video - Video jquery element
// subscribers - array of subscriber video feeds.
// publisher - a reference to my video feed
var todoc = {
  session: null,
  video: null, 
  subscribers: [],
  publisher: null
};

function sessionConnectedHandler(event) {
  var publisher = TB.initPublisher(todoc.apiKey, 'myPublisherDiv');
  todoc.publisher = publisher;
  todoc.session.publish(publisher);

  // Subscribe to streams that were in the session when we connected
  subscribeToStreams(event.streams);

  window.console.log('SESSION CONNECTED');
}

function streamCreatedHandler(event) {
  // Subscribe to any new streams that are created
  subscribeToStreams(event.streams);
  window.console.log('STREAM CREATED');

  // Video is ready at this point.
   // We want to save the video div as well.
  todoc.video = $($('video')[0]);
  
}

function subscribeToStreams(streams) {
  for (var i = 0; i < streams.length; i++) {
    // Make sure we don't subscribe to ourself
    if (streams[i].connection.connectionId == todoc.session.connection.connectionId) {
      return;
    }

    // Create the div to put the subscriber element in to
    var div = document.createElement('div');
    div.setAttribute('id', 'stream' + streams[i].streamId);
    $('#videoDiv').append(div);
    $(div).css('display', 'inline-block');

    // Subscribe to the stream
    todoc.subscribers.push(todoc.session.subscribe(streams[i], div.id));
  }
}

todoc.init_ = function() {
  avs.init();

  todoc.apiKey = '100';
  todoc.sessionId = todoc.getSessionId();
  todoc.token = todoc.getToken(); // user id.

  // Enable console logs for debugging
  TB.setLogLevel(TB.DEBUG);

  // Initialize the video stream for a user.
  todoc.session = TB.initSession(todoc.sessionId);
  todoc.session.connect(todoc.apiKey, todoc.token);
  todoc.session.addEventListener("sessionConnected", sessionConnectedHandler);
  todoc.session.addEventListener("streamCreated", streamCreatedHandler);
};


// Get the session for each user.
todoc.getSessionId = function() {
  return "2_MX4xMDB-flNhdCBBcHIgMDYgMTg6MDY6MTQgUERUIDIwMTN-MC43MzY3ODgyfg";
};

// Get the token for each user.
todoc.getToken = function() {
  var token0 = 'T1==cGFydG5lcl9pZD0xMDAmc2lnPWU0ZjEwNGQwNzk0YWEyYWJiNDU1NzI3NDMwY2U2Y2Q4NDY0NjVlMDI6cm9sZT1wdWJsaXNoZXImc2Vzc2lvbl9pZD0yX01YNHhNREItZmxOaGRDQkJjSElnTURZZ01UZzZNRFk2TVRRZ1VFUlVJREl3TVROLU1DNDNNelkzT0RneWZnJmNyZWF0ZV90aW1lPTEzNjUyOTY3ODkmbm9uY2U9MC40ODA3MzUxMjU5NzYzNjQwMyZleHBpcmVfdGltZT0xMzY3ODgyNTE1';
  return token0;
};

todoc.handleButton = function() {
  var selectVal = $('#vidSelect').val();
  window.console.log(selectVal);

  if (selectVal == 'Gameshow enter') {
    todoc.video.removeClass();
    todoc.video.addClass('vid-entry');
  } else if (selectVal == 'Angry') {
    todoc.video.removeClass();
    todoc.video.addClass('no-duration');
    todoc.video.addClass('vid-angry');
  } else if (selectVal == 'Feeling sad') {
    todoc.video.removeClass();
    todoc.video.addClass('no-duration');
    todoc.video.addClass('vid-sick');
  }

  else if (selectVal == 'Snap photo!') {
    todoc2.getImages();
  }
};

// TODO: You can make animated gifs as well!!!!!

// TODO: How do I propogate messages to another client?. Web sockets?
// Get a panel of people to communicate with each other.

// Flip video 180deg and multiply the videos all over the place.


// Todoc helper for making images.
var todoc2 = {};

// Appends an image from a streamer.
todoc2.appendImage = function(streamer) {
  var data = streamer.getImgData();
  var img = new Image();
  img.src = "data:image/png;base64," + data;
  $('#imageContainer').append(img);
  img.onload = function() {
    todoc2.totalWidth += this.width;
    this.originalWidth = this.width;
    if (this.height > todoc2.maxHeight) {
      todoc2.maxHeight = this.height;
    }
    this.width = 320;
    this.height = 240;
  }
};

todoc2.getImages = function() {
  // We can save the image here before clearing it for a gif.
  $('#imageContainer').html(''); // Clear of previous images.
  todoc2.totalWidth = 0;
  todoc2.maxHeight = 0;
  var canvas = document.getElementById("bigCanvas");

  // Populate array of images.
  for (var i = 0; i < todoc.subscribers.length; i++) {
    var streamer = todoc.subscribers[i];
    if (!streamer) {
      continue;
    }
    todoc2.appendImage(streamer);
  }
  todoc2.appendImage(todoc.publisher);

  // Stitch images together and retrieve a base64 image.
  // Wait one cycle for the data to be rendered to the dom
  var makeAnImage = function() {
    canvas.width = todoc2.totalWidth;
    canvas.height = todoc2.maxHeight;
    var ctx = canvas.getContext('2d');
    var startX = 0;
    var startY = 0;
    var images = $("#imageContainer img");
    for (var i = 0; i < images.length; i++) {
      ctx.drawImage(images[i], startX, 0); // y's are all the same.
      startX += images[i].originalWidth;
      startY += images[i].originalHeight;
    }
    
    var base64Data = canvas.toDataURL('image/png');
    var resultImage = $('<img />', {id: 'resultImageId'});
    resultImage.attr({src:base64Data, height:240});
    window.resultImage = resultImage;
    $('#imageContainer').html(resultImage);
  };

  var launchAviary = function() {
    var imSrc = $('#resultImageId').attr('src');
    avs.featherEditor.launch({image: 'resultImageId', url:imSrc});
  };

  window.setTimeout(function() {
    makeAnImage();
    window.setTimeout(function() {
      launchAviary();
    }, 20);
  }, 300);

  // TODO
  // flash photo API. to crop and manipulate images.
  // s3 file storage API. to storage images
  // 500px for the background.
  // Make an awesome looking photo!
};

// Initialize aviary
// featherEditor - aviary feather editor.
var avs = {
  featherEditor: null
};

avs.init = function() {
  var aviaryKey = 'z6LRPsnz2U-AkufrCO2WXg';

  // Initialize Aviary's Feather editor
  avs.featherEditor = new Aviary.Feather({
    apiKey: aviaryKey,
      apiVersion: 2,
      onSave: function(imageID, newURL) {
        avs.featherEditor.close();
        $("#aviaryResult").attr("src", newURL);
        $('#aviaryText').removeClass();
        $("#overlay").slideDown('fast');
        return false;
      }
  });
};

// Get parameters from hash.
getParams = function() {
  var hash = window.location.hash;
  hash = hash.substring(1);
  var params = {};
  hash.split('?').forEach(function(keyVal) {
    var pair = keyVal.split('=');
    params[pair[0]] = pair[1];
  });
  window.console.log(params);
  return params;
};

$(document).ready(todoc.init_);
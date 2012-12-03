// This logic makes the game multiplayer.
var StateHelper = function() {
  this.state_ = {
    gameStatus: 'notReady',
    action: '' // action that the caller issued.
  };
};

// Game status.
// notReady - page just loaded, nothing is happening.
// ready - I clicked start I'm ready to go.
// won - I just won the game, I'm awesome!
StateHelper.prototype.setGameState = function(gameStatusVal) {
  this.state_['gameStatus'] = gameStatusVal; 
};
StateHelper.prototype.getGameState = function() {
  return this.state_['gameStatus'];
};

// What the action or questioned was asked of me?
// Values:
// askReady. Are you ready to start partner?
// startTimer. When I was the first person to ask if you were ready and you told
//  me that you are ready so I should start my timer.
// askWon. When I just finished the game, and I want to know if I won.
// ackWon. Acknowledgement to let the other user they did indeed win and I lost.

StateHelper.prototype.setAction = function(actionVal) {
  this.state_['action'] = actionVal; 
};
StateHelper.prototype.getAction = function() {
  return this.state_['action'];
};


// Updates the entire internal data structure.
StateHelper.prototype.updateEntireState = function(newStateJson) {
  this.state_ = newStateJson;
};

StateHelper.prototype.asJson = function() {
  return this.state_;
};


// State controller.
var StateController = function() {
};

// Main controller logic for how to proceed next.
StateController.prototype.handleStates = function(myStateHelper, partnerStateHelper) {
  var myState = myStateHelper.getGameState();
  var partnerState = partnerStateHelper.getGameState();
  var partnerAction = partnerStateHelper.getAction();

  // Partner just asked me if i'm ready and i'm not. i'll set myself to
  // ready, start my timer and tell him i'm ready.
  if (myState == 'notReady' && partnerState == 'ready' && partnerAction == 'askReady') {
    // Start timer to start and let partner know he can start too.
    myStateHelper.setGameState('ready');
    myStateHelper.setAction('startTimer');
    app.startGlobalTimer();
    app.sendState();
    app.disableStartButton();
  } else if (partnerAction == 'startTimer') {
    app.startGlobalTimer(); // No need to send state at this point.
    app.disableStartButton();
  }

  // now we get into the winning questions.
  else if (partnerAction == 'askWon' && myState != 'won') {
    // Then I lost, shit, I need to tell my partner he won.
    myStateHelper.setGameState('lost');
    myStateHelper.setAction('ackWon');
    app.updateMessageToUser('You lost :( Try again?');
    ctrl.clearCanvas(); 
    app.enableStartButton();
    app.sendState();
    app.initialize(); 
  } else if (partnerAction == 'ackWon') {
    // Yes your partner told you won go ahead and rub it in his face.
    app.updateMessageToUser('You won in ' + ctrl.timeElapsed + ' secs!!! Try again?');
    app.enableStartButton();
    app.sendState(); //TODO: don't think I need to send state here.
    app.initialize();
  }
  else if (partnerAction == 'askWon' && myState == 'won') {
    // I won and my partner asked if I won, then we tied!
    app.updateMessageToUser('You tied wow! Try again?');
    app.enableStartButton();
    app.initialize();
    myStateHelper.setAction('askWon'); 
    //app.sendState(); // We should have already sent these messages to each other right?
  }
};


// Global controller state for the application.
var app = {};
app.debug = false;

app.initialize = function() {
  // State of the application
  app.myHelper_ = new StateHelper(); // wrapper around the state.
  app.partnerHelper_ = new StateHelper();
  app.stateController_ = new StateController();
};

app.initialize();

// Called when the page loads.
app.pageLoad = function() {
  // Sets up a click handler on the start button.
  $('#startButton').click(function() {
    $('#startButton').html('Start');
    app.askIfPartnerReady();
  });
  // Sets up click handler on the go back button.
  $('#backarrow').click(function() {
    Android.redirect('http://lluncorstock.appspot.com/gameportal');
  });
};

// If you are the first person to click on start, then you can ask
// if the partner is ready to start.
app.askIfPartnerReady = function() {
  app.myHelper_.setGameState('ready');
  app.myHelper_.setAction('askReady');
  app.updateMessageToUser('Waiting for other player');
  app.sendState();
};

// If you are the first person to win presumably, you have to find out
// whether your partner has not finished yet.
app.askIfWon = function() {
  app.myHelper_.setGameState('won');
  app.myHelper_.setAction('askWon');
  app.sendState();
};

app.receiveMessage = function(jsonString) {
  if (app.debug) {
    $('#message').html('Receiving message: ' + jsonString);
  }
  var partnerStateJson = JSON.parse(jsonString);
  app.receiveState(partnerStateJson);
};

// Receives the state from the partner.
app.receiveState = function(partnerStateJson) {
  if (app.debug) {
    $('#message').html('Partners state is: ' + JSON.stringify(partnerStateJson) +
                       ' my state is: ' + JSON.stringify(app.myHelper_.asJson()));
  }
  // Update the state of my partner.
  // TODO: remove line below if I need to know about states.
  app.partnerHelper_.updateEntireState(partnerStateJson);
  app.stateController_.handleStates(app.myHelper_, app.partnerHelper_);
};

// Sends its state to the partner.
app.sendState = function() {
  var stateAsStr = JSON.stringify(app.myHelper_.asJson());
  jibe.sendMessage(stateAsStr);
};

// Start the timer which will then trigger init.
app.startGlobalTimer = function() {
  // Count down from 3.
  var numSecs = 3;
  var ctr = 0;
  var wnd = window; 
  var interval = setInterval(function() {
    // At the end of 3 seconds ready to play!
    ctr++;
    app.updateMessageToUser('Ready in ' + (numSecs - ctr));
    if (ctr == numSecs) {
      app.updateMessageToUser('Go!');
      ctrl.init();
      wnd.clearInterval(interval); 
    }
  }, 1000);
  app.updateMessageToUser('Ready in ' + numSecs);
};

// Update the message that the user sees about the state of the game flow.
app.updateMessageToUser = function(message) {
  $('#startButton').html(message);
};

app.disableStartButton = function() {
  $('#startButton').attr('disabled', 'disabled');
};

app.enableStartButton = function() {
  $('#startButton').removeAttr('disabled');
};


// Communication with Android

/**
 * Definition of jsonString message.
 * {state: 'win|init|readyToStart'
 *
 *
 *
 *  }
 */
var jibe = {};

jibe.sendMessage = function(jsonString) {
  //Our Android app will define a Android.sendMessage(jsonString)
  if (app.debug) {
    $('#message').html('Sending message: ' + jsonString);
  }
  Android.sendMessage(jsonString);
};

// jsonString will be defined by a class.
jibe.receiveMessage = function(jsonString) {
  app.receiveMessage(jsonString);
};

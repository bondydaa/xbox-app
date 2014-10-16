//creating fetchGame function to be used across app to grab games from server
var fetchGames = function(){
  gameCollection.fetch({
    success: function(models, options) {
      $('.ballot-list').find('li').each(function(i,v){
        $(v).remove();
      });
      $('.library-list').find('li').each(function(i,v){
        $(v).remove();
      });
      //seed games into proper collections - sets instead of add to "smart" merge models
      wantCollection.set( gameCollection.where({status: 'wantit'}) );
      ownCollection.set( gameCollection.where({status: 'gotit'}) );

      //sort collection
      wantCollection.sort();
      ownCollection.sort();

      //create views for these games
      wantCollection.createGameView(wantCollection.models);
      ownCollection.createGameView(ownCollection.models);

    },
    error: function(res, status) {
      //user friendly error message
      var message = 'Network or Server Issue, please try again.';
      showMessage(message);
    },
    // A timeout is the only way to get an error event for JSONP calls
    timeout : 5000
  });
};

// function to show error/alert messages
var showMessage = function(message){
  // grab DOM reference for elements
  var $messageWrap = $('.messages'),
      $message = $('.message');

  $message.text(message);
  $messageWrap.addClass('show');
};
// function to hide error/alert messages
var removeMessage = function() {
  // grab DOM reference for elements
  var $messageWrap = $('.messages'),
      $message = $('.message');

  // after 5 seconds, clear text from message and remove class show
  setTimeout(function(){
    $messageWrap.removeClass('show');
    $message.text(' ');
  }, 5000);
};

//using jQuery Cookie plugin (https://github.com/carhartl/jquery-cookie)
//get current day of week for users computer, set it in cookie that lasts a week
//0-Sun, 1-Mon, 2-Tues, etc
var date = new Date();
$.cookie('dayOfWeek', date.getUTCDay(), {expires: 7});

// start tracking url history
Backbone.history.start();

// instantiate collections
var gameCollection = new GameCollection(),
    wantCollection = new WantCollection(),
    ownCollection = new OwnCollection();

// fetch initial game data from server
//using add for first call, fetchGames() will call .set on collections
gameCollection.fetch({
  success: function(models, x, options) {
    //seed games into proper collections
    wantCollection.add( gameCollection.where({status: 'wantit'}) );
    ownCollection.add( gameCollection.where({status: 'gotit'}) );

    //create views for these games
    wantCollection.createGameView(wantCollection.models);
    ownCollection.createGameView(ownCollection.models);
  },
  error: function(res, status) {
    //user friendly error message
    var message = 'Network or Server Issue, please try again.';
    showMessage(message);
  },
  // A timeout is the only way to get an error event for JSONP calls
  timeout : 5000
});

//create new view for add game input
var addGameView = new AddGame({el: $('#add-game-form')});
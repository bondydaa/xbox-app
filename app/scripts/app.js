(function() {

//set default for game model
var GameModel = Backbone.Model.extend({
  defaults: {
    id: "",
    title: "",
    votes: 0,
    status: "wantit"
  }
});

var GameCollection = Backbone.Collection.extend({
  //default server endpoint with api for fetching
  url: 'http://js.november.sierrabravo.net/challenge/getGames?apiKey=9a87903ab5da1064a9c1e3a7e010c478',

  //overwrite the default sync with jsonp request, force GET, set caching
  sync: function(method, collection, options) {
    options.dataType = "jsonp";
    options.cache = true;
    options.type = 'GET';
    return Backbone.sync(method, collection, options);
  }
});


var OwnCollection = Backbone.Collection.extend({
  //tie GameModel to collection, sort collection by title
  model: GameModel,
  comparator: 'title',

  //create the game view and append it to the library list
  createGameView: function(models) {
    _.each(models, function(model){
      var view = new OwnGameView({model: model});

      $('.library-list').append(view.$el);
    });
  }

});

var WantCollection = Backbone.Collection.extend({
  //associate collection is GameModel
  //sort by votes in descending order
  model: GameModel,
  comparator: function(model){
    return -model.get('votes');
  },
  //create a view for each game we want, append it to the ballot list
  createGameView: function(models) {
    _.each(models, function(model){
      var view = new WantGameView({model: model});

      $('.ballot-list').append(view.$el);
    });
  }

});

var AddGame = Backbone.View.extend({
  //set events we want to listen for
  events: {
    'submit': 'addNewGame'
  },

  addNewGame: function(e){
    //game value of input, ensure a string
    //grab current day of month, ensure a string
    var newGame = this.$el.find('input').val().toString().toLowerCase(),
        dateObj = new Date(),
        currentDate = dateObj.getUTCDate().toString(),
        message;

    //set alert or error message - since multiple could be true, move game look up first, over writes message if you voted or its the weekend
    // message for game already in collection
    if( !!gameCollection.findWhere({title: newGame}) ) {
      message = 'This game is already on the ballot or owned, vote for it or add a new game.'
    };
    // message for trying to vote more than once a week
    if( $.cookie('voted') === currentDate ) {
      message = 'You already voted or added a game today! Try again tomorrow.'
    };
    // message for voting on the weekend
    if( $.cookie('dayOfWeek') === '6' || $.cookie('dayOfWeek') === '0' ) {
      message = 'You cannot vote on the weekend! Go outside and play!'
    };


    //check cookies to make sure it isn't Sat/Sun and user hasn't voted already yet
    //force findWhere into truthiness, .findWhere returns [] if not found which boolean is true so bang(!) will turn it into false and fail
    //putting findWhere last since cookies should be a quicker lookup
    //first check to make sure it is not Sun or Sat, then check if voted day is same as today (cookie only lasts 7 days)
    if( ( !($.cookie('dayOfWeek') === '6') || !($.cookie('dayOfWeek') === '0') ) && !( $.cookie('voted') === currentDate ) && !gameCollection.findWhere({title: newGame}) ) {
      //if true send new game to server then
      $.ajax({
        dataType: 'jsonp',
        cache: true,
        type: 'GET',
        url: 'http://js.november.sierrabravo.net/challenge/addGame',
        data: {
          'apiKey': '9a87903ab5da1064a9c1e3a7e010c478',
          'title': newGame
        },
        success: function(res, status){
          //fetch data from server
          fetchGames();

          //using jQuery Cookie plugin (https://github.com/carhartl/jquery-cookie)
          //get current day of week for users computer, set it in cookie that lasts a week
          //used for tracking if user has voted today or not
          var votedDate = new Date();
          $.cookie('voted', votedDate.getUTCDate(), {expires: 7});
        },
        error: function(res, status) {
          //display user friendly ajax error
          message = 'Network or Server Issue, please try again.';

          showMessage(message);
          removeMessage();
        }
      });

    } else {
      //if user has already voted or its the weekend display alert message or game is in collection
      showMessage(message);
      removeMessage();
    }

    //clear the input's text
    this.$el.find('input').val('')
    //stop form from trying to submit
    e.preventDefault();
  }
});

var OwnButton = Backbone.View.extend({
  //events to listen for on view
  events: {
    'click': 'markAsOwned'
  },

  //when button is clicked,  game id from html
  markAsOwned: function(e){
    var gameID = $(e.target).data('gameid');
    //make ajax call to set game as owned
    //on success fetch game collection
    $.ajax({
      dataType: 'jsonp',
      cache: true,
      type: 'GET',
      url: 'http://js.november.sierrabravo.net/challenge/setGotIt',
      data: {
        'apiKey': '9a87903ab5da1064a9c1e3a7e010c478',
        'id': gameID
      },
      success: function(res, status) {
        fetchGames();
      },
      error: function(res, status) {
        // user friendly message
        var message = 'Network or Server Issue, please try again.';

        showMessage(message);
        removeMessage();
      }
    });
  }

});

var OwnGameView = Backbone.View.extend({
  //wrap view in li element, give class of 'game'
  tagName: 'li',
  className: 'game',
  template: _.template('<h3 class="game-title"><%= title %></h3>'),

  //when view is created, call render function
  initialize: function(){
    this.render();
  },
  //take the html snippet, compile it, inject it into DOM
  render: function(){
    var rendered = this.template(this.model.toJSON());

    this.$el.html(rendered);
  }

});

var VoteButton = Backbone.View.extend({
  //events to listen for on view
  events: {
    'click': 'addVote'
  },

  //when button is clicked, grab game id from li
  //get the current day of month to validate previous votes
  addVote: function(e){
    var gameID = $(e.target).data('gameid'),
        dateObj = new Date(),
        currentDate = dateObj.getUTCDate().toString(),
        message;

    // set alert or error message
    // message for trying to vote more than once a week
    if( $.cookie('voted') === currentDate ) {
      message = 'You already voted today! Try again tomorrow.'
    };
    // message for voting on the weekend
    if( $.cookie('dayOfWeek') === '6' || $.cookie('dayOfWeek') === '0' ) {
      message = 'You cannot vote on the weekend! Go outside and play!'
    };


    //allow vote as long as it is not sunday or saturday and user hasn't voted yet
    //cookie only lasts 7 days so user will not have to worry about it next month
    if (( !($.cookie('dayOfWeek') === '6') || !($.cookie('dayOfWeek') === '0') ) && !( $.cookie('voted') === currentDate ) ) {
      $.ajax({
        dataType: 'jsonp',
        cache: true,
        type: 'GET',
        url: 'http://js.november.sierrabravo.net/challenge/addVote',
        data: {
          'apiKey': '9a87903ab5da1064a9c1e3a7e010c478',
          'id': gameID
        },
        success: function(res, status){
          fetchGames();

          //using jQuery Cookie plugin (https://github.com/carhartl/jquery-cookie)
          //get current day of week for users computer, set it in cookie that lasts a week
          //used for tracking if user has voted today or not
          var votedDate = new Date();
          $.cookie('voted', votedDate.getUTCDate(), {expires: 7});
        },
        error: function(res, status) {
          //user friendly message
          message = 'Network or Server Issue, please try again.';

          showMessage(message);
          removeMessage();
        }
      });
    } else {
      //if user has already voted or its the weekend display alert message
      showMessage(message);
      removeMessage();
    }

  }
});

var WantGameView = Backbone.View.extend({
  tagName: 'li',
  className: 'game',
  //template for a game we want, needs more control than own'd games
  template: _.template('<button class="vote-btn" data-gameid="<%= id %>">Click to Vote!</button><h3 class="num-votes"><%= votes %></h3><h3 class="game-title"><%= title %></h3><button type="button" class="own-btn" data-gameid="<%= id %>">Mark as Own</button></li>'),

  //when view is created, call render function
  initialize: function(){
    this.render();
  },

  render: function(){
    //render template and inject into DOM
    var rendered = this.template(this.model.toJSON());
    this.$el.html(rendered);
    //create button view on newly created button, associate to model
    var voteButton = new VoteButton({el: this.$el.find('.vote-btn'), model: this.model});
    var ownButton = new OwnButton({el: this.$el.find('.own-btn'), model: this.model});
  }

});

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
      wantCollection.sort()
      ownCollection.sort()

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
  }, 5000)
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
    wantCollection = new WantCollection()
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

})();
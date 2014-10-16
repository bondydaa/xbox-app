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
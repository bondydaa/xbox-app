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
      message = 'You already voted today! Try again tomorrow.';
    }
    // message for voting on the weekend
    if( $.cookie('dayOfWeek') === '6' || $.cookie('dayOfWeek') === '0' ) {
      message = 'You cannot vote on the weekend! Go outside and play!';
    }


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
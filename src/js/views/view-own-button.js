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
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
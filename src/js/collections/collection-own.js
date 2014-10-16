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
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
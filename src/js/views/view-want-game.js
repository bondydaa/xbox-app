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
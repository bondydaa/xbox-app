//set default for game model
var GameModel = Backbone.Model.extend({
  defaults: {
    id: "",
    title: "",
    votes: 0,
    status: "wantit"
  }
});
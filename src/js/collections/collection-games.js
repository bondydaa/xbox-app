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

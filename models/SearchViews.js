'use strict';

var AlbumView = Backbone.View.extend({
  initialize: function() {
    this.render();
  }, 
  render: function() {
    this.$el.append(ejs.render(AlbumResultTemplate, this.model.toJSON()));
    this.stickit();
  },
  events: {
  
  },
  bindings: {
  
  }
});

define(['jquery', 'emitter'], 
  function($, Emitter) {
  var UserView = Emitter.extend({
    constructor: function(element, vm) {
      var view = this;

      view.$container = $(element);
      view.user = {};
      vm.addListener('who', function(user) {
        view.user = user;
        view.render();
      });
    },
    render: function() {
      this.$container.text("user: " + (this.user.id || "unknown"));
    }

  });

  return UserView;
});
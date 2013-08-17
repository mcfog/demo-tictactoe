(function() {

  require(['view/app'], function(AppView) {
    var view = new AppView(document.body);
    view.render();
  });

}).call(this);

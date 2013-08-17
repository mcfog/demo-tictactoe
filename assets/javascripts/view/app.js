define(['jquery', 'emitter', 'viewmodel/user', 'view/user', 'viewmodel/game', 'view/game'], 
  function($, Emitter, UserVM, UserView, GameVM, GameView) {
  var AppView = Emitter.extend({
    constructor: function(element) {
      
      this.user = new UserVM();
      this.game = new GameVM(this.user);

      this.userView = new UserView($('header', element), this.user);
      this.gameView = new GameView($('#game', element), this.game);
    },
    render: function() {
      this.userView.render();
      this.gameView.render();
    }

  });

  return AppView;
});
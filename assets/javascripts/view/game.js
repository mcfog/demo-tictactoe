define(['jquery', 'emitter'], 
  function($, Emitter) {
  var GameView = Emitter.extend({
    constructor: function(element, vm) {
      var view = this;

      view.$ = function(sel) {
        return $(sel, element);
      };
      view.vm = vm;

      $(element)
        .on('click', '#players button', bind(view.join))
        .on('click', '#battlefield .block', bind(view.commit))
        .on('click', '#reset', bind(view.reset))
        ;

      view.status = null;
      vm.addListener('sync', function(status) {
        view.status = status;
        view.render();
      });
      vm.addListener('join', function(k) {
        view.curPlayer = k;
        alert('成为了玩家' + (k == '0' ? 'o' : 'x'));
      });

      function bind(fn) {
        return function() {
          fn.apply(view ,arguments);
        }
      }
    },

    join: function(event) {
      var p = this.$(event.target).closest('[player]').attr('player');

      if(!p) return;
      this.vm.join(p);
    },

    commit: function(event) {
      var $blk = this.$(event.target);
      var x = $blk.attr('x');
      var y = $blk.attr('y');

      if(!x || !y || !this.curPlayer) return;
      this.vm.commit(x, y);
    },

    reset: function(event) {
      this.vm.reset();
    },

    render: function() {
      var view = this;
      if(!view.status) return;

      var player = view.status.player;
      var field = view.status.field;
      if(player[0] === null) {
        view.$('.player0').html('<button>加入</button>')
      } else {
        view.$('.player0').text(player[0]);
      }
      if(player[1] === null) {
        view.$('.player1').html('<button>加入</button>')
      } else {
        view.$('.player1').text(player[1]);
      }

      view.$('.player1, .player0').removeClass('winner');
      if(view.status.winner !== undefined) {
        view.$('.player' + view.status.winner).addClass('winner');
      }

      $.each(field, function(x) {
        $.each(this, function(y) {
          var cls = "blk_" + parseInt(this);
          view.$('.block[x=' + x + '][y=' + y + ']').removeClass().addClass('block ' + cls);
        });
      });



    }

  });

  return GameView;
});
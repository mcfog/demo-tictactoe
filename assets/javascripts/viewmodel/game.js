define(['jquery', 'emitter', 'socket.io'], function($, Emitter, io) {
  return Emitter.extend({
    constructor: function(user) {
      var vm = this;
      vm.socket = io.connect('/tictactoe');

      $.each(['sync', 'join'], function() {
        vm.socket.on(this, bind(vm['on_' + this]));
      });

      function bind(fn) {
        return function() {
          fn.apply(vm ,arguments);
        }
      }
    },
    join: function(p) {
      this.socket.emit('join', p, function(err) {
        if(err) {alert(err)};
      });
    },
    on_join: function(k) {
      this.curPlayer = k;
      this.emit('join', k);
    },

    commit: function(x, y) {
      this.socket.emit('commit', x, y, function(err) {
        if(err) {alert(err)};
      });      
    },
    reset: function() {
      this.socket.emit('reset');
    },
    on_sync: function(status) {
      this.emit('sync', status);
    }
  });
});
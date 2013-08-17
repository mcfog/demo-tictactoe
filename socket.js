var _ = require('lodash');

exports.listen = function(server) {
  var io = require('socket.io').listen(server);

  io.of('/user').on('connection', function(socket) {

    who();
    socket.on('who', who);

    function who() {
      socket.emit('who', {
        id: socket.id
      });
    }
  });


  (function(io) {
    var store = {};
    reset();

    io.on('connection', function(socket) {
      socket.on('join', function(k, ack) {
        if(store.player[k]) {
          ack(store.player[k]);
          return;
        }
        if(store.player.indexOf(socket.id) != -1) {
          ack('不能左右互搏');
          return;
        }
        store.player[k] = socket.id;
        
        sync();
        socket.emit('join', k);
        ack(null);

        socket.on('disconnect', function() {
          store.player[k] = null;
          sync();
        });
      });

      socket.on('commit', function(x, y, ack) {
        if(store.player[store.curPlayer] != socket.id) {
          return ack('现在不是你下子的时间');
        }
        if(!store.field[x] || store.field[x][y] === undefined) {
          return ack('overflow');
        }
        if(store.field[x][y] !== null) {
          return ack('已经有子了');
        }
        store.field[x][y] = store.curPlayer
        store.curPlayer = 1 - store.curPlayer;

        checkWin();
        sync();
      });

      socket.on('reset', reset);

      sync();
    });

    function sync() {
      io.emit('sync', store);
    }

    function reset() {
      store = {
        player: [null, null],
        field: [
          [null, null, null],
          [null, null, null],
          [null, null, null]
        ],
        curPlayer: 0
      };
      sync();
    }

    function checkWin() {
      var r3 = _.range(3);
      var f = store.field;

      try {
        _.each(r3, function(x) {
          check(f[x][0], f[x][1], f[x][2]);
          check(f[0][x], f[1][x], f[2][x]);
        });
        checkMap(function(x) {
          return f[x][x];
        });
        checkMap(function(x) {
          return f[x][2-x];
        });
      } catch(winner) {
        store.winner = winner;
      }

      function checkMap(cb) {
        check.apply(this, _.map(r3, cb));
      }
      function check(a,b,c) {
        if(a !== null && a === b && a === c) throw a;
      }
    }

  })(io.of('/tictactoe'));

  return io;
}
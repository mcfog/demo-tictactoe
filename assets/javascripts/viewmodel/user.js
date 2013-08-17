define(['jquery', 'emitter', 'socket.io'], function($, Emitter, io) {
  return Emitter.extend({
    constructor: function() {
      var vm = this;
      vm.socket = io.connect('/user');
      vm.socket.on('who', function(user) {
        vm.emit('who', user);
      })
    }
  });
});
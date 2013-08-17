define(['eventemitter2', 'extend'], function(EE, extend) {
  var Emitter = extend.call(EE);
  Emitter.extend = extend;
  
  return Emitter;
});
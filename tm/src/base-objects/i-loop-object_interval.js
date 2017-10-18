console.log('TM.ILoopObject_Interval loaded');

//=============================
// TM.ILoopObject_Interval
//=============================
TM.ILoopObject_Interval = function(){
  this.id = undefined;
  this.func = undefined;
  this.speed = undefined;
};
TM.ILoopObject_Interval.prototype.stop = function () {
  if(this.id) window.clearInterval(this.id);
  this.id = null;
};
TM.ILoopObject_Interval.prototype.start = function () {
  this.stop();
  var _self = this;
  this.id = window.setInterval(function(){
    _self.func();
  }, this.speed);
};
TM.ILoopObject_Interval.prototype.setSpeed = function (speed) {
  this.speed = speed;
  this.start();
};
TM.ILoopObject_Interval.prototype.init = function (speed,func) {
  this.speed = speed;
  this.func = func;
  this.start();
};

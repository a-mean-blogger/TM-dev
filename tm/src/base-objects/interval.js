//=============================
// TM.Interval
//=============================
TM.Interval = function(){
  this.id = null;
  this.func = null;
  this.speed = null;
};
TM.Interval.prototype.stop = function(){
  if(this.id) window.clearInterval(this.id);
  this.id = null;
};
TM.Interval.prototype.start = function(){
  this.stop();
  var _self = this;
  this.id = window.setInterval(function(){
    _self.func();
  }, this.speed);
};
TM.Interval.prototype.setSpeed = function(speed){
  this.speed = speed;
  this.start();
};
TM.Interval.prototype.init = function(speed,func){
  this.speed = speed;
  this.func = func;
  this.start();
};

//=============================
// TM.ILoopObject
//=============================
TM.ILoopObject = function(speed, data, skipInit){
  this.speed = speed;
  this.interval = new TM.Interval();
  TM.IObject.call(this, data, skipInit);
};
TM.ILoopObject.prototype = Object.create(TM.IObject.prototype);
TM.ILoopObject.prototype.constructor = TM.ILoopObject;

// TM.IObject functions inheritance
TM.ILoopObject.prototype.init = function(){
  TM.IObject.prototype.init.call(this);
  var _self = this;
  this.interval.init(this.speed, function(){
    if(_self.isActive) _self.calculate();
    if(_self.isActive) _self.draw();
  });
  this.draw();
};
TM.ILoopObject.prototype.destroy = function(){
  TM.IObject.prototype.destroy.call(this);
  this.interval.stop();
};

// TM.ILoopObject functions
TM.ILoopObject.prototype.calculate = function(){
  this._calculate();
};
TM.ILoopObject.prototype.draw = function(){
  this._draw();
};

// TM.ILoopObject interface functions
TM.ILoopObject.prototype._init = function(){};
TM.ILoopObject.prototype._destroy = function(){};
TM.ILoopObject.prototype._calculate = function(){};
TM.ILoopObject.prototype._draw = function(){};

console.log('TM.ILoopObject loaded');

//=============================
// TM.ILoopObject
//=============================
// Description: create an Object that does loop.
//             speed is the interval(millisecond), caculate and draw are functions that loop.
//             calculate is an interface function that need to be implemented and calculate values in data,
//             draw is is an interface function that need to be implemented and display the values on screen,
TM.ILoopObject = function(data, speed, autoStart){
  this.isActive = true; // need this to tell this object is not destroyed even though it's not autoStarted
  this.createWithOutInit = !autoStart;
  this.speed = speed;
  this.interval = new TM.ILoopObject_Interval();
  TM.IObject.call(this, data, this.createWithOutInit);
};
TM.ILoopObject.prototype = Object.create(TM.IObject.prototype);
TM.ILoopObject.prototype.constructor = TM.ILoopObject;

// TM.IObject functions inheritance
TM.ILoopObject.prototype.init = function (){
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

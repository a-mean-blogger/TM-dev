console.log('TM.IProgram loaded');

//=============================
// TM.IProgram
//=============================
TM.IProgram = function(data, speed){
  var skipInit = true;
  this.speed = speed;
  this.objects = [];
  this.uniqueObjects = {};
  this.loopCount = 0;
  TM.ILoopObject.call(this, data, this.speed, skipInit);
};
TM.IProgram.prototype = Object.create(TM.ILoopObject.prototype);
TM.IProgram.prototype.constructor = TM.IProgram;

// TM.ILoopObject functions inheritance
TM.IProgram.prototype.init = function(){
  TM.ILoopObject.prototype.init.call(this);
  this.loopCount = 0;
};
TM.IProgram.prototype.destroy = function(){
  TM.ILoopObject.prototype.destroy.call(this);
  for(var i=this.objects.length-1; i>= 0; i--){
    this.objects[i].destroy();
  }
  for(var key in this.uniqueObjects){
    if(this.uniqueObjects[key])this.uniqueObjects[key].destroy();
  }
};
TM.IProgram.prototype.calculate = function(){
  TM.ILoopObject.prototype.calculate.call(this);
  this.loopCount++;
  this.timeline(this.loopCount);
  this.getInput();
};
TM.IProgram.prototype.draw = function(){
  TM.ILoopObject.prototype.draw.call(this);
  this._draw();
};

// TM.IProgram functions
TM.IProgram.prototype.timeline = function(loopCount){
  this._timeline(loopCount);
};
TM.IProgram.prototype.getInput = function(){
  this._getInput();
};
TM.IProgram.prototype.addToObjects = function(object){
  this.objects = this.objects.filter(function(object){
    return object.isActive;
  }); // removed destroyed objects
  this.objects.push(object);
};

// TM.IProgram interface functions
TM.IProgram.prototype._init = function(){};
TM.IProgram.prototype._destroy = function(){};
TM.IProgram.prototype._calculate = function(){};
TM.IProgram.prototype._draw = function(){};
TM.IProgram.prototype._timeline = function(loopCount){};
TM.IProgram.prototype._getInput = function(){};

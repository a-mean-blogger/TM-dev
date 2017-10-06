console.log("text-canvas-2-base-objects.js loaded");

// Interval
TC.Interval = function(){
  this.id = undefined;
  this.func = undefined;
  this.speed = undefined;
};
TC.Interval.prototype.stop = function () {
  window.clearInterval(this.id);
  this.id = null;
};
TC.Interval.prototype.start = function () {
  this.stop();
  this.id = window.setInterval(_=>this.func(), this.speed);
};
TC.Interval.prototype.setSpeed = function (speed) {
  this.speed = speed;
  this.start();
};
TC.Interval.prototype.init = function (speed,func) {
  this.speed = speed;
  this.func = func;
  this.start();
};

// Object
TC.Object = function(data, createWithOutInit){
  this.isActive = true;
  this.data = TC.common.mergeObjects(this.data, data);
  if(!createWithOutInit) this.init();
};
TC.Object.prototype.init = function (){};
TC.Object.prototype.destroy = function(){
  this.isActive = false;
};

// LoopObject
TC.LoopObject = function(speed, data, autoStart){
  this.speed = speed;
  this.interval = new TC.Interval();
  TC.Object.call(this, data, !autoStart);
};
TC.LoopObject.prototype = Object.create(TC.Object.prototype);
TC.LoopObject.prototype.constructor = TC.LoopObject;

TC.LoopObject.prototype.init = function (){
  this.initInterval();
};
TC.LoopObject.prototype.initInterval = function(){
  this.isActive = true;
  this.draw();
  this.interval.init(this.speed, _=> {
    if(this.isActive) this.calculate();
    if(this.isActive) this.draw();
  });
};
TC.LoopObject.prototype.calculate = function(){};
TC.LoopObject.prototype.draw = function(){};
TC.LoopObject.prototype.destroy = function(){
  this.interval.stop();
  TC.Object.prototype.destroy.call(this);
};

// Program
TC.Program = function(speed, data){
  this.autoStart = false;
  this.objects = [];
  this.uniqueObjects = {};
  this.count = 0;
  TC.LoopObject.call(this, speed, data, this.autoStart);
};
TC.Program.prototype = Object.create(TC.LoopObject.prototype);
TC.Program.prototype.constructor = TC.Program;

TC.Program.prototype.timeline = function(){};
TC.Program.prototype.getInput = function(){};
TC.Program.prototype.calculate = function(){
  this.count++;
  this.timeline();
  this.getInput();
};
TC.Program.prototype.init = function(){
  TC.LoopObject.prototype.init.call(this);
  if(!this.objects) this.objects = [];
  if(!this.uniqueObjects) this.uniqueObjects = {};
  this.count = 0;
  this._init();
};
TC.Program.prototype._init = function(){};
TC.Program.prototype.destroy = function(){
  TC.LoopObject.prototype.destroy.call(this);
  this.count = 0;
  for(let i = this.objects.length-1; i >= 0; i--){
    this.objects[i].destroy();
  }
  for(let key in this.uniqueObjects){
    if(this.uniqueObjects[key])this.uniqueObjects[key].destroy();
  }
};
TC.Program.prototype.addToObjects = function(object){
  this.objects = this.objects.filter(object => object.isActive);
  this.objects.push(object);
};

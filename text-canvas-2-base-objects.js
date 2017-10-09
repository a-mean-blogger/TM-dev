console.log('text-canvas-2-base-objects.js loaded');

/******************************/
/* TC.Interval                */
/******************************/
TC.Interval = function(){
  this.id = undefined;
  this.func = undefined;
  this.speed = undefined;
};
TC.Interval.prototype.stop = function () {
  if(this.id) window.clearInterval(this.id);
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

/******************************/
/* TC.Object                  */
/******************************/
// Description: create an Object that does not loop
TC.Object = function(data, createWithOutInit){
  this.isActive = true;
  this.data = TC.common.mergeObjects(this.data, data);
  if(!createWithOutInit) this.init();
};
TC.Object.prototype.init = function (){
  this.isActive = true;
};
TC.Object.prototype.destroy = function(){
  this.isActive = false;
};

/******************************/
/* TC.LoopObject              */
/******************************/
// Description: create an Object that does loop
TC.LoopObject = function(data, speed, autoStart){
  this.speed = speed;
  this.interval = new TC.Interval();
  TC.Object.call(this, data, !autoStart);
};
TC.LoopObject.prototype = Object.create(TC.Object.prototype);
TC.LoopObject.prototype.constructor = TC.LoopObject;

// TC.Object functions inheritance
TC.LoopObject.prototype.init = function (){
  this.draw();
  this.interval.init(this.speed, _=> {
    if(this.isActive) this.calculate();
    if(this.isActive) this.draw();
  });
  TC.Object.prototype.init.call(this);
};
TC.LoopObject.prototype.destroy = function(){
  this.interval.stop();
  TC.Object.prototype.destroy.call(this);
};

// TC.LoopObject interface functions
TC.LoopObject.prototype.calculate = function(){};
TC.LoopObject.prototype.draw = function(){};

/******************************/
/* TC.Program              */
/******************************/
// Description: an object to control TC.Objects and/or TC.LoopObjects
TC.Program = function(data, speed){
  this.autoStart = false;
  this.speed = speed;
  this.objects = [];
  this.uniqueObjects = {};
  this.count = 0;
  TC.LoopObject.call(this, data, this.speed, this.autoStart);
};
TC.Program.prototype = Object.create(TC.LoopObject.prototype);
TC.Program.prototype.constructor = TC.Program;

// TC.LoopObject functions inheritance
TC.Program.prototype.init = function(){
  TC.LoopObject.prototype.init.call(this);
};
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
TC.Program.prototype.calculate = function(){
  this.count++;
  this.timeline();
  this.getInput();
};

// TC.LoopObject interface functions
TC.Program.prototype.timeline = function(){};
TC.Program.prototype.getInput = function(){};

// TC.LoopObject functions
TC.Program.prototype.addToObjects = function(object){
  this.objects = this.objects.filter(object => object.isActive);
  this.objects.push(object);
};

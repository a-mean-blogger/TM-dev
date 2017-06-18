console.log("common.js loaded");

var common = {};


common.getBlockWidth = function(fontSize){
  return fontSize*0.6;
};

common.getBlockHeight = function(fontSize){
  var blockHeight;
  if(fontSize < 3){
    blockHeight = fontSize;
  } else {
    var offsets = [6,7,7];
    var index = 0;
    var adjustment = 1;
    var val = fontSize-3;

    var recursive = function(val){
      if(val-offsets[index] <= 0) return;
      else {
        val -= offsets[index];
        adjustment++;
        index = (index+1)%3;
        recursive(val);
      }
    };

    recursive(val);
    blockHeight = fontSize + adjustment;
  }
  return blockHeight;
};
common.isNumber = function(num){
  if(num === 0|| (num && num.constructor == Number)) return true;
  else return false;
};

common.Interval = function(){
  this.id = undefined;
  this.func = undefined;
  this.speed = undefined;
};
common.Interval.prototype.stop = function () {
  window.clearInterval(this.id);
  this.id = null;
};
common.Interval.prototype.start = function () {
  this.stop();
  this.func();
  this.id = window.setInterval(_=>this.func(), this.speed);
};
common.Interval.prototype.setSpeed = function (speed) {
  this.speed = speed;
  this.start();
};
common.Interval.prototype.init = function (speed,func) {
  this.speed = speed;
  this.func = func;
  this.start();
};

common.TextObject = function(parent,textObj,func){
  this.parent = parent;
  if(textObj.constructor != Object) return console.error(textObj+" is invalid");
  if(textObj.text.constructor != String) return console.error(textObj.text+" is invalid");
  this.text=textObj.text;
  this.width=textObj.text.length;
  this.speed=common.isNumber(textObj.speed)?textObj.speed:null;
  this.speedCount=0;
  this.xN=this.x=common.isNumber(textObj.x)?textObj.x:0-this.width;
  this.yN=this.y=common.isNumber(textObj.y)?textObj.y:0;
  this.xD=common.isNumber(textObj.xD)?textObj.xD:0-this.width;
  this.yD=common.isNumber(textObj.yD)?textObj.yD:0;
  this.calculate = func;
  this.init();
};
common.TextObject.prototype.init = function(){
  this.parent.push(this);
};
common.TextObject.prototype.destroy = function(){
  var i = this.parent.indexOf(this);
  this.parent.splice(i,1);
}
common.TextObject.prototype.setSpeed = function(speed){
  this.speed=speed;
};
common.TextObject.prototype.draw = function(){
  base.screen.deleteText(this.x,this.y,this.text);
  this.x = this.xN;
  this.y = this.yN;
  base.screen.insertText(this.x,this.y,this.text);
};
common.TextObject.prototype.loop = function(){
  if(this.speed){
    if(this.speedCount >= this.speed){
      this.calculate();
      this.speedCount = 0;
    } else {
      this.speedCount++;
    }
  }
  this.draw();
};

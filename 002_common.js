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
  return blockHeight * 0.9;
};
common.isNumber = function(num){
  if(num === 0|| (num && num.constructor == Number)) return true;
  else return false;
};

common.Block = function(char,color,backgroundColor){
  this.char = char;
  this.color = color?color:setting.game.frame.defalutFontColor;
  this.backgroundColor = backgroundColor?backgroundColor:setting.game.frame.backgroundColor;
  this.font = setting.game.frame.defalutFont;
};
common.isCharGroup1 = function(char){
  var regex = new RegExp("^["+setting.game.charGroup1+"]$");
  if(regex.test(char)) return true;
  else return false;
};
common.isCharGroup2 = function(char){
  var regex = new RegExp("^["+setting.game.charGroup2+"]$");
  if(regex.test(char)) return true;
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

common.TextObject = function(parent,values,func){
  this.parent = parent;
  if(values.constructor != Object) return console.error(values+" is invalid");
  if(values.text.constructor != String) return console.error(values.text+" is invalid");
  this.text=values.text;
  this.width=values.text.length;
  this.speed=common.isNumber(values.speed)?values.speed:null;
  this.speedCount=0;
  this.xN=this.x=common.isNumber(values.x)?values.x:0-this.width;
  this.yN=this.y=common.isNumber(values.y)?values.y:0;
  this.xD=common.isNumber(values.xD)?values.xD:0-this.width;
  this.yD=common.isNumber(values.yD)?values.yD:0;
  this.calculate = func;
  this.init();
};
common.TextObject.prototype.init = function(){
  this.parent.push(this);
};
common.TextObject.prototype.destroy = function(){
  var i = this.parent.indexOf(this);
  this.parent.splice(i,1);
};
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

console.log("common.js loaded");

var common = {};


common.getBlockWidth = function(fontSize){
  return fontSize*0.6;
};

common.getBlockHeight = function(fontSize){
  let blockHeight;
  if(fontSize < 3){
    blockHeight = fontSize;
  } else {
    let offsets = [6,7,7];
    let index = 0;
    let adjustment = 1;
    let val = fontSize-3;

    let recursive = function(val){
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

common.getCharGroup = function(char){
for(let group in setting.font.adjustment){
  let charset = setting.font.adjustment[group];
    let regex = new RegExp("^["+charset.regex+"]$");
    if(regex.test(char)) return charset;
  }
};

common.getFullwidthRegex = function(){
  let string = "";
  for(let group in setting.font.adjustment){
    let charset = setting.font.adjustment[group];
    if(charset&&charset.isFullwidth) string += charset.regex;
  }
  if(string) return new RegExp("(["+string+"])","g");
};

common.Char = function(char,isFullwidth,color,backgroundColor){
  this.char = char;
  this.isFullwidth = isFullwidth;
  this.color = color?color:setting.env.defalutFontColor;
  this.backgroundColor = backgroundColor?backgroundColor:setting.env.backgroundColor;
  this.font = setting.font.fontFamily;
  this.draw = true;
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

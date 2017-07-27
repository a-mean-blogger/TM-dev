console.log("tb-canvas-2.js loaded");


tbCanvas.common = {};

tbCanvas.common.getBlockWidth = function(fontSize){
  return fontSize*0.6;
};

tbCanvas.common.getBlockHeight = function(fontSize){
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
tbCanvas.common.isNumber = function(num){
  if(num === 0|| (num && num.constructor == Number)) return true;
  else return false;
};

tbCanvas.common.getCharGroup = function(char){
for(let group in tbCanvas.setting.charGroups){
  let charset = tbCanvas.setting.charGroups[group];
    let regex = new RegExp("^["+charset.regex+"]$");
    if(regex.test(char)) return charset;
  }
};

tbCanvas.common.getFullwidthRegex = function(){
  let string = "";
  for(let group in tbCanvas.setting.charGroups){
    let charset = tbCanvas.setting.charGroups[group];
    if(charset&&charset.isFullwidth) string += charset.regex;
  }
  if(string) return new RegExp("(["+string+"])","g");
};

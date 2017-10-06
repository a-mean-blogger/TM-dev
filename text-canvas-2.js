console.log("text-canvas-2.js loaded");


TC.common = {};

TC.common.getBlockWidth = function(fontSize){
  return fontSize*0.6;
};

TC.common.getBlockHeight = function(fontSize){
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
TC.common.isNumber = function(num){
  if(num === 0|| (num && num.constructor == Number)) return true;
  else return false;
};

TC.common.getCharGroup = function(char){
for(let group in TC.defaultSettings.charGroups){
  let charset = TC.defaultSettings.charGroups[group];
    let regex = new RegExp("^["+charset.regex+"]$");
    if(regex.test(char)) return charset;
  }
};

TC.common.getFullwidthRegex = function(){
  let string = "";
  for(let group in TC.defaultSettings.charGroups){
    let charset = TC.defaultSettings.charGroups[group];
    if(charset&&charset.isFullwidth) string += charset.regex;
  }
  if(string) return new RegExp("(["+string+"])","g");
};

// TC.common.merge(object1, object2):
// Create an object with object1 and object2's properties and return it. object2 will overwrite object1 if there are same properties.
TC.common.mergeObjects = function(...objects){
  var object = {};
  for(let i = 0; i<objects.length; i++){
    for(let p in objects[i]){
      object[p] = objects[i][p];
    }
  }
  return object;
};

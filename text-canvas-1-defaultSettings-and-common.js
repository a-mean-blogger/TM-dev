console.log("text-canvas-1-defaultSettings-and-common.js loaded");

var TC = {};

TC.defaultSettings = {
  screen: {
    canvasId: "text-canvas",
    fontSize: 15,
    frameSpeed: 10,
    zoom: 1,
    column: 60,
    row: 20,
    backgroundColor: "#151617",
    defalutFontColor: "#F5F7FA",
    fontFamily: 'monospace',
    fontSource: null,
  },
  charGroups: {
    korean: {//ㄱ     -힝
      regex: "\u3131-\uD79D",
      isFullwidth: true,
      sizeAdj: 1,
      xAdj: 0,
      yAdj: 0,
    },
  },
  debug: {
    isActive: true,
    outputDomId: "devOutput",
    frameSpeed: 10,
  }
};

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

TC.common.getCharGroup = function(charGroups, char){
for(let group in charGroups){
  let charset = charGroups[group];
    let regex = new RegExp("^["+charset.regex+"]$");
    if(regex.test(char)) return charset;
  }
};

TC.common.getFullwidthRegex = function(charGroups){
  let string = "";
  for(let group in charGroups){
    let charset = charGroups[group];
    if(charset&&charset.isFullwidth) string += charset.regex;
  }
  if(string) return new RegExp("(["+string+"])","g");
};

// TC.common.mergeObjects(object1, object2, ...):
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

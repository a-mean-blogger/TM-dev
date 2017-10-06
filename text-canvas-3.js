console.log("text-canvas-3.js loaded");


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


TC.Object = function(data, createWithOutInit){
  this.isActive = true;
  this.data = TC.common.mergeObjects(this.data, data);
  if(!createWithOutInit) this.init();
};
TC.Object.prototype.init = function (){};
TC.Object.prototype.destroy = function(){
  this._destroy();
  this.isActive = false;
};
TC.Object.prototype._destroy = function(){};


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
TC.LoopObject.prototype._destroy = function(){};


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
  this.objects = [];
  this.uniqueObjects = {};
  this.count = 0;
  this._init();
};
TC.Program.prototype._init = function(){};
TC.Program.prototype.destroy = function(){
  TC.LoopObject.prototype.destroy.call(this);
  this.count = 0;
  for(let i = this.objects.length-1;i>=0;i--){
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


TC.Screen_Char = function(screen, char, isFullwidth, color, backgroundColor){
  this.char = char;
  this.isFullwidth = isFullwidth;
  this.color = color?color:screen.defalutFontColor;
  this.backgroundColor = backgroundColor?backgroundColor:screen.backgroundColor;
  this.font = screen.fontFamily;
  this.isNew = true;
};


TC.Screen = function(customSreenSetting, customCharGroups){
  this.screenSetting = TC.common.mergeObjects(TC.defaultSettings.screen, customSreenSetting);
  this.charGroups = TC.common.mergeObjects(TC.defaultSettings.charGroups, customCharGroups);

  this.isFontLoaded = false;
  this.screenSettingData = [];
  this.blockWidth = TC.common.getBlockWidth(this.screenSetting.fontSize);
  this.blockHeight = TC.common.getBlockHeight(this.screenSetting.fontSize);

  try{
    this.canvas = document.querySelector("#"+this.screenSetting.canvasId);
    if(!this.canvas){
      throw("'#"+this.screenSetting.canvasId+"' does not exist! ");
    }
    else if (this.canvas.tagName !=="CANVAS"){
      throw("'#"+this.screenSetting.canvasId+"' is not a canvas! ");
    }
  }
  catch(errorMessage){
    console.error("new TC.Screen ERROR: "+errorMessage+" TC.Screen is not created.");
    return;
  }
  this.canvas.width = this.blockWidth * this.screenSetting.column;
  this.canvas.height = this.blockHeight * this.screenSetting.row;
  this.canvas.style.border = this.screenSetting.backgroundColor+" 1px solid";
  this.canvas.style.borderRadius = "5px";
  this.canvas.style.backgroundColor = this.screenSetting.backgroundColor;
  this.canvas.style.width = this.canvas.width * this.screenSetting.zoom + "px";
  this.canvas.style.height = this.canvas.height * this.screenSetting.zoom + "px";
  this.ctx = this.canvas.getContext("2d");

  TC.LoopObject.call(this, this.screenSetting.frameSpeed, null, true);
};
TC.Screen.prototype = Object.create(TC.LoopObject.prototype);
TC.Screen.prototype.constructor = TC.Screen;

TC.Screen.prototype.init = function () {
  this.initScreenData();
  if(this.screenSetting.fontSource && !document.querySelector(`link[href='${this.screenSetting.fontSource}'][rel='stylesheet']`)){
    var link = document.createElement('link');
    link.href = this.screenSetting.fontSource;
    link.rel = "stylesheet";
    document.getElementsByTagName('head')[0].appendChild(link);
  }
  this.initInterval();
};
TC.Screen.prototype.calculate = function() {
  if(!this.isFontLoaded) this.checkFontLoaded();
};
TC.Screen.prototype.getBackgroundWidthRecursive = function(i,j,bgUpdated){
  bgUpdated[i][j] = true;
  if(j+1<this.screenSetting.column
  && this.screenSettingData[i][j+1].isNew
  && this.screenSettingData[i][j].backgroundColor == this.screenSettingData[i][j+1].backgroundColor){
    return this.getBackgroundWidthRecursive(i,j+1,bgUpdated) + this.blockWidth;
  } else {
    return this.blockWidth;
  }
};
TC.Screen.prototype.draw = function() {
  let ctx = this.ctx;
  ctx.textBaseline = "buttom";

  let bgUpdated = [];
  for(let i = 0; i <this.screenSetting.row; i++){
    bgUpdated[i] = [];
    for(let j = 0; j<this.screenSetting.column; j++){
      bgUpdated[i][j] = false;
    }
  }

  for(let i = 0; i <this.screenSetting.row; i++){
    for(let j = 0; j<this.screenSetting.column; j++){
      if(this.screenSettingData[i][j].isNew === true){

        //draw backgroundColor
        if(!bgUpdated[i][j]){
          let bgX = this.blockWidth*j;
          let bgY = this.blockHeight*i;
          let width = this.getBackgroundWidthRecursive(i,j,bgUpdated);
          let height = this.blockHeight;
          ctx.fillStyle = this.screenSettingData[i][j].backgroundColor;
          ctx.fillRect(bgX,bgY,width,height);
        }

        //draw char
        if(this.screenSettingData[i][j].char && this.screenSettingData[i][j].char[0] != "$"){
          let chX = this.blockWidth*j;
          let chY = this.blockHeight*i+this.blockHeight*0.8; // y adjustment
          let charset = TC.common.getCharGroup(this.charGroups, this.screenSettingData[i][j].char);
          if(charset){
            ctx.font = this.screenSetting.fontSize*charset.sizeAdj+"px "+this.screenSettingData[i][j].font;
            chX = chX+this.blockWidth*charset.xAdj;
            chY = chY+this.blockHeight*charset.yAdj;
          }
          else {
            ctx.font = this.screenSetting.fontSize+"px "+this.screenSettingData[i][j].font;
          }
          ctx.fillStyle = this.screenSettingData[i][j].color;
          ctx.fillText(this.screenSettingData[i][j].char[0],chX,chY);
        }

        //do not draw once it already drew for the better performance
        this.screenSettingData[i][j].isNew = false;
      }
    }
  }
};
TC.Screen.prototype.checkFontLoaded= function(){
  if(document.fonts.check("1em "+this.screenSetting.fontFamily)){
    this.isFontLoaded = true;
    this.refreshScreen();
  }
};
TC.Screen.prototype.isInCanvas = function(x,y){
  if(x>=0 && y>=0 && y<this.screenSettingData.length && x<this.screenSettingData[y].length) return true;
  else return false;
};
TC.Screen.prototype.initScreenData = function(){
  this.screenSettingData = [];
  for(let i = 0; i <this.screenSetting.row; i++){
    this.screenSettingData[i]=[];
    for(let j = 0; j<this.screenSetting.column; j++){
      this.screenSettingData[i][j]=new TC.Screen_Char(this.screenSetting, " ");
    }
  }
};
TC.Screen.prototype.refreshScreen = function(){
  for(let i = 0; i <this.screenSettingData.length; i++){
    for(let j = 0; j<this.screenSettingData[i].length; j++){
      this.screenSettingData[i][j].isNew = true;
    }
  }
};
TC.Screen.prototype.fillScreen = function(char, color, backgroundColor){
  if(typeof char != "string") char = " ";
  this.screenSettingData = [];
  for(let i = 0; i <this.screenSetting.row; i++){
    this.screenSettingData[i]=[];
    for(let j = 0; j<this.screenSetting.column; j++){
      this.screenSettingData[i][j]=new TC.Screen_Char(this.screenSetting, char, false, color, backgroundColor);
    }
  }
};
TC.Screen.prototype.clearScreen = function(){
  this.fillScreen(" ");
};
TC.Screen.prototype.insertChar = function(x,y,char,color,backgroundColor){
  if(char.constructor != String) return console.error(char+" is invalid");

  if(this.isInCanvas(x,y)
  && (this.screenSettingData[y][x].char != char
    || this.screenSettingData[y][x].color != (color?color:this.screenSetting.defalutFontColor)
    || this.screenSettingData[y][x].backgroundColor != (backgroundColor?backgroundColor:this.screenSetting.backgroundColor)
    || (this.screenSettingData[y][x].char[0] == "$" && this.screenSettingData[y][x-1].isNew)
    )
  ){
    let regex = TC.common.getFullwidthRegex(this.charGroups);
    let fullwidth = regex.test(char);

    this.screenSettingData[y][x] = new TC.Screen_Char(this.screenSetting, char,fullwidth,color,backgroundColor);

    // to clean background outliner
    if(this.isInCanvas(x-1,y)) this.screenSettingData[y][x-1].draw = true;
    if(this.isInCanvas(x+(fullwidth?2:1),y)) this.screenSettingData[y][x+(fullwidth?2:1)].draw = true;
  }
};
TC.Screen.prototype.deleteChar = function(x,y){
  this.insertChar(x,y," ");
};
TC.Screen.prototype.insertText = function(x,y,text,color,backgroundColor){
  let regex = TC.common.getFullwidthRegex(this.charGroups);
  text = text.toString().replace(regex,"$1 ");
  if(y<0 || y>=this.screenSettingData.length) return;
  for(let i = 0; i<text.length; i++){
    if(x+i>=0 && x+i <this.screenSetting.column){
      this.insertChar(x+i,y,text[i],color,backgroundColor);

      let regex = TC.common.getFullwidthRegex(this.charGroups);
      let fullwidth = regex.test(text[i]);
      if(fullwidth){
        i++;
        this.insertChar(x+i,y,"$fullwidthFiller",color,backgroundColor);
      }
    }
  }
};
TC.Screen.prototype.deleteText = function(x,y,text){
  let regex = TC.common.getFullwidthRegex(this.charGroups);
  text = text.toString().replace(regex,"$1 ");
  this.insertText(x,y,text.replace(/./g," "));
};
TC.Screen.prototype.copyScreen = function(){
  let copyToCanvas = document.createElement("canvas");
  let ctx = copyToCanvas.getContext("2d");
  copyToCanvas.width = this.canvas.width;
  copyToCanvas.height = this.canvas.height;
  ctx.drawImage(this.canvas, 0, 0);
  return copyToCanvas;
};
TC.Screen.prototype.pasteScreen = function(canvas){
  this.ctx.drawImage(canvas, 0, 0);
};
TC.Screen.prototype.consoleScreenData = function(canvas){
  for(let i = 0; i <this.screenSetting.row; i++){
    var row = "";
    for(let j = 0; j<this.screenSetting.column; j++){
      row += this.screenSettingData[i][j].char[0]+(this.screenSettingData[i][j].isNew?"!":" ");
    }
    console.log(row);
  }
};



TC.DevTask = function(domId, data, calculate){
  this.outputDom = document.querySelector("#"+TC.defaultSettings.devMode.outputDomId);
  this.output = '';
  this.domId = domId;
  this.data = data;
  this.calculate = calculate;
  TC.LoopObject.call(this, 10);
};
TC.DevTask.prototype = Object.create(TC.LoopObject.prototype);
TC.DevTask.prototype.constructor = TC.DevTask;

TC.DevTask.prototype.init = function(){
  if(TC.defaultSettings.devMode.isActive) this.initInterval();
};
TC.DevTask.prototype.calculate = function(){
  // get this from constructor
};
TC.DevTask.prototype.draw = function(){
  let dom = document.querySelector("#"+this.domId);
  if(!dom){
    dom = document.createElement("div");
    dom.id = this.domId;
    this.outputDom.appendChild(dom);
  }
  dom.innerText = this.output;
};
TC.DevTask.prototype.stop = function(){
  let dom = document.querySelector("#"+this.domId);
  dom.remove();
  this.isActive = false;
};
TC.DevTask.prototype.restart = function(){
  this.isActive = true;
};
TC.DevTask.prototype.beforeDestroy = function(){
  if(Array.isArray(this.container)){
    let i = this.container.indexOf(this);
    if (i >= 0) this.container.splice(i,1);
  }
  let dom = document.querySelector("#"+this.domId);
  if(dom) dom.remove();
};


TC.inputs = {
  isAllowed: true,
  keyboard:{
    isAllowed: true,
    keyState:{},
    keyPressed:{},
    eventHandlers:{
      keydown: function(e){
        e.preventDefault();
        if(TC.inputs.isAllowed && TC.inputs.keyboard.isAllowed){
          TC.inputs.keyboard.keyState[e.keyCode] = true;
          TC.inputs.keyboard.keyPressed[e.keyCode] = true;
          // console.log("e.keyCode: ", e.keyCode);
        }
      },
      keyup: function(e){
        e.preventDefault();
        delete TC.inputs.keyboard.keyState[e.keyCode];
      },
    },
    init: function(){
      document.addEventListener("keydown", this.eventHandlers.keydown);
      document.addEventListener("keyup", this.eventHandlers.keyup);
    },
    checkKeyState: function(keyCode){
      // console.log("keyCode: ", keyCode);
      // console.log("this.keyState: ", this.keyState);
      if(this.keyState[keyCode]) {
        return true;
      }
      else return false;
    },
    checkKeyStateAny: function(){
      if(Object.keys(this.keyState).length){
        // console.log("this.keyState: ", this.keyState);
        return true;
      }
      else return false;
    },
    removeKeyState: function(keyCode){
      delete this.keyState[keyCode];
    },
    clearKeyState: function(){
      this.keyState = {};
    },
    checkKeyPressed: function(keyCode){
      // console.log("keyCode: ", keyCode);
      // console.log("this.keyPressed: ", this.keyPressed);
      if(this.keyPressed[keyCode]) {
        delete this.keyPressed[keyCode];
        return true;
      }
      else return false;
    },
    checkKeyPressedAny: function(){
      if(Object.keys(this.keyPressed).length){
        this.keyPressed = {};
        return true;
      }
      else return false;
    },
    removeKeyPressed: function(keyCode){
      delete this.keyPressed[keyCode];
    },
    clearKeyPressed: function(){
      this.keyPressed = {};
    },
    checkKey: function(keyCode){
      return this.checkKeyPressed(keyCode) || this.checkKeyState(keyCode);
    },
    checkKeyAny: function(){
      return this.checkKeyPressedAny() || this.checkKeyStateAny();
    },
    removeKey: function(keyCode){
      this.removeKeyPressed(keyCode);
      this.removeKeyState(keyCode);
    },
    clearKey: function(){
      this.clearKeyPressed();
      this.clearKeyState();
    },
  },
  init: function(){
    this.keyboard.init();
  }
};

TC.inputs.init();

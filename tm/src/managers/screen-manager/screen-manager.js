console.log('TM.ScreenManager loaded');

//=============================
// TM.ScreenManager
//=============================
// Object Type: TM.ILoopObject
// Description: manages canvas screen
TM.ScreenManager = function(customSreenSetting, customCharGroups){
  this.screenSetting = TM.common.mergeObjects(TM.defaultSettings.screen, customSreenSetting);
  this.charGroups = TM.common.mergeObjects(TM.defaultSettings.charGroups, customCharGroups);

  this.autoStart = true;
  this.speed = this.screenSetting.frameSpeed;

  try{
    this.canvas = document.querySelector('#'+this.screenSetting.canvasId);
    if(!this.canvas){
      throw('[#'+this.screenSetting.canvasId+'] does not exist! ');
    }
    else if (this.canvas.tagName !=='CANVAS'){
      throw('[#'+this.screenSetting.canvasId+'] is not a canvas! ');
    }
  }
  catch(errorMessage){
    this.isActive = false;
    console.error('new TM.ScreenManager ERROR: '+errorMessage+' TM.ScreenManager is not created correctly.');
    return;
  }

  this.isFontLoaded = false;
  this.screenSettingData = [];
  this.blockWidth = TM.common.getBlockWidth(this.screenSetting.fontSize);
  this.blockHeight = TM.common.getBlockHeight(this.screenSetting.fontSize);
  this.canvas.width = this.blockWidth * this.screenSetting.column;
  this.canvas.height = this.blockHeight * this.screenSetting.row;
  this.canvas.style.border = this.screenSetting.backgroundColor+' 1px solid';
  this.canvas.style.borderRadius = '5px';
  this.canvas.style.backgroundColor = this.screenSetting.backgroundColor;
  this.canvas.style.width = this.canvas.width * this.screenSetting.zoom+'px';
  this.canvas.style.height = this.canvas.height * this.screenSetting.zoom+'px';
  this.canvas.tabIndex = 1; // for input keydown event
  this.canvas.style.outline = 'none'; // for input keydown event
  this.ctx = this.canvas.getContext('2d');

  TM.ILoopObject.call(this, null, this.speed, this.autoStart);
};
TM.ScreenManager.prototype = Object.create(TM.ILoopObject.prototype);
TM.ScreenManager.prototype.constructor = TM.ScreenManager;

// TM.ILoopObject functions implementation
TM.ScreenManager.prototype._init = function(){
  this.initScreenData();
  if(this.screenSetting.fontSource && !TM.common.checkFontLoadedByWebFont(this.screenSetting.fontFamily)){
    this.startLoadingFont();
  }
};
TM.ScreenManager.prototype._destroy = function(){};
TM.ScreenManager.prototype._calculate = function(){
  if(!this.isFontLoaded && TM.common.checkFontLoadedByWebFont(this.screenSetting.fontFamily)){
    this.isFontLoaded = true;
    this.refreshScreen();
  }
  if(this.checkReady()){
    if(this.onReadyFunc){
      this.onReadyFunc();
      delete this.onReadyFunc;
    }
  }
  else {
    this.showLoading();
  }
};
TM.ScreenManager.prototype._draw = function(){
  var ctx = this.ctx;
  ctx.textBaseline = 'buttom';

  // bgUpdateMap indicates if bg updated or not at the grid in this draw iteration.
  var bgUpdateMap = this.getInitialBgUpdateMap();

  for(var i=0; i<this.screenSetting.row; i++){
    for(var j=0; j<this.screenSetting.column; j++){
      if(this.screenSettingData[i][j].isNew === true){

        //draw backgroundColor
        if(!bgUpdateMap[i][j]){
          var bgX = this.blockWidth*j;
          var bgY = this.blockHeight*i;
          var width = this.getBackgroundWidthRecursive(i,j,bgUpdateMap);
          var height = this.blockHeight;
          ctx.fillStyle = this.screenSettingData[i][j].backgroundColor;
          ctx.fillRect(bgX,bgY,width,height);
        }

        //draw char
        if(this.screenSettingData[i][j].char && this.screenSettingData[i][j].char[0] != '$'){
          var chX = this.blockWidth*j;
          var chY = this.blockHeight*i+this.blockHeight*0.8; // y adjustment
          var charset = TM.common.getCharGroup(this.charGroups, this.screenSettingData[i][j].char);
          if(charset){
            ctx.font = this.screenSetting.fontSize*charset.sizeAdj+'px '+this.screenSettingData[i][j].font;
            chX = chX+this.blockWidth*charset.xAdj;
            chY = chY+this.blockHeight*charset.yAdj;
          }
          else {
            ctx.font = this.screenSetting.fontSize+'px '+this.screenSettingData[i][j].font;
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

// TM.ScreenManager private functions
TM.ScreenManager.prototype.startLoadingFont = function(){
  if(!this.screenSetting.webFontJsPath) return console.error("TM.ScreenManager ERROR: 'webFontJsPath' is required to load font from 'fontSource'!");

  if(!window.WebFont){
    TM.common.includeScript(this.screenSetting.webFontJsPath,this.loadWebFont());
  }
  else {
    this.loadWebFont();
  }
}
TM.ScreenManager.prototype.loadWebFont = function(){
  var _self = this;
  return function(){
    WebFont.load({
      custom: {
        families: [_self.screenSetting.fontFamily],
        urls : [_self.screenSetting.fontSource]
      }
    });
  };
}
TM.ScreenManager.prototype.getInitialBgUpdateMap = function(){
  var bgUpdateMap = [];
  for(var i=0; i<this.screenSetting.row; i++){
    bgUpdateMap[i] = [];
    for(var j=0; j<this.screenSetting.column; j++){
      bgUpdateMap[i][j] = false;
    }
  }
  return bgUpdateMap;
};
TM.ScreenManager.prototype.getBackgroundWidthRecursive = function(i,j,bgUpdateMap){
  bgUpdateMap[i][j] = true;
  if(j+1<this.screenSetting.column
  && this.screenSettingData[i][j+1].isNew
  && this.screenSettingData[i][j].backgroundColor == this.screenSettingData[i][j+1].backgroundColor){
    return this.getBackgroundWidthRecursive(i,j+1,bgUpdateMap) + this.blockWidth;
  } else {
    return this.blockWidth;
  }
};
TM.ScreenManager.prototype.refreshScreen = function(){
  for(var i=0; i<this.screenSettingData.length; i++){
    for(var j=0; j<this.screenSettingData[i].length; j++){
      this.screenSettingData[i][j].isNew = true;
    }
  }
};
TM.ScreenManager.prototype.isInCanvas = function(x,y){
  if(x>=0 && y>=0 && y<this.screenSettingData.length && x<this.screenSettingData[y].length) return true;
  else return false;
};
TM.ScreenManager.prototype.initScreenData = function(){
  this.screenSettingData = [];
  for(var i=0; i<this.screenSetting.row; i++){
    this.screenSettingData[i]=[];
    for(var j=0; j<this.screenSetting.column; j++){
      this.screenSettingData[i][j]=new TM.ScreenManager_Char(this.screenSetting, ' ');
    }
  }
};
TM.ScreenManager.prototype.insertChar = function(x,y,char,color,backgroundColor){
  if(this.isInCanvas(x,y)
  && (this.screenSettingData[y][x].char != char
    || this.screenSettingData[y][x].color != (color?color:this.screenSetting.defalutFontColor)
    || this.screenSettingData[y][x].backgroundColor != (backgroundColor?backgroundColor:this.screenSetting.backgroundColor)
    || (this.screenSettingData[y][x].char[0] == '$' && this.screenSettingData[y][x-1].isNew)
    )
  ){
    var regex = TM.common.getFullwidthRegex(this.charGroups);
    var fullwidth = regex.test(char);

    this.screenSettingData[y][x] = new TM.ScreenManager_Char(this.screenSetting, char,fullwidth,color,backgroundColor);

    // to clean background outliner
    if(this.isInCanvas(x-1,y)) this.screenSettingData[y][x-1].draw = true;
    if(this.isInCanvas(x+(fullwidth?2:1),y)) this.screenSettingData[y][x+(fullwidth?2:1)].draw = true;
  }
};
TM.ScreenManager.prototype.deleteChar = function(x,y){
  this.insertChar(x,y,' ');
};
TM.ScreenManager.prototype.showLoading = function(){
  this.insertText(0,0,"Loading ...");
}

// TM.ScreenManager public functions
TM.ScreenManager.prototype.onReady = function(func){
  if(this.checkReady()){
    this.onReadyFunc();
  }
  else {
    this.onReadyFunc = func;
  }
}
TM.ScreenManager.prototype.checkReady = function(){
  var isReady = false;

  var isFontReady = this.screenSetting.fontSource?this.isFontLoaded:true;

  isReady = isFontReady;
  return isReady;
}
TM.ScreenManager.prototype.fillScreen = function(char, color, backgroundColor){
  if(typeof char != 'string') char = ' ';
  this.screenSettingData = [];
  for(var i=0; i<this.screenSetting.row; i++){
    this.screenSettingData[i]=[];
    for(var j=0; j<this.screenSetting.column; j++){
      this.screenSettingData[i][j]=new TM.ScreenManager_Char(this.screenSetting, char, false, color, backgroundColor);
    }
  }
};
TM.ScreenManager.prototype.clearScreen = function(){
  this.fillScreen(' ');
};
TM.ScreenManager.prototype.insertText = function(x,y,text,color,backgroundColor){
  var regex = TM.common.getFullwidthRegex(this.charGroups);
  text = text.toString().replace(regex,'$1 ');
  if(y<0 || y>=this.screenSettingData.length) return;
  for(var i=0; i<text.length; i++){
    if(x+i>=0 && x+i <this.screenSetting.column){
      this.insertChar(x+i,y,text[i],color,backgroundColor);
      var fullwidth = regex.test(text[i]);
      if(fullwidth){
        i++;
        this.insertChar(x+i,y,'$fullwidthFiller',color,backgroundColor);
      }
    }
  }
};
TM.ScreenManager.prototype.deleteText = function(x,y,text){
  var regex = TM.common.getFullwidthRegex(this.charGroups);
  text = text.toString().replace(regex,'$1 ');
  this.insertText(x,y,text.replace(/./g,' '));
};
TM.ScreenManager.prototype.copyScreen = function(){
  var copyToCanvas = document.createElement('canvas');
  var ctx = copyToCanvas.getContext('2d');
  copyToCanvas.width = this.canvas.width;
  copyToCanvas.height = this.canvas.height;
  ctx.drawImage(this.canvas, 0, 0);
  return copyToCanvas;
};
TM.ScreenManager.prototype.pasteScreen = function(canvas){
  this.ctx.drawImage(canvas, 0, 0);
};
TM.ScreenManager.prototype.consoleScreenData = function(canvas){
  for(var i=0; i<this.screenSetting.row; i++){
    var row = '';
    for(var j=0; j<this.screenSetting.column; j++){
      row += this.screenSettingData[i][j].char[0]+(this.screenSettingData[i][j].isNew?'!':' ');
    }
    console.log(row);
  }
};

console.log('text-canvas-3-screen-manager.js loaded');

/******************************/
/* TC.ScreenManager_Char      */
/******************************/
TC.ScreenManager_Char = function(screen, char, isFullwidth, color, backgroundColor){
  this.char = char;
  this.isFullwidth = isFullwidth;
  this.color = color?color:screen.defalutFontColor;
  this.backgroundColor = backgroundColor?backgroundColor:screen.backgroundColor;
  this.font = screen.fontFamily;
  this.isNew = true;
};

/******************************/
/* TC.ScreenManager           */
/******************************/
// Object Type: TC.LoopObject
// Description: manages canvas screen
TC.ScreenManager = function(customSreenSetting, customCharGroups){
  this.screenSetting = TC.common.mergeObjects(TC.defaultSettings.screen, customSreenSetting);
  this.charGroups = TC.common.mergeObjects(TC.defaultSettings.charGroups, customCharGroups);

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
    console.error('new TC.ScreenManager ERROR: '+errorMessage+' TC.ScreenManager is not created correctly.');
    return;
  }

  this.isFontLoaded = false;
  this.screenSettingData = [];
  this.blockWidth = TC.common.getBlockWidth(this.screenSetting.fontSize);
  this.blockHeight = TC.common.getBlockHeight(this.screenSetting.fontSize);
  this.canvas.width = this.blockWidth * this.screenSetting.column;
  this.canvas.height = this.blockHeight * this.screenSetting.row;
  this.canvas.style.border = this.screenSetting.backgroundColor+' 1px solid';
  this.canvas.style.borderRadius = '5px';
  this.canvas.style.backgroundColor = this.screenSetting.backgroundColor;
  this.canvas.style.width = this.canvas.width * this.screenSetting.zoom + 'px';
  this.canvas.style.height = this.canvas.height * this.screenSetting.zoom + 'px';
  this.canvas.tabIndex = 1; // for input keydown event
  this.canvas.style.outline = 'none'; // for input keydown event
  this.ctx = this.canvas.getContext('2d');

  TC.LoopObject.call(this, null, this.speed, this.autoStart);
};
TC.ScreenManager.prototype = Object.create(TC.LoopObject.prototype);
TC.ScreenManager.prototype.constructor = TC.ScreenManager;

// TC.LoopObject functions inheritance
TC.ScreenManager.prototype.init = function () {
  this.initScreenData();
  if(this.screenSetting.fontSource && !document.querySelector(`link[href='${this.screenSetting.fontSource}'][rel='stylesheet']`)){
    var link = document.createElement('link');
    link.href = this.screenSetting.fontSource;
    link.rel = 'stylesheet';
    document.getElementsByTagName('head')[0].appendChild(link);
  }
  TC.LoopObject.prototype.init.call(this);
};
TC.ScreenManager.prototype.destroy = function(){TC.LoopObject.prototype.destroy.call(this);};

// TC.LoopObject functions implementation
TC.ScreenManager.prototype.calculate = function() {
  if(!this.isFontLoaded) this.checkFontLoaded();
};
TC.ScreenManager.prototype.draw = function() {
  let ctx = this.ctx;
  ctx.textBaseline = 'buttom';

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
        if(this.screenSettingData[i][j].char && this.screenSettingData[i][j].char[0] != '$'){
          let chX = this.blockWidth*j;
          let chY = this.blockHeight*i+this.blockHeight*0.8; // y adjustment
          let charset = TC.common.getCharGroup(this.charGroups, this.screenSettingData[i][j].char);
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

// TC.ScreenManager private functions
TC.ScreenManager.prototype.getBackgroundWidthRecursive = function(i,j,bgUpdated){
  bgUpdated[i][j] = true;
  if(j+1<this.screenSetting.column
  && this.screenSettingData[i][j+1].isNew
  && this.screenSettingData[i][j].backgroundColor == this.screenSettingData[i][j+1].backgroundColor){
    return this.getBackgroundWidthRecursive(i,j+1,bgUpdated) + this.blockWidth;
  } else {
    return this.blockWidth;
  }
};
TC.ScreenManager.prototype.refreshScreen = function(){
  for(let i = 0; i <this.screenSettingData.length; i++){
    for(let j = 0; j<this.screenSettingData[i].length; j++){
      this.screenSettingData[i][j].isNew = true;
    }
  }
};
TC.ScreenManager.prototype.checkFontLoaded = function(){
  if(document.fonts.check('1em '+this.screenSetting.fontFamily)){
    this.isFontLoaded = true;
    this.refreshScreen();
  }
};
TC.ScreenManager.prototype.isInCanvas = function(x,y){
  if(x>=0 && y>=0 && y<this.screenSettingData.length && x<this.screenSettingData[y].length) return true;
  else return false;
};
TC.ScreenManager.prototype.initScreenData = function(){
  this.screenSettingData = [];
  for(let i = 0; i <this.screenSetting.row; i++){
    this.screenSettingData[i]=[];
    for(let j = 0; j<this.screenSetting.column; j++){
      this.screenSettingData[i][j]=new TC.ScreenManager_Char(this.screenSetting, ' ');
    }
  }
};
TC.ScreenManager.prototype.insertChar = function(x,y,char,color,backgroundColor){
  if(char.constructor != String) return console.error(char+' is invalid');

  if(this.isInCanvas(x,y)
  && (this.screenSettingData[y][x].char != char
    || this.screenSettingData[y][x].color != (color?color:this.screenSetting.defalutFontColor)
    || this.screenSettingData[y][x].backgroundColor != (backgroundColor?backgroundColor:this.screenSetting.backgroundColor)
    || (this.screenSettingData[y][x].char[0] == '$' && this.screenSettingData[y][x-1].isNew)
    )
  ){
    let regex = TC.common.getFullwidthRegex(this.charGroups);
    let fullwidth = regex.test(char);

    this.screenSettingData[y][x] = new TC.ScreenManager_Char(this.screenSetting, char,fullwidth,color,backgroundColor);

    // to clean background outliner
    if(this.isInCanvas(x-1,y)) this.screenSettingData[y][x-1].draw = true;
    if(this.isInCanvas(x+(fullwidth?2:1),y)) this.screenSettingData[y][x+(fullwidth?2:1)].draw = true;
  }
};
TC.ScreenManager.prototype.deleteChar = function(x,y){
  this.insertChar(x,y,' ');
};

// TC.ScreenManager public functions
TC.ScreenManager.prototype.fillScreen = function(char, color, backgroundColor){
  if(typeof char != 'string') char = ' ';
  this.screenSettingData = [];
  for(let i = 0; i <this.screenSetting.row; i++){
    this.screenSettingData[i]=[];
    for(let j = 0; j<this.screenSetting.column; j++){
      this.screenSettingData[i][j]=new TC.ScreenManager_Char(this.screenSetting, char, false, color, backgroundColor);
    }
  }
};
TC.ScreenManager.prototype.clearScreen = function(){
  this.fillScreen(' ');
};
TC.ScreenManager.prototype.insertText = function(x,y,text,color,backgroundColor){
  let regex = TC.common.getFullwidthRegex(this.charGroups);
  text = text.toString().replace(regex,'$1 ');
  if(y<0 || y>=this.screenSettingData.length) return;
  for(let i = 0; i<text.length; i++){
    if(x+i>=0 && x+i <this.screenSetting.column){
      this.insertChar(x+i,y,text[i],color,backgroundColor);

      let regex = TC.common.getFullwidthRegex(this.charGroups);
      let fullwidth = regex.test(text[i]);
      if(fullwidth){
        i++;
        this.insertChar(x+i,y,'$fullwidthFiller',color,backgroundColor);
      }
    }
  }
};
TC.ScreenManager.prototype.deleteText = function(x,y,text){
  let regex = TC.common.getFullwidthRegex(this.charGroups);
  text = text.toString().replace(regex,'$1 ');
  this.insertText(x,y,text.replace(/./g,' '));
};
TC.ScreenManager.prototype.copyScreen = function(){
  let copyToCanvas = document.createElement('canvas');
  let ctx = copyToCanvas.getContext('2d');
  copyToCanvas.width = this.canvas.width;
  copyToCanvas.height = this.canvas.height;
  ctx.drawImage(this.canvas, 0, 0);
  return copyToCanvas;
};
TC.ScreenManager.prototype.pasteScreen = function(canvas){
  this.ctx.drawImage(canvas, 0, 0);
};
TC.ScreenManager.prototype.consoleScreenData = function(canvas){
  for(let i = 0; i <this.screenSetting.row; i++){
    var row = '';
    for(let j = 0; j<this.screenSetting.column; j++){
      row += this.screenSettingData[i][j].char[0]+(this.screenSettingData[i][j].isNew?'!':' ');
    }
    console.log(row);
  }
};

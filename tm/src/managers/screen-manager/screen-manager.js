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
  this.screenData = [];
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

  this.scrollNum = 0;
  this.cursor = new TM.ScreenManager_Cursor({
    xMax: this.screenSetting.column-1,
    yMax: this.screenSetting.row-1,
    color: "gray",
    width: this.blockWidth,
    size: 0.1,
    isHidden: false,
  });

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

  for(var i=this.scrollNum; i<this.scrollNum+this.screenSetting.row; i++){
    for(var j=0; j<this.screenSetting.column; j++){
      if(this.screenData[i][j].isNew === true){

        //draw backgroundColor
        if(!bgUpdateMap[i][j]){
          var bgX = this.blockWidth*j;
          var bgY = this.blockHeight*(i-this.scrollNum);
          var width = this.getBackgroundWidthRecursive(i,j,bgUpdateMap);
          var height = this.blockHeight;
          ctx.fillStyle = this.screenData[i][j].backgroundColor;
          ctx.fillRect(bgX,bgY,width,height);
        }

        //draw char
        if(this.screenData[i][j].char && this.screenData[i][j].char[0] != '$'){
          var chX = this.blockWidth*j;
          var chY = this.blockHeight*(i-this.scrollNum)+this.blockHeight*0.8; // y adjustment
          var charset = TM.common.getCharGroup(this.charGroups, this.screenData[i][j].char);
          if(charset){
            ctx.font = this.screenSetting.fontSize*charset.sizeAdj+'px '+this.screenData[i][j].font;
            chX = chX+this.blockWidth*charset.xAdj;
            chY = chY+this.blockHeight*charset.yAdj;
          }
          else {
            ctx.font = this.screenSetting.fontSize+'px '+this.screenData[i][j].font;
          }
          ctx.fillStyle = this.screenData[i][j].color;
          ctx.fillText(this.screenData[i][j].char[0],chX,chY);
        }

        //do not draw once it already drew for the better performance
        this.screenData[i][j].isNew = false;
      }
    }
  }

  //draw.cursor
  if(!this.cursor.data.isHidden){
    var cursorWidth = this.cursor.data.width;
    var cursorHeight = this.blockHeight*this.cursor.data.size;
    var cursorX = this.blockWidth*this.cursor.data.x;
    var cursorY = (this.blockHeight)*(this.cursor.data.y)+(this.blockHeight-cursorHeight);
    ctx.fillStyle = this.cursor.data.color;
    ctx.fillRect(cursorX,cursorY,cursorWidth,cursorHeight);
    this.screenData[this.cursor.data.y][this.cursor.data.x].isNew = true;
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
};
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
};
TM.ScreenManager.prototype.getInitialBgUpdateMap = function(){
  var bgUpdateMap = [];
  for(var i=this.scrollNum; i<this.scrollNum+this.screenSetting.row; i++){
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
  && this.screenData[i][j+1].isNew
  && this.screenData[i][j].backgroundColor == this.screenData[i][j+1].backgroundColor){
    return this.getBackgroundWidthRecursive(i,j+1,bgUpdateMap) + this.blockWidth;
  } else {
    return this.blockWidth;
  }
};
TM.ScreenManager.prototype.refreshScreen = function(){
  for(var i=0; i<this.screenData.length; i++){
    for(var j=0; j<this.screenData[i].length; j++){
      this.screenData[i][j].isNew = true;
    }
  }
};
TM.ScreenManager.prototype.isInScreenData = function(x,y){
  if(x>=0 && y>=0 && y<this.screenData.length && x<this.screenData[y].length) return true;
  else return false;
};
TM.ScreenManager.prototype.initScreenData = function(){
  this.screenData = [];
  for(var i=this.scrollNum; i<this.scrollNum+this.screenSetting.row; i++){
    this.screenData[i]=[];
    for(var j=0; j<this.screenSetting.column; j++){
      this.screenData[i][j]=new TM.ScreenManager_Char(this.screenSetting, ' ');
    }
  }
};
TM.ScreenManager.prototype.insertCharAt = function(x,y,char,color,backgroundColor){
  this.cursor.move(x+1,y);
  if(this.isInScreenData(x,y+this.scrollNum)
  && (this.screenData[y+this.scrollNum][x].char != char
    || this.screenData[y+this.scrollNum][x].color != (color?color:this.screenSetting.defalutFontColor)
    || this.screenData[y+this.scrollNum][x].backgroundColor != (backgroundColor?backgroundColor:this.screenSetting.backgroundColor)
    || (this.screenData[y+this.scrollNum][x].char[0] == '$' && this.screenData[y][x-1].isNew)
    )
  ){
    var regex = TM.common.getFullwidthRegex(this.charGroups);
    var fullwidth = regex.test(char);

    this.screenData[y+this.scrollNum][x] = new TM.ScreenManager_Char(this.screenSetting, char,fullwidth,color,backgroundColor);

    // to clean background outliner
    if(this.isInScreenData(x-1,y+this.scrollNum)) this.screenData[y+this.scrollNum][x-1].draw = true;
    if(this.isInScreenData(x+(fullwidth?2:1),y+this.scrollNum)) this.screenData[y+this.scrollNum][x+(fullwidth?2:1)].draw = true;
  }
};
TM.ScreenManager.prototype.deleteCharAt = function(x,y){
  this.insertCharAt(x,y,' ');
};
TM.ScreenManager.prototype.showLoading = function(){
  this.insertTextAt(0,0,"Loading...");
};

// TM.ScreenManager public functions
TM.ScreenManager.prototype.onReady = function(func){
  if(this.checkReady()){
    this.onReadyFunc();
  }
  else {
    this.onReadyFunc = func;
  }
};
TM.ScreenManager.prototype.checkReady = function(){
  var isReady = false;

  var isFontReady = this.screenSetting.fontSource?this.isFontLoaded:true;

  isReady = isFontReady;
  return isReady;
};
TM.ScreenManager.prototype.fillScreen = function(char, color, backgroundColor){
  if(typeof char != 'string') char = ' ';
  this.screenData = [];
  for(var i=this.scrollNum; i<this.scrollNum+this.screenSetting.row; i++){
    this.screenData[i] = [];
    for(var j=0; j<this.screenSetting.column; j++){
      this.screenData[i][j] = new TM.ScreenManager_Char(this.screenSetting, char, false, color, backgroundColor);
    }
  }
};
TM.ScreenManager.prototype.scrollDown = function(){
  var buttomLine = this.scrollNum+this.screenSetting.row;
  if(!this.screenData[buttomLine]){
    this.screenData[buttomLine] = [];
    for(var j=0; j<this.screenSetting.column; j++){
      this.screenData[buttomLine][j] = new TM.ScreenManager_Char(this.screenSetting, ' ');
    }
  }
  this.scrollNum++;
  this.refreshScreen();
};
TM.ScreenManager.prototype.scrollUp = function(){
  if(this.scrollNum>0){
    this.scrollNum--;
  }
  this.refreshScreen();
};
TM.ScreenManager.prototype.clearScreen = function(){
  this.fillScreen(' ');
};
TM.ScreenManager.prototype.nextLine = function(x){
  this.cursor.nextLine(x);
};
TM.ScreenManager.prototype.insertText = function(text,color,backgroundColor){
  var regex = TM.common.getFullwidthRegex(this.charGroups);
  text = text.toString().replace(regex,'$1 ');

  for(
    var i = 0, x = this.cursor.data.x, y = this.cursor.data.y;
    x>=0 && i<text.length;
    i++, x++
  ){
    var fullwidth = regex.test(text[i]);
    if(x>=this.screenSetting.column){
      if(y<this.screenData.length-1) {
        y++;
      }
      else{
        this.scrollDown();
      }
      x = 0;
    }
    this.insertCharAt(x,y,text[i],color,backgroundColor);
    if(fullwidth){
      x++, i++;
      this.insertCharAt(x,y,'$fullwidthFiller',color,backgroundColor);
    }
  }
};
TM.ScreenManager.prototype.insertTextAt = function(x,y,text,color,backgroundColor){
  if(this.cursor.move(x,y)){
    this.insertText(text,color,backgroundColor);
  }
};
TM.ScreenManager.prototype.deleteTextAt = function(x,y,text){
  var regex = TM.common.getFullwidthRegex(this.charGroups);
  text = text.toString().replace(regex,'$1 ');
  this.insertTextAt(x,y,text.replace(/./g,' '));
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
  for(var i=this.scrollNum; i<this.scrollNum+this.screenSetting.row; i++){
    var row = '';
    for(var j=0; j<this.screenSetting.column; j++){
      row += this.screenData[i][j].char[0]+(this.screenData[i][j].isNew?'!':' ');
    }
    console.log(row);
  }
};

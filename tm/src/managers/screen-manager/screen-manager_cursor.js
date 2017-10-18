console.log('TM.ScreenManager_Cursor loaded');

//=============================
// TM.ScreenManager_Cursor
//=============================
// Object Type: TM.ILoopObject
TM.ScreenManager_Cursor = function(data){
  this.autoStart = true;
  this.speed = 500;
  this.data = {
    refScreenManager: undefined,
    x: 0,
    y: 0,
    xMax: undefined,
    yMax: undefined,
    color: "gray",
    width: this.blockWidth,
    size: 0.1,
    isHidden: false,
    isUpdated: true,
  };
  TM.ILoopObject.call(this, data, this.speed, this.autoStart);
};
TM.ScreenManager_Cursor.prototype = Object.create(TM.ILoopObject.prototype);
TM.ScreenManager_Cursor.prototype.constructor = TM.ScreenManager_Cursor;


// TM.ILoopObject function implementations
TM.ScreenManager_Cursor.prototype._init = function(){};
TM.ScreenManager_Cursor.prototype._destroy = function(){};
TM.ScreenManager_Cursor.prototype._calculate = function(){
  this.data.isHidden = !this.data.isHidden;
  this.data.isUpdated = true;
};
TM.ScreenManager_Cursor.prototype._draw = function(){};

// TM.ScreenManager_Cursor functions
TM.ScreenManager_Cursor.prototype.move = function(x,y){
  var isMoved = false;
  if(x>=0 && x<= this.data.xMax && y>=0 && y<= this.data.yMax){
    var screenMgr = this.data.refScreenManager;
    screenMgr.screenData[this.data.y+screenMgr.scrollOffsetY][this.data.x].isNew = true;
    isMoved = true;
    this.data.x = x;
    this.data.y = y;
  }
  return isMoved;
};
TM.ScreenManager_Cursor.prototype.nextLine = function(x){
  this.data.x = x?x:0;
  this.data.y++;
};
TM.ScreenManager_Cursor.prototype.hide = function(){
  this.data.isHidden = true;
  this.interval.stop();
};
TM.ScreenManager_Cursor.prototype.show = function(){
  this.data.isHidden = false;
  this.interval.start();
};

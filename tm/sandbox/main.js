var TMS = new TM.ScreenManager(),
    TMI = new TM.InputManager();

//=============================
// GameFrame
//=============================
// Object Type: TM.IObject
// Description: a sample game frame object
var GameFrame = function(data){
  this.data = {
    x: undefined,
    y: undefined,
    frame: [
      '+-----------<  My Game  >-----------+\n',
      '|                                   |\n',
      '|                                   |\n',
      '|                                   |\n',
      '|                                   |\n',
      '|                                   |\n',
      '|                                   |\n',
      '|                                   |\n',
      '+-----------------------------------+\n'
    ],
    todayText: null,
  };
  TM.IObject.call(this, data);
};
GameFrame.prototype = Object.create(TM.IObject.prototype);
GameFrame.prototype.constructor = GameFrame;

// TM.IObject functions implementation
GameFrame.prototype._init = function(){
  this.data.todayText = this.getTodayText();
  this.drawFrame();
  this.drawTodayText();
};
GameFrame.prototype._destroy = function(){
  this.deleteTodayText();
  this.deleteFrame();
};

// GameFrame functions
GameFrame.prototype.drawFrame = function(){
  TMS.cursor.move(this.data.x, this.data.y);
  for(var i=0; i<this.data.frame.length; i++){
    TMS.insertText(this.data.frame[i]);
  }
}
GameFrame.prototype.deleteFrame = function(){
  TMS.cursor.move(this.data.x, this.data.y);
  for(var i=0; i<this.data.frame.length; i++){
    TMS.deleteText(this.data.frame[i]);
  }
}
GameFrame.prototype.getTodayText = function(){
  var today = new Date();
  var year = today.getFullYear();
  var month = today.getMonth();
  var date = today.getDate();
  return year+'-'+month+'-'+date;
}
GameFrame.prototype.drawTodayText = function(){
  TMS.cursor.move(this.data.x+2, this.data.y+1);
  TMS.insertText(this.data.todayText);
}
GameFrame.prototype.deleteTodayText = function(){
  TMS.cursor.move(this.data.x+2, this.data.y+1);
  TMS.deleteText(this.data.todayText);
}

//=============================
// MovingObject
//=============================
// Object Type: TM.ILoopObject
// Description: a sample moving object
var MovingObject = function(data, speed){
  this.data = {
    x: undefined,
    y: undefined,
    dX: undefined, // x direction -1 or 1 (-1:left, 1:right)
    pX: null, // previous x position
    text: '[<>]',
    width: 4,
    turnCount: 0
  };
  TM.ILoopObject.call(this, data, speed);
};
MovingObject.prototype = Object.create(TM.ILoopObject.prototype);
MovingObject.prototype.constructor = MovingObject;

// TM.ILoopObject functions implementation
MovingObject.prototype._init = function(){
  this.data.pX = this.data.x;
};
MovingObject.prototype._destroy = function(){};
MovingObject.prototype._calculate = function(){
  this.data.turnCount++;
  this.updatePositions();
  this.changeDirection();
};
MovingObject.prototype._draw = function(){
  this.deleteSelf();
  this.drawSelf();
};

// MovingObject functions
MovingObject.prototype.drawSelf = function(){
  TMS.insertTextAt(this.data.x, this.data.y, this.data.text);
};
MovingObject.prototype.deleteSelf = function(){
  TMS.deleteTextAt(this.data.pX, this.data.y, this.data.text);
};
MovingObject.prototype.changeDirection = function(){
  if(this.data.turnCount%10 == 0){
    this.data.turnCount = 0;
    this.data.dX = (this.data.dX == 1)?-1:1;
  }
};
MovingObject.prototype.updatePositions = function(){
  this.data.pX = this.data.x;
  this.data.x += this.data.dX;
};

var KEYSET = {
  ESC: 27, // esc key
};

//=============================
// MovingObject
//=============================
// Object Type: TM.IProgram
// Description: a program control MovingObject and GameFrame
var TutorialProgram = function(){
  var speed = 100;
  this.data = {};
  this.objects = {
    gameFrame: null,
    movingObjects: [],
  }
  TM.IProgram.call(this, null, speed);
};
TutorialProgram.prototype = Object.create(TM.IProgram.prototype);
TutorialProgram.prototype.constructor = TutorialProgram;

// TM.IProgram functions implementation
TutorialProgram.prototype._init = function(){
  this.objects.gameFrame = new GameFrame({x:2,y:2});
};
TutorialProgram.prototype._destroy = function(){
  TMS.clearScreen();
};
TutorialProgram.prototype._calculate = function(){};
TutorialProgram.prototype._draw = function(){};
TutorialProgram.prototype._timeline = function(loopCount){
  if(loopCount ==  10) this.objects.movingObjects.push(new MovingObject({x:4,y:5,dX:1},200));
  if(loopCount ==  20) this.objects.movingObjects.push(new MovingObject({x:24,y:7,dX:-1},400));
  if(loopCount ==  30) this.objects.movingObjects.push(new MovingObject({x:16,y:9,dX:1},300));
};
TutorialProgram.prototype._getInput = function(){
  if(TMI.keyboard.checkKey(KEYSET.ESC)){
    this.destroy();
    this.init();
  }
};
var myTutorialProgram = new TutorialProgram();
myTutorialProgram.init();

console.log("game_object.js loaded");


function BaseObject(container){
  this.container = container;
  this.init();
}
BaseObject.prototype.init = function(){};
BaseObject.prototype.calculate = function(){};
BaseObject.prototype.draw = function(){};
BaseObject.prototype.destroy = function(){
  if(Array.isArray(this.container)){
    var i = container.indexOf(this);
    if (i >= 0) container.splice(i,1);
  }
};
BaseObject.prototype.loop = function(){
  this.calculate();
  this.draw();
};

function TextObject(container,properties,patternFunc){
  this.text=properties.text;
  this.length=properties.text.length;
  this.speed=common.isNumber(properties.speed)?properties.speed:null;
  this.speedCount=0;
  this.xN=this.x=common.isNumber(properties.x)?properties.x:0;
  this.yN=this.y=common.isNumber(properties.y)?properties.y:0;
  this.xD=common.isNumber(properties.xD)?properties.xD:0;
  this.yD=common.isNumber(properties.yD)?properties.yD:0;
  this.patternFunc=patternFunc;
  BaseObject.call(this, container);
}
TextObject.prototype = Object.create(BaseObject.prototype);
TextObject.prototype.constructor = TextObject;
TextObject.prototype.draw = function(){
  base.canvas.deleteText(this.x,this.y,this.text);
  this.x = this.xN;
  this.y = this.yN;
  base.canvas.insertText(this.x,this.y,this.text);
};
TextObject.prototype.calculate = function(){
  if(this.speed){
    if(this.speedCount >= this.speed){
      this.patternFunc();
      this.speedCount = 0;
    } else {
      this.speedCount++;
    }
  }
};
TextObject.prototype.setSpeed = function(speed){
  this.speed=speed;
};

function Star(container,properties){
  this.x = properties.x;
  this.y = properties.y;
  this.speed = properties.speed;
  this.speedCount = 0;
  this.data= {
    blank:0
  };
  BaseObject.call(this, container);
}
Star.prototype = Object.create(BaseObject.prototype);
Star.prototype.constructor = Star;
Star.prototype.draw = function () {
  if(this.data.blank%2===0) base.canvas.insertText(this.x,this.y,"★");
  else base.canvas.insertText(this.x,this.y,"☆");
};
Star.prototype.calculate = function () {
  if(this.speed){
    if(this.speedCount >= this.speed){
      this.patternFunc();
      this.speedCount = 0;
    } else {
      this.speedCount++;
    }
  }
};
Star.prototype.patternFunc = function () {
  this.data.blank = (this.data.blank+1)%2;
};

function Status(properties){
  this.x = properties.x;
  this.y = properties.y;
}
Status.prototype.drawFrame = function(){
  base.canvas.insertText(this.x, this.y+0, " LEVEL :");
  base.canvas.insertText(this.x, this.y+1, " GOAL  :");
  base.canvas.insertText(this.x, this.y+2, "+-  N E X T  -+ ");
  base.canvas.insertText(this.x, this.y+3, "|             | ");
  base.canvas.insertText(this.x, this.y+4, "|             | ");
  base.canvas.insertText(this.x, this.y+5, "|             | ");
  base.canvas.insertText(this.x, this.y+6, "|             | ");
  base.canvas.insertText(this.x, this.y+7, "+-- -  -  - --+ ");
  base.canvas.insertText(this.x, this.y+8, " YOUR SCORE :");
  base.canvas.insertText(this.x, this.y+10," LAST SCORE :");
  base.canvas.insertText(this.x, this.y+12," BEST SCORE :");
  base.canvas.insertText(this.x, this.y+15,"  △   : Shift        SPACE : Hard Drop");
  base.canvas.insertText(this.x, this.y+16,"◁  ▷ : Left / Right   P   : Pause");
  base.canvas.insertText(this.x, this.y+17,"  ▽   : Soft Drop     ESC  : Quit");
  base.canvas.insertText(this.x, this.y+20,"www.A-MEAN-Blog.com");
};
Status.prototype.drawNextBlock = function(blockType){
  for(var i=1;i<3;i++){
    for(var j=0;j<4;j++){
      var x = this.x+4+j*2;
      var y = this.y+3+i
      if(BLOCKS[blockType][0][i][j]==1) {
        base.canvas.insertText(x,y,"■");
      }
      else {
        base.canvas.insertText(x,y,"  ");
      }
    }
  }
};
Status.prototype.convertScore = function(score){
  var string = score.toString();
  var formatted = string.replace(/(\d)(?=(\d{3})+$)/g,'$1,');
  var offset = 10 - formatted.length;
  var padding = "";
  for(let i=offset;i>0;i--) padding+=" ";
  return padding+ formatted;
};
Status.prototype.drawScore = function(score){
  base.canvas.insertText(this.x+7, this.y+9, this.convertScore(score));
};
Status.prototype.drawLastScore = function(score){
  base.canvas.insertText(this.x+7, this.y+11, this.convertScore(score));
};
Status.prototype.drawBestScore = function(score){
  base.canvas.insertText(this.x+7, this.y+13, this.convertScore(score));
};

const ACTIVE_BLOCK = -2;
const CEILLING = -1;
const EMPTY = 0;
const WALL = 1;
const INACTIVE_BLOCK = 2;
const BLOCKS = [
  [[[0,0,0,0],[0,1,1,0],[0,1,1,0],[0,0,0,0]],[[0,0,0,0],[0,1,1,0],[0,1,1,0],[0,0,0,0]],[[0,0,0,0],[0,1,1,0],[0,1,1,0],[0,0,0,0]],[[0,0,0,0],[0,1,1,0],[0,1,1,0],[0,0,0,0]]],
  [[[0,0,0,0],[0,0,0,0],[1,1,1,1],[0,0,0,0]],[[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]],[[0,0,0,0],[0,0,0,0],[1,1,1,1],[0,0,0,0]],[[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]]],
  [[[0,0,0,0],[1,1,0,0],[0,1,1,0],[0,0,0,0]],[[0,0,0,0],[0,0,1,0],[0,1,1,0],[0,1,0,0]],[[0,0,0,0],[1,1,0,0],[0,1,1,0],[0,0,0,0]],[[0,0,0,0],[0,0,1,0],[0,1,1,0],[0,1,0,0]]],
  [[[0,0,0,0],[0,1,1,0],[1,1,0,0],[0,0,0,0]],[[0,0,0,0],[1,0,0,0],[1,1,0,0],[0,1,0,0]],[[0,0,0,0],[0,1,1,0],[1,1,0,0],[0,0,0,0]],[[0,0,0,0],[1,0,0,0],[1,1,0,0],[0,1,0,0]]],
  [[[0,0,0,0],[0,0,1,0],[1,1,1,0],[0,0,0,0]],[[0,0,0,0],[1,1,0,0],[0,1,0,0],[0,1,0,0]],[[0,0,0,0],[0,0,0,0],[1,1,1,0],[1,0,0,0]],[[0,0,0,0],[0,1,0,0],[0,1,0,0],[0,1,1,0]]],
  [[[0,0,0,0],[1,0,0,0],[1,1,1,0],[0,0,0,0]],[[0,0,0,0],[0,1,0,0],[0,1,0,0],[1,1,0,0]],[[0,0,0,0],[0,0,0,0],[1,1,1,0],[0,0,1,0]],[[0,0,0,0],[0,1,1,0],[0,1,0,0],[0,1,0,0]]],
  [[[0,0,0,0],[0,1,0,0],[1,1,1,0],[0,0,0,0]],[[0,0,0,0],[0,1,0,0],[0,1,1,0],[0,1,0,0]],[[0,0,0,0],[0,0,0,0],[1,1,1,0],[0,1,0,0]],[[0,0,0,0],[0,1,0,0],[1,1,0,0],[0,1,0,0]]]
];
function Tetris(properties,status){
  this.parentObjects = {};
  this.parentObjects.status = status;
  this.x = properties.x;
  this.y = properties.y;
  this.dropSpeed = 50;
  this.dropSpeedCount = 0;
  this.inputSpeed = 10;
  this.inputSpeedCount = 0;
  this.keyset = properties.keyset;
  this.colNum = 11;
  this.rowNum = 23;
  this.data= {
    dataArray:undefined,
    activeBlock:{
      type:undefined,
      rotation:undefined,
      x:undefined,
      y:undefined,
      inActivate:{
        flag:false,
        countMax:50,
        count:0
      },
    },
    nextBlockType:undefined,
  };
  BaseObject.call(this);
}
Tetris.prototype = Object.create(BaseObject.prototype);
Tetris.prototype.constructor = Tetris;
Tetris.prototype.init = function(){
  this.resetDataArray();
  this.createNewBlock();
};
Tetris.prototype.draw = function () {
  for(i=0;i<this.rowNum;i++){
    for(j=0;j<this.colNum;j++){
      var blockChar;
      switch(this.data.dataArray[i][j]){
        case EMPTY:
          blockChar="  ";
          break;
        case CEILLING:
          blockChar=". ";
          break;
        case WALL:
          blockChar="▣";
          break;
        case INACTIVE_BLOCK:
          blockChar="□";
          break;
        case ACTIVE_BLOCK:
          blockChar="■";
          break;
      }
      base.canvas.insertText(this.x+j*2,this.y+i,blockChar);
    }
  }
};
Tetris.prototype.calculate = function () {
  this.updateCeilling();
  this.autoDrop();
  this.updateActiveBlock();
  if(this.data.activeBlock.inActivate.flag) this.inActivateBlock();
  this.getInput();
};
Tetris.prototype.resetDataArray = function () {
  this.data.dataArray=[];
  for(i=0;i<this.rowNum;i++){
    this.data.dataArray[i]=[];
    for(j=0;j<this.colNum;j++){
      this.data.dataArray[i][j]=0;
    }
  }
  for(i=1;i<this.rowNum-1;i++){
    this.data.dataArray[i][0]=WALL;
    this.data.dataArray[i][this.colNum-1]=WALL;
  }
  for(j=0;j<this.colNum;j++){
    this.data.dataArray[this.rowNum-1][j]=WALL;
  }
};
Tetris.prototype.updateCeilling = function(){
  for(j=1;j<this.colNum-1;j++){
    if(this.data.dataArray[3][j]<=0) this.data.dataArray[3][j]=CEILLING;
  }
};
Tetris.prototype.createNewBlock = function(){
  var newBlock = this.data.activeBlock;
  newBlock.rotation = 0;
  newBlock.type = this.data.nextBlockType?this.data.nextBlockType:Math.floor(Math.random()*7);
  newBlock.x = Math.floor(this.colNum/2)-2;
  newBlock.y = 0;
  newBlock.inActivate.flag = false;
  newBlock.inActivate.count = this.data.activeBlock.inActivate.countMax;
  this.data.nextBlockType = Math.floor(Math.random()*7);
  this.updateActiveBlock();
  this.parentObjects.status.drawNextBlock(this.data.nextBlockType);
};
Tetris.prototype.updateActiveBlock = function(){
  var activeBlock= this.data.activeBlock;

  this.changeActiveBlockTo(EMPTY);

  for(var i=0;i<4;i++){
    for(var j=0;j<4;j++){
      if(BLOCKS[activeBlock.type][activeBlock.rotation][i][j]==1)
        this.data.dataArray[activeBlock.y+i][activeBlock.x+j]=ACTIVE_BLOCK;
    }
  }
};
Tetris.prototype.changeActiveBlockTo = function(to){
  for(var i=0;i<this.rowNum;i++){
    for(var j=0;j<this.colNum;j++){
      if(this.data.dataArray[i][j]==ACTIVE_BLOCK)
        this.data.dataArray[i][j]=to;
    }
  }
};
Tetris.prototype.getInput = function () {
  if(this.inputSpeedCount == 0){
    this.inputSpeedCount = this.inputSpeed;
    if(base.inputs.keyboard.check(this.keyset.RIGHT)){
      this.moveActiveBlock(1,0);
    }
    if(base.inputs.keyboard.check(this.keyset.LEFT)){
      this.moveActiveBlock(-1,0);
    }
    if(base.inputs.keyboard.check(this.keyset.DOWN)){
      this.moveDownActiveBlock();
    }
    if(base.inputs.keyboard.check(this.keyset.ROTATE)){
      this.rotateActiveBlock();
    }
  } else {
    this.inputSpeedCount--;
  }
};
Tetris.prototype.moveActiveBlock = function(x,y){
  var activeBlock = this.data.activeBlock;
  var xN = activeBlock.x+x;
  var yN = activeBlock.y+y;
  var moved = false;
  if(this.checkActiveBlockMove(activeBlock.type,activeBlock.rotation,xN,yN)){
    activeBlock.x = xN;
    activeBlock.y = yN;
    moved = true;
  }
  return moved;
};
Tetris.prototype.moveDownActiveBlock = function(){
  var activeBlock = this.data.activeBlock;
  var moved = this.moveActiveBlock(0,1);

  if(moved && this.checkActiveBlockMove(activeBlock.type,activeBlock.rotation,activeBlock.x,activeBlock.y+1)){
    activeBlock.inActivate.count = activeBlock.inActivate.countMax;
    activeBlock.inActivate.flag = false;
  }
  else {
    activeBlock.inActivate.flag = true;
  }
};
Tetris.prototype.rotateActiveBlock = function(){
  var activeBlock = this.data.activeBlock;
  var rN = (activeBlock.rotation+1)%4;
  var moved = false;
  if(this.checkActiveBlockMove(activeBlock.type,rN,activeBlock.x,activeBlock.y)){
    activeBlock.rotation = rN;
    moved = true;
  } else if(this.checkActiveBlockMove(activeBlock.type,rN,activeBlock.x,activeBlock.y-1)){
    activeBlock.rotation = rN;
    activeBlock.y -= 1;
    moved = true;
  }
  return moved;
};
Tetris.prototype.checkActiveBlockMove = function(type,rN,xN,yN){
  var activeBlock = this.data.activeBlock;
  for(var i=0;i<4;i++){
    for(var j=0;j<4;j++){
      if(BLOCKS[type][rN][i][j]==1
      && this.data.dataArray[yN+i][xN+j] > 0){
        return false;
      }
    }
  }
  return true;
};
Tetris.prototype.autoDrop = function(){
  var activeBlock= this.data.activeBlock;
  if(this.dropSpeedCount >= this.dropSpeed){
    this.dropSpeedCount = 0;
    this.moveDownActiveBlock();
  } else {
    this.dropSpeedCount++;
  }
};
Tetris.prototype.inActivateBlock = function(){
  var activeBlock = this.data.activeBlock;
  if(!this.checkActiveBlockMove(activeBlock.type,activeBlock.rotation,activeBlock.x,activeBlock.y+1) && --activeBlock.inActivate.count < 0){
    activeBlock.inActivate.count = activeBlock.inActivate.countMax;
    this.updateActiveBlock();
    this.changeActiveBlockTo(INACTIVE_BLOCK);
    this.createNewBlock();
  }
};

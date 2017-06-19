console.log("game_object.js loaded");

function Star(parent,values){
  this.parent = parent;
  this.x = values.x;
  this.y = values.y;
  this.speed = values.speed;
  this.speedCount = 0;
  this.data= {
    blank:0
  };
  this.init();
}
Star.prototype.init = function(){
  this.parent.push(this);
};
Star.prototype.destroy = function(){
  var i = this.parent.indexOf(this);
  this.parent.splice(i,1);
};
Star.prototype.loop = function () {
  if(this.speed){
    if(this.speedCount >= this.speed){
      this.calculate();
      this.speedCount = 0;
    } else {
      this.speedCount++;
    }
  }
  this.draw();
};
Star.prototype.draw = function () {
  if(this.data.blank%2===0) base.screen.insertText(this.x,this.y,"★");
  else base.screen.insertText(this.x,this.y,"☆");
};
Star.prototype.calculate = function () {
  this.data.blank = (this.data.blank+1)%2;
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
function Tetris(parent,values){
  this.parent = parent;
  this.x = values.x;
  this.y = values.y;
  this.dropSpeed = 100;
  this.dropSpeedCount = 0;
  this.inputSpeed = 10;
  this.inputSpeedCount = 0;
  this.keyset = values.keyset;
  this.colNum = 11;
  this.rowNum = 23;
  this.data= {
    dataArray:undefined,
    activeBlock:{
      x:undefined,
      y:undefined,
      type:undefined,
      rotation:undefined,
    },
    nextBlockType:undefined,
  };
  this.init();
}
Tetris.prototype.init = function(){
  this.parent.push(this);
  this.resetDataArray();
  this.createNewBlock();
};
Tetris.prototype.destroy = function(){
  var i = this.parent.indexOf(this);
  this.parent.splice(i,1);
};
Tetris.prototype.loop = function () {
  this.calculate();
  this.draw();
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
      base.screen.insertText(this.x+j*2,this.y+i,blockChar);
    }
  }

};
Tetris.prototype.calculate = function () {
  this.updateCeilling();
  this.updateActiveBlock();
  this.autoDrop();
  this.updateInput();
};
Tetris.prototype.updateInput = function () {
  if(this.inputSpeedCount == 0){
    if(base.inputs.keyboard.check(this.keyset.RIGHT)){
      this.moveActiveBlock(1,0);
      this.inputSpeedCount =this.inputSpeed;
    }
    else if(base.inputs.keyboard.check(this.keyset.LEFT)){
      this.moveActiveBlock(-1,0);
      this.inputSpeedCount =this.inputSpeed;
    }
    else if(base.inputs.keyboard.check(this.keyset.DOWN)){
      this.moveActiveBlock(0,1);
      this.inputSpeedCount =this.inputSpeed;
    }
  } else {
    this.inputSpeedCount--;
  }
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
Tetris.prototype.updateCeilling= function(){
  for(j=1;j<this.colNum-1;j++){
    this.data.dataArray[3][j]=CEILLING;
  }
};
Tetris.prototype.createNewBlock= function(){
  var newBlock= {
    x: Math.floor(this.colNum/2)-2,
    y: 0,
    rotation: 0,
    type: this.data.nextBlockType?this.data.nextBlockType:Math.floor(Math.random()*7),
  };
  this.data.activeBlock = newBlock;
  this.data.nextBlockType=Math.floor(Math.random()*7);
  this.updateActiveBlock();
  this.drawNextBlock();
};

Tetris.prototype.drawNextBlock= function(){
  for(var i=1;i<3;i++){
    for(var j=0;j<4;j++){
      if(BLOCKS[this.data.nextBlockType][0][i][j]==1) {
        base.screen.insertText(32+j*2,6+i,"■");
      }
      else {
        base.screen.insertText(32+j*2,6+i," ");
      }
    }
  }
};
Tetris.prototype.updateActiveBlock= function(){
  var activeBlock= this.data.activeBlock;

  this.deleteActiveBlock();

  for(var i=0;i<4;i++){
    for(var j=0;j<4;j++){
      if(BLOCKS[activeBlock.type][activeBlock.rotation][i][j]==1)
        this.data.dataArray[activeBlock.y+i][activeBlock.x+j]=ACTIVE_BLOCK;
    }
  }
};
Tetris.prototype.deleteActiveBlock= function(){
  for(var i=0;i<this.rowNum;i++){
    for(var j=0;j<this.colNum;j++){
      if(this.data.dataArray[i][j]==ACTIVE_BLOCK)
        this.data.dataArray[i][j]=EMPTY;
    }
  }
};

Tetris.prototype.moveActiveBlock= function(x,y){
  var activeBlock= this.data.activeBlock;
  activeBlock.x+=x;
  activeBlock.y+=y;
};


Tetris.prototype.autoDrop= function(){
  // var activeBlock= this.data.activeBlock;
  // if(this.dropSpeedCount >= this.dropSpeed){
  //   this.dropSpeedCount = 0;
  //   this.data.activeBlock.y++;
  // } else {
  //   this.dropSpeedCount++;
  // }
};

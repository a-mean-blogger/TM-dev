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

function Tetris(parent,values){
  this.parent = parent;
  this.x = values.x;
  this.y = values.y;
  this.speed = values.speed;
  this.speedCount = 0;
  this.colNum = 11;
  this.rowNum = 23;
  this.data= {
    dataArray:undefined,
    activeBlock:undefined,
  };
  this.init();
}
Tetris.prototype.init = function(){
  this.parent.push(this);
  this.resetDataArray();
};
Tetris.prototype.destroy = function(){
  var i = this.parent.indexOf(this);
  this.parent.splice(i,1);
};
Tetris.prototype.loop = function () {
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
          blockChar="▣";
          break;
      }
      base.screen.insertText(this.x+j*2,this.y+i,blockChar);
    }
  }

};
Tetris.prototype.calculate = function () {

};
const ACTIVE_BLOCK = -2;
const CEILLING = -1;
const EMPTY = 0;
const WALL = 1;
const INACTIVE_BLOCK = 2;
Tetris.prototype.resetDataArray = function () {
  this.data.dataArray=[];
  for(i=0;i<this.rowNum;i++){
    this.data.dataArray[i]=[];
    for(j=0;j<this.colNum;j++){
      this.data.dataArray[i][j]=0;
    }
  }
  for(j=1;j<this.colNum;j++){
    this.data.dataArray[3][j]=CEILLING;
  }
  for(i=1;i<this.rowNum-1;i++){
    this.data.dataArray[i][0]=WALL;
    this.data.dataArray[i][this.colNum-1]=WALL;
  }
  for(j=0;j<this.colNum;j++){
    this.data.dataArray[this.rowNum-1][j]=WALL;
  }
}

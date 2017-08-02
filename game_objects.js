console.log("game_object.js loaded");

function TextObject(speed, data, patternFunc){
  this.autoStart = true;
  this.data = {
    x: undefined,
    y: undefined,
    text: "",
    previous: {
      x: undefined,
      y: undefined,
    },
  };
  this.patternFunc = patternFunc;
  tbCanvas.LoopObject.call(this, speed, data, this.autoStart);
}
TextObject.prototype = Object.create(tbCanvas.LoopObject.prototype);
TextObject.prototype.constructor = TextObject;

TextObject.prototype.draw = function(){
  game.tbScreen.deleteText(this.data.previous.x,this.data.previous.y,this.data.text);
  this.data.previous.x = this.data.x;
  this.data.previous.y = this.data.y;
  game.tbScreen.insertText(this.data.x,this.data.y,this.data.text);
};
TextObject.prototype.calculate = function(){
  this.patternFunc();
};
TextObject.prototype.destroy = function(){
  tbCanvas.LoopObject.prototype.destroy.call(this);
};

const BLOCKS = [
  [[[0,0,0,0],[0,1,1,0],[0,1,1,0],[0,0,0,0]],[[0,0,0,0],[0,1,1,0],[0,1,1,0],[0,0,0,0]],[[0,0,0,0],[0,1,1,0],[0,1,1,0],[0,0,0,0]],[[0,0,0,0],[0,1,1,0],[0,1,1,0],[0,0,0,0]]],
  [[[0,0,0,0],[0,0,0,0],[1,1,1,1],[0,0,0,0]],[[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]],[[0,0,0,0],[0,0,0,0],[1,1,1,1],[0,0,0,0]],[[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]]],
  [[[0,0,0,0],[1,1,0,0],[0,1,1,0],[0,0,0,0]],[[0,0,0,0],[0,0,1,0],[0,1,1,0],[0,1,0,0]],[[0,0,0,0],[1,1,0,0],[0,1,1,0],[0,0,0,0]],[[0,0,0,0],[0,0,1,0],[0,1,1,0],[0,1,0,0]]],
  [[[0,0,0,0],[0,1,1,0],[1,1,0,0],[0,0,0,0]],[[0,0,0,0],[1,0,0,0],[1,1,0,0],[0,1,0,0]],[[0,0,0,0],[0,1,1,0],[1,1,0,0],[0,0,0,0]],[[0,0,0,0],[1,0,0,0],[1,1,0,0],[0,1,0,0]]],
  [[[0,0,0,0],[0,0,1,0],[1,1,1,0],[0,0,0,0]],[[0,0,0,0],[1,1,0,0],[0,1,0,0],[0,1,0,0]],[[0,0,0,0],[0,0,0,0],[1,1,1,0],[1,0,0,0]],[[0,0,0,0],[0,1,0,0],[0,1,0,0],[0,1,1,0]]],
  [[[0,0,0,0],[1,0,0,0],[1,1,1,0],[0,0,0,0]],[[0,0,0,0],[0,1,0,0],[0,1,0,0],[1,1,0,0]],[[0,0,0,0],[0,0,0,0],[1,1,1,0],[0,0,1,0]],[[0,0,0,0],[0,1,1,0],[0,1,0,0],[0,1,0,0]]],
  [[[0,0,0,0],[0,1,0,0],[1,1,1,0],[0,0,0,0]],[[0,0,0,0],[0,1,0,0],[0,1,1,0],[0,1,0,0]],[[0,0,0,0],[0,0,0,0],[1,1,1,0],[0,1,0,0]],[[0,0,0,0],[0,1,0,0],[1,1,0,0],[0,1,0,0]]]
];

function Star(speed, data){
  this.autoStart = true;
  this.data = {
    x: undefined,
    y: undefined,
    color: undefined,
    blink: 0,
  };
  tbCanvas.LoopObject.call(this, speed, data, this.autoStart);
}
Star.prototype = Object.create(tbCanvas.LoopObject.prototype);
Star.prototype.constructor = Star;

Star.prototype.calculate = function(){
  this.data.blink = (this.data.blink+1)%2;
};
Star.prototype.draw = function(){
  let text = this.data.blink%2===0?"★":"☆";
  game.tbScreen.insertText(this.data.x,this.data.y,text,this.data.color);
};
Star.prototype.destroy = function(){
  game.tbScreen.insertText(this.data.x,this.data.y,"  ");
  tbCanvas.LoopObject.prototype.destroy.call(this);
};

function Pause(speed, data){
  this.autoStart = true;
  this.data = {
    x: undefined,
    y: undefined,
    bgColor: undefined,
    blink: 0,
    text: "Please press <P> to return to game",
  };
  tbCanvas.LoopObject.call(this, speed, data, this.autoStart);
}
Pause.prototype = Object.create(tbCanvas.LoopObject.prototype);
Pause.prototype.constructor = Pause;

Pause.prototype.init = function(){
  this.drawFrame();
  tbCanvas.LoopObject.prototype.init.call(this);
};
Pause.prototype.drawFrame = function(){
  game.tbScreen.insertText(this.data.x,this.data.y,  "┏━━━━━━━━━━━━━━━━━━┓","#fff",this.data.bgColor);
  game.tbScreen.insertText(this.data.x,this.data.y+1,"┃                  ┃","#fff",this.data.bgColor);
  game.tbScreen.insertText(this.data.x,this.data.y+2,"┃                  ┃","#fff",this.data.bgColor);
  game.tbScreen.insertText(this.data.x,this.data.y+3,"┗━━━━━━━━━━━━━━━━━━┛","#fff",this.data.bgColor);
  game.tbScreen.insertText(this.data.x+14,this.data.y+1,"[ PAUSED ]","#fff",this.data.bgColor);
};

Pause.prototype.calculate = function(){
  this.data.blink = (this.data.blink+1)%2;
};
Pause.prototype.draw = function(){
  let color = this.data.blink%2===0?"#fff":"gray";
  game.tbScreen.insertText(this.data.x+3,this.data.y+2,this.data.text,color,this.data.bgColor);
};

function Status(data){
  this.data = {
    x: undefined,
    y: undefined,
    colorset: undefined,
    lastScore: 0,
    bestScore: 0,
  };
  tbCanvas.Object.call(this, data);
}
Status.prototype = Object.create(tbCanvas.Object.prototype);
Status.prototype.constructor = Status;

Status.prototype.init = function(){
  this.drawFrame();
  this.drawLastScore(this.data.lastScore);
  this.drawBestScore(this.data.bestScore);
};
Status.prototype.drawFrame = function(){
  game.tbScreen.insertText(this.data.x,   this.data.y+ 0, " LEVEL :");
  game.tbScreen.insertText(this.data.x,   this.data.y+ 1, " GOAL  :");
  game.tbScreen.insertText(this.data.x,   this.data.y+ 2, "┍      ┑");
  game.tbScreen.insertText(this.data.x+4, this.data.y+ 2, "N E X T");
  game.tbScreen.insertText(this.data.x,   this.data.y+ 3, "│      │");
  game.tbScreen.insertText(this.data.x,   this.data.y+ 4, "│      │");
  game.tbScreen.insertText(this.data.x,   this.data.y+ 5, "│      │");
  game.tbScreen.insertText(this.data.x,   this.data.y+ 6, "│      │");
  game.tbScreen.insertText(this.data.x,   this.data.y+ 7, "┕━━━━━━┙");
  game.tbScreen.insertText(this.data.x,   this.data.y+ 8, " YOUR SCORE :");
  game.tbScreen.insertText(this.data.x,   this.data.y+10, " LAST SCORE :");
  game.tbScreen.insertText(this.data.x,   this.data.y+12, " BEST SCORE :");
  game.tbScreen.insertText(this.data.x,   this.data.y+15, "  △   : Shift        SPACE : Hard Drop");
  game.tbScreen.insertText(this.data.x,   this.data.y+16, "◁  ▷ : Left / Right   P   : Pause");
  game.tbScreen.insertText(this.data.x,   this.data.y+17, "  ▽   : Soft Drop     ESC  : Quit");
  game.tbScreen.insertText(this.data.x,   this.data.y+20, "www.A-MEAN-Blog.com");
};
Status.prototype.drawNextBlock = function(blockType){
  let xOffset = (blockType === 0 || blockType === 1)?-1:0;
  let color = this.data.colorset.block[blockType];
  let xAdj = this.data.x+5;
  let yAdj = this.data.y+3;
  for(let i=1;i<3;i++){
    for(let j=0;j<5;j++){
      let x = xAdj-2+j*2;
      let y = yAdj+i;
      game.tbScreen.insertText(x,y,"  ");
    }
  }
  for(let i=1;i<3;i++){
    for(let j=0;j<4;j++){
      let x = xAdj+j*2+xOffset;
      let y = yAdj+i;
      if(BLOCKS[blockType][0][i][j]==1) {
        game.tbScreen.insertText(x,y,"■", color);
      }
    }
  }
};
Status.prototype.convertScore = function(score){
  let string = Math.floor(score).toString();
  let formatted = string.replace(/(\d)(?=(\d{3})+$)/g,'$1,');
  let offset = 10 - formatted.length;
  let padding = "";
  for(let i=offset;i>0;i--) padding+=" ";
  return padding+ formatted;
};
Status.prototype.drawLevel = function(num){
  num = (num>9)?num:" "+num;
  game.tbScreen.insertText(this.data.x+9, this.data.y, num);
};
Status.prototype.drawGoal = function(num){
  num = (num>9)?num:" "+num;
  game.tbScreen.insertText(this.data.x+9, this.data.y+1, num);
};
Status.prototype.drawScore = function(score){
  game.tbScreen.insertText(this.data.x+7, this.data.y+9, this.convertScore(score));
};
Status.prototype.drawLastScore = function(score){
  game.tbScreen.insertText(this.data.x+7, this.data.y+11, this.convertScore(score));
};
Status.prototype.drawBestScore = function(score){
  game.tbScreen.insertText(this.data.x+7, this.data.y+13, this.convertScore(score));
};

function Tetris(data, status){
  this.autoStart = true;
  this.refStatus = status;
  this.colNum = 11;
  this.rowNum = 23;
  this.speedLookup = [80,60,40,20,10,8,4,2,1,0];
  this.data = {
    x: undefined,
    y: undefined,
    keyset: undefined,
    colorset: undefined,
    level: 1,
    goalCount: 10,
    goalCountMax: 10,
    score: 0,
    inputSpeedCountMax: 10,
    inputSpeedCount: 0,
    autoDropCountMax: 80,
    autoDropCount: 0,
    dataArray: null,
    activeBlock: {
      type: null,
      rotation: null,
      x: null,
      y: null,
      inActivate1: {
        flag: false,
        count: 0,
        countMax: 50,
      },
      inActivate2: {
        flag: false,
        count: 0,
        countMax: 10,
      },
    },
    nextBlockType: null,
    gameOver: {
      flag: false,
      count: 0,
      countMax: 30,
    },
  };
  tbCanvas.LoopObject.call(this, 10, data, this.autoStart);
}
Tetris.prototype = Object.create(tbCanvas.LoopObject.prototype);
Tetris.prototype.constructor = Tetris;

  Tetris.ACTIVE_BLOCK = -2;
  Tetris.CEILING = -1;
  Tetris.EMPTY = 0;
  Tetris.WALL = 1;
  Tetris.STAR = 100;

Tetris.prototype.init = function(){
  this.resetDataArray();
  this.createNewBlock();
  this.setSpeed(this.data.level);
  this.refStatus.drawLevel(this.data.level);
  this.refStatus.drawGoal(this.data.goalCount);
  this.refStatus.drawScore(this.data.score);
  tbCanvas.LoopObject.prototype.init.call(this);


  this.test = new tbCanvas.DevTask('test',
    this.data,
    function(){
      let activeBlock = this.data.activeBlock;
      this.output =
      `activeBlock.type: ${activeBlock.type}
      activeBlock.rotation: ${activeBlock.rotation}
      activeBlock.x: ${activeBlock.x}
      activeBlock.y: ${activeBlock.y}
      nextBlockType: ${this.data.nextBlockType}
      inActivate1.flag: ${activeBlock.inActivate1.flag}
      inActivate1.count: ${activeBlock.inActivate1.count}
      inActivate2.flag: ${activeBlock.inActivate2.flag}
      inActivate2.count: ${activeBlock.inActivate2.count}
      speed: ${this.data.autoDropCountMax}
      `;
    });
};
Tetris.prototype.draw = function(){
  let activeBlock = this.data.activeBlock;

  for(let i=0;i<this.rowNum;i++){
    for(let j=0;j<this.colNum;j++){
      let blockChar;
      let color;
      switch(this.data.dataArray[i][j]){
        case Tetris.ACTIVE_BLOCK: //-2
          blockChar="□";
          color = this.data.colorset.block[activeBlock.type];
          break;
        case Tetris.CEILING: // -1
          blockChar="•";
          color = this.data.colorset.ceiling;
          break;
        case Tetris.EMPTY: //0
          blockChar="  ";
          break;
        case Tetris.WALL: // 1
          blockChar="▣";
          color = this.data.colorset.wall;
          break;
        case Tetris.STAR: // 1
          blockChar="☆";
          color = this.data.colorset.star;
          break;
        default: // 2~
          blockChar="■";
          color = this.data.colorset.block[this.data.dataArray[i][j]-2];
          break;
      }
      game.tbScreen.insertText(this.data.x+j*2,this.data.y+i,blockChar,color);
    }
  }
};
Tetris.prototype.calculate = function(){
  this.updateCeilling();
  this.autoDrop();
  this.updateActiveBlock();
  if(this.data.activeBlock.inActivate1.flag) this.inActivateBlock();
  this.getInput();
};
Tetris.prototype.destroy = function (blockType) {
  this.test.destroy();
  tbCanvas.LoopObject.prototype.destroy.call(this);
};
Tetris.prototype.resetDataArray = function(){
  this.data.dataArray=[];
  for(let i=0;i<this.rowNum;i++){
    this.data.dataArray[i]=[];
    for(let j=0;j<this.colNum;j++){
      this.data.dataArray[i][j]=0;
    }
  }
  for(let i=1;i<this.rowNum-1;i++){
    this.data.dataArray[i][0]=Tetris.WALL;
    this.data.dataArray[i][this.colNum-1]=Tetris.WALL;
  }
  for(let j=0;j<this.colNum;j++){
    this.data.dataArray[this.rowNum-1][j]=Tetris.WALL;
  }
};
Tetris.prototype.updateCeilling = function(){
  for(let j=1;j<this.colNum-1;j++){
    if(this.data.dataArray[3][j]<=0) this.data.dataArray[3][j]=Tetris.CEILING;
  }
};
Tetris.prototype.createNewBlock = function(){
  let newBlock = this.data.activeBlock;
  newBlock.rotation = 0;
  newBlock.type = tbCanvas.common.isNumber(this.data.nextBlockType)?this.data.nextBlockType:Math.floor(Math.random()*7);
  newBlock.x = Math.floor(this.colNum/2)-1;
  newBlock.y = 0;
  newBlock.inActivate1.flag = false;
  newBlock.inActivate1.count = 0;
  newBlock.inActivate2.flag = false;
  newBlock.inActivate2.count = 0;
  this.data.nextBlockType = Math.floor(Math.random()*7);
  this.updateActiveBlock();
  this.refStatus.drawNextBlock(this.data.nextBlockType);
};
Tetris.prototype.updateActiveBlock = function(){
  let activeBlock= this.data.activeBlock;

  if(!activeBlock.inActivate2.flag){
    this.changeActiveBlockTo(Tetris.EMPTY);

    for(let i=0;i<4;i++){
      for(let j=0;j<4;j++){
        if(BLOCKS[activeBlock.type][activeBlock.rotation][i][j]==1)
          this.data.dataArray[activeBlock.y+i][activeBlock.x+j]=Tetris.ACTIVE_BLOCK;
      }
    }
  }
};
Tetris.prototype.changeActiveBlockTo = function(to){
  for(let i=0;i<this.rowNum;i++){
    for(let j=0;j<this.colNum;j++){
      if(this.data.dataArray[i][j]==Tetris.ACTIVE_BLOCK)
        this.data.dataArray[i][j]=to;
    }
  }
};
Tetris.prototype.getInput = function(){
  if(++this.data.inputSpeedCount > this.data.inputSpeedCountMax){
    this.data.inputSpeedCount = 0;
    if(tbCanvas.inputs.keyboard.checkKey(this.data.keyset.RIGHT)){
      this.moveActiveBlock(1,0);
    }
    if(tbCanvas.inputs.keyboard.checkKey(this.data.keyset.LEFT)){
      this.moveActiveBlock(-1,0);
    }
    if(tbCanvas.inputs.keyboard.checkKey(this.data.keyset.DOWN)){
      this.moveDownActiveBlock();
    }
    if(tbCanvas.inputs.keyboard.checkKey(this.data.keyset.ROTATE)){
      this.rotateActiveBlock();
    }
    if(tbCanvas.inputs.keyboard.checkKey(this.data.keyset.DROP)){
      this.hardDrop();
    }
  }
};
Tetris.prototype.hardDrop = function(){
  let activeBlock = this.data.activeBlock;

  if(this.moveDownActiveBlock()){
    this.addScore(this.data.level/2);
    this.hardDrop();
  } else {
    activeBlock.inActivate1.count = activeBlock.inActivate1.countMax;
  }
};
Tetris.prototype.moveActiveBlock = function(x,y){
  let activeBlock = this.data.activeBlock;
  let xN = activeBlock.x+x;
  let yN = activeBlock.y+y;
  let moved = false;
  if(this.checkActiveBlockMove(activeBlock.type,activeBlock.rotation,xN,yN)){
    activeBlock.x = xN;
    activeBlock.y = yN;
    moved = true;
  }
  return moved;
};
Tetris.prototype.moveDownActiveBlock = function(){
  let activeBlock = this.data.activeBlock;
  let moved = this.moveActiveBlock(0,1);

  if(moved){
    activeBlock.inActivate1.count = 0;
    if(this.checkActiveBlockMove(activeBlock.type,activeBlock.rotation,activeBlock.x,activeBlock.y+1)){
      activeBlock.inActivate1.flag = false;
    }
  }
  else {
    activeBlock.inActivate1.flag = true;
  }
  return moved;
};
Tetris.prototype.rotateActiveBlock = function(){
  let activeBlock = this.data.activeBlock;
  let rN = (activeBlock.rotation+1)%4;
  let moved = false;
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
  let activeBlock = this.data.activeBlock;
  for(let i=0;i<4;i++){
    for(let j=0;j<4;j++){
      if(BLOCKS[type][rN][i][j]==1
      && this.data.dataArray[yN+i][xN+j] > 0){
        return false;
      }
    }
  }
  return true;
};
Tetris.prototype.autoDrop = function(){
  if(++this.data.autoDropCount > this.data.autoDropCountMax){
    this.data.autoDropCount = 0;
    this.moveDownActiveBlock();
  }
};
Tetris.prototype.inActivateBlock = function(){
  let activeBlock = this.data.activeBlock;

  if(!activeBlock.inActivate2.flag
  && ++activeBlock.inActivate1.count > activeBlock.inActivate1.countMax){
    if(!this.checkActiveBlockMove(activeBlock.type,activeBlock.rotation,activeBlock.x,activeBlock.y+1)){
      activeBlock.inActivate2.flag = true;
      this.updateActiveBlock();
      this.changeActiveBlockTo(this.data.activeBlock.type+2);
      this.changeFullLinesToStar();
    }
  }
  else if(activeBlock.inActivate2.flag
  && ++activeBlock.inActivate2.count > activeBlock.inActivate2.countMax){
    activeBlock.inActivate1.count = 0;
    activeBlock.inActivate2.count = 0;
    this.removeFullLines();
    if(this.checkGameOver()){
      this.gameOver();
    }
    else {
      this.createNewBlock();
    }
  }

};
Tetris.prototype.changeFullLinesToStar = function(){
  for(let i=this.rowNum-2;i>=0;i--){
    let occupiedCount = 0;
    for(let j=1;j<this.colNum-1;j++){
      if(this.data.dataArray[i][j]>0) occupiedCount++;
    }
    if(occupiedCount == this.colNum-2){
      for(let j=1;j<this.colNum-1;j++){
        this.data.dataArray[i][j] = Tetris.STAR;
      }
    }
  }
};
Tetris.prototype.removeFullLines = function(){
  let removedLineNum = 0;
  for(let i=this.rowNum-2;i>=0;i--){
    let occupiedCount = 0;
    for(let j=1;j<this.colNum-1;j++){
      if(removedLineNum){
        if(i<removedLineNum) this.data.dataArray[i][j] = 0;
        else if(i === 0 || this.data.dataArray[i-removedLineNum][j] == Tetris.CEILING) this.data.dataArray[i][j] = Tetris.EMPTY;
        else this.data.dataArray[i][j] = this.data.dataArray[i-removedLineNum][j];
      }
      if(this.data.dataArray[i][j]>0) occupiedCount++;
    }
    if(occupiedCount == this.colNum-2){
      i++;
      removedLineNum++;
      this.addScore(100 * this.data.level);

      if(--this.data.goalCount === 0) this.levelUp();
      else this.refStatus.drawGoal(this.data.goalCount);
    }
  }
};
Tetris.prototype.addScore = function(score){
  this.data.score += score;
  this.refStatus.drawScore(this.data.score);
};
Tetris.prototype.setSpeed = function(level){
  if(level<=this.speedLookup.length){
    this.data.autoDropCountMax = this.speedLookup[this.data.level-1];
  }else{
    this.data.autoDropCountMax = this.speedLookup[this.speedLookup.length-1];
  }
};
Tetris.prototype.levelUp = function(){
  this.data.level++;
  this.data.goalCount = this.data.goalCountMax;
  this.setSpeed(this.data.level);
  this.refStatus.drawGoal(this.data.goalCount);
  this.refStatus.drawLevel(this.data.level);
};
Tetris.prototype.checkGameOver = function(){
  for(let j=1;j<this.colNum-1;j++){
    if(this.data.dataArray[3][j]>0) return true;
  }
};
Tetris.prototype.gameOver = function(){
  this.data.gameOver.flag = true;
};

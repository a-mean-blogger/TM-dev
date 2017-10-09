console.log("tetris-object.js loaded");

// function TextObject(speed, data, patternFunc){
//   this.autoStart = true;
//   this.data = {
//     x: undefined,
//     y: undefined,
//     text: "",
//     previous: {
//       x: undefined,
//       y: undefined,
//     },
//   };
//   this.patternFunc = patternFunc;
//   TC.LoopObject.call(this, speed, data, this.autoStart);
// }
// TextObject.prototype = Object.create(TC.LoopObject.prototype);
// TextObject.prototype.constructor = TextObject;
//
// TextObject.prototype.draw = function(){
//   MAIN.TCS.deleteText(this.data.previous.x,this.data.previous.y,this.data.text);
//   this.data.previous.x = this.data.x;
//   this.data.previous.y = this.data.y;
//   MAIN.TCS.insertText(this.data.x,this.data.y,this.data.text);
// };
// TextObject.prototype.calculate = function(){
//   this.patternFunc();
// };
// TextObject.prototype.destroy = function(){
//   TC.LoopObject.prototype.destroy.call(this);
// };

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
  TC.LoopObject.call(this, speed, data, this.autoStart);
}
Star.prototype = Object.create(TC.LoopObject.prototype);
Star.prototype.constructor = Star;

Star.prototype.calculate = function(){
  this.data.blink = (this.data.blink+1)%2;
};
Star.prototype.draw = function(){
  let text = this.data.blink%2===0?"★":"☆";
  MAIN.TCS.insertText(this.data.x,this.data.y,text,this.data.color);
};
Star.prototype.destroy = function(){
  MAIN.TCS.insertText(this.data.x,this.data.y,"  ");
  TC.LoopObject.prototype.destroy.call(this);
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
  TC.LoopObject.call(this, speed, data, this.autoStart);
}
Pause.prototype = Object.create(TC.LoopObject.prototype);
Pause.prototype.constructor = Pause;

Pause.prototype.init = function(){
  this.drawFrame();
  TC.LoopObject.prototype.init.call(this);
};
Pause.prototype.drawFrame = function(){
  MAIN.TCS.insertText(this.data.x,this.data.y,  "┏━━━━━━━━━━━━━━━━━━┓","#fff",this.data.bgColor);
  MAIN.TCS.insertText(this.data.x,this.data.y+1,"┃                  ┃","#fff",this.data.bgColor);
  MAIN.TCS.insertText(this.data.x,this.data.y+2,"┃                  ┃","#fff",this.data.bgColor);
  MAIN.TCS.insertText(this.data.x,this.data.y+3,"┗━━━━━━━━━━━━━━━━━━┛","#fff",this.data.bgColor);
  MAIN.TCS.insertText(this.data.x+14,this.data.y+1,"[ PAUSED ]","#fff",this.data.bgColor);
};

Pause.prototype.calculate = function(){
  this.data.blink = (this.data.blink+1)%2;
};
Pause.prototype.draw = function(){
  let color = this.data.blink%2===0?"#fff":"gray";
  MAIN.TCS.insertText(this.data.x+3,this.data.y+2,this.data.text,color,this.data.bgColor);
};

function GameOverPopup(speed, data){
  this.autoStart = true;
  this.data = {
    x: undefined,
    y: undefined,
    bgColor: undefined,
    blink: 0,
    text: "Please press <ESC>",
    score: 0,
    scoreText: "",
  };
  TC.LoopObject.call(this, speed, data, this.autoStart);
}
GameOverPopup.prototype = Object.create(TC.LoopObject.prototype);
GameOverPopup.prototype.constructor = GameOverPopup;

GameOverPopup.prototype.init = function(){
  this.data.scoreText = this.data.status.convertScore(this.data.score);
  this.drawFrame();
  TC.LoopObject.prototype.init.call(this);
};
GameOverPopup.prototype.drawFrame = function(){
  MAIN.TCS.insertText(this.data.x,this.data.y,  "┏━━━━━━━━━━━━━┓","#fff",this.data.bgColor);
  MAIN.TCS.insertText(this.data.x,this.data.y+1,"┃             ┃","#fff",this.data.bgColor);
  MAIN.TCS.insertText(this.data.x,this.data.y+2,"┃             ┃","#fff",this.data.bgColor);
  MAIN.TCS.insertText(this.data.x,this.data.y+3,"┃             ┃","#fff",this.data.bgColor);
  MAIN.TCS.insertText(this.data.x,this.data.y+4,"┃             ┃","#fff",this.data.bgColor);
  MAIN.TCS.insertText(this.data.x,this.data.y+5,"┃             ┃","#fff",this.data.bgColor);
  MAIN.TCS.insertText(this.data.x,this.data.y+6,"┃             ┃","#fff",this.data.bgColor);
  MAIN.TCS.insertText(this.data.x,this.data.y+7,"┗━━━━━━━━━━━━━┛","#fff",this.data.bgColor);
  MAIN.TCS.insertText(this.data.x+8,this.data.y+1,"[ GAME OVER ]","#fff",this.data.bgColor);
  MAIN.TCS.insertText(this.data.x+6,this.data.y+3,"YOUR SCORE: ","#fff",this.data.bgColor);
  MAIN.TCS.insertText(this.data.x+14,this.data.y+4,this.data.scoreText,"#fff",this.data.bgColor);
};

GameOverPopup.prototype.calculate = function(){
  this.data.blink = (this.data.blink+1)%2;
};
GameOverPopup.prototype.draw = function(){
  let color = this.data.blink%2===0?"#fff":"gray";
  MAIN.TCS.insertText(this.data.x+6,this.data.y+6,this.data.text,color,this.data.bgColor);
};

function Status(data){
  this.data = {
    x: undefined,
    y: undefined,
    COLORSET: undefined,
    scores: {
      lastScore: 0,
      bestScore: 0,
    }
  };
  TC.Object.call(this, data);
}
Status.prototype = Object.create(TC.Object.prototype);
Status.prototype.constructor = Status;

Status.prototype.init = function(){
  this.drawFrame();
  this.drawLastScore(this.data.scores.lastScore);
  this.drawBestScore(this.data.scores.bestScore);
};
Status.prototype.drawFrame = function(){
  MAIN.TCS.insertText(this.data.x,   this.data.y+ 0, " LEVEL :");
  MAIN.TCS.insertText(this.data.x,   this.data.y+ 1, " GOAL  :");
  MAIN.TCS.insertText(this.data.x,   this.data.y+ 2, "┍      ┑");
  MAIN.TCS.insertText(this.data.x+4, this.data.y+ 2, "N E X T");
  MAIN.TCS.insertText(this.data.x,   this.data.y+ 3, "│      │");
  MAIN.TCS.insertText(this.data.x,   this.data.y+ 4, "│      │");
  MAIN.TCS.insertText(this.data.x,   this.data.y+ 5, "│      │");
  MAIN.TCS.insertText(this.data.x,   this.data.y+ 6, "│      │");
  MAIN.TCS.insertText(this.data.x,   this.data.y+ 7, "┕━━━━━━┙");
  MAIN.TCS.insertText(this.data.x,   this.data.y+ 8, " YOUR SCORE :");
  MAIN.TCS.insertText(this.data.x,   this.data.y+10, " LAST SCORE :");
  MAIN.TCS.insertText(this.data.x,   this.data.y+12, " BEST SCORE :");
  MAIN.TCS.insertText(this.data.x,   this.data.y+15, "  △   : Shift        SPACE : Hard Drop");
  MAIN.TCS.insertText(this.data.x,   this.data.y+16, "◁  ▷ : Left / Right   P   : Pause");
  MAIN.TCS.insertText(this.data.x,   this.data.y+17, "  ▽   : Soft Drop     ESC  : Quit");
  MAIN.TCS.insertText(this.data.x,   this.data.y+20, "www.A-MEAN-Blog.com");
};
Status.prototype.drawNextBlock = function(blockType){
  let xOffset = (blockType === 0 || blockType === 1)?-1:0;
  let color = this.data.COLORSET.block[blockType];
  let xAdj = this.data.x+5;
  let yAdj = this.data.y+3;
  for(let i=1;i<3;i++){
    for(let j=0;j<5;j++){
      let x = xAdj-2+j*2;
      let y = yAdj+i;
      MAIN.TCS.insertText(x,y,"  ");
    }
  }
  for(let i=1;i<3;i++){
    for(let j=0;j<4;j++){
      let x = xAdj+j*2+xOffset;
      let y = yAdj+i;
      if(BLOCKS[blockType][0][i][j]==1) {
        MAIN.TCS.insertText(x,y,"■", color);
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
  MAIN.TCS.insertText(this.data.x+9, this.data.y, num);
};
Status.prototype.drawGoal = function(num){
  num = (num>9)?num:" "+num;
  MAIN.TCS.insertText(this.data.x+9, this.data.y+1, num);
};
Status.prototype.drawScore = function(score){
  MAIN.TCS.insertText(this.data.x+7, this.data.y+9, this.convertScore(score));
};
Status.prototype.drawLastScore = function(score){
  MAIN.TCS.insertText(this.data.x+7, this.data.y+11, this.convertScore(score));
};
Status.prototype.drawBestScore = function(score){
  MAIN.TCS.insertText(this.data.x+7, this.data.y+13, this.convertScore(score));
};
Status.prototype.updateLastScore = function(score){
  this.data.scores.lastScore = score;
  this.drawLastScore(score);
};
Status.prototype.updateBestScore = function(score){
  this.data.scores.bestScore = Math.max(score,this.data.scores.bestScore);
  this.drawBestScore(score);
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
    KEYSET: undefined,
    COLORSET: undefined,
    level: 1,
    goalCount: 10,
    goalCountMax: 10,
    score: 0,
    inputSpeedCountMax: 10,
    inputSpeedCount: 0,
    autoDropCountMax: 80,
    autoDropCount: 0,
    dataArray: null,
    activeBlock: undefined,
    nextBlockType: null,
    gameOver: {
      flag: false,
      count: 0,
      countMax: 30,
      popup: false,
    },
  };
  TC.LoopObject.call(this, 10, data, this.autoStart);
}
Tetris.prototype = Object.create(TC.LoopObject.prototype);
Tetris.prototype.constructor = Tetris;

Tetris.ACTIVE_BLOCK = -2;
Tetris.CEILING = -1;
Tetris.EMPTY = 0;
Tetris.WALL = 1;
Tetris.STAR = 100;
Tetris.GRAY_BLOCK = 101;

Tetris.prototype.init = function(){
  this.resetDataArray();
  this.createNewBlock();
  this.setSpeed(this.data.level);
  this.refStatus.drawLevel(this.data.level);
  this.refStatus.drawGoal(this.data.goalCount);
  this.refStatus.drawScore(this.data.score);
  TC.LoopObject.prototype.init.call(this);

  MAIN.TCD.addTask('test',
    this.data,
    function(){
      let activeBlockData = this.data.activeBlock.data;
      this.output =
      `activeBlock.type: ${activeBlockData.type}
      activeBlock.rotation: ${activeBlockData.rotation}
      activeBlock.x: ${activeBlockData.x}
      activeBlock.y: ${activeBlockData.y}
      nextBlockType: ${this.data.nextBlockType}
      inactivate1.flag: ${activeBlockData.inactivate1.flag}
      inactivate1.count: ${activeBlockData.inactivate1.count}
      inactivate2.flag: ${activeBlockData.inactivate2.flag}
      inactivate2.count: ${activeBlockData.inactivate2.count}
      speed: ${this.data.autoDropCountMax}
      `;
    });
};
Tetris.prototype.draw = function(){
  var activeBlock = this.data.activeBlock;
  const COLORSET = this.data.COLORSET;

  if(this.data.gameOver.popup) return;

  for(let i=0;i<this.rowNum;i++){
    for(let j=0;j<this.colNum;j++){
      let blockChar;
      let color;
      switch(this.data.dataArray[i][j]){
        case Tetris.ACTIVE_BLOCK: //-2
          blockChar="□";
          color = COLORSET.block[activeBlock.getType()];
          break;
        case Tetris.GRAY_BLOCK: //-2
          blockChar="■";
          color = COLORSET.grayBlock;
          break;
        case Tetris.CEILING: // -1
          blockChar="•";
          color = COLORSET.ceiling;
          break;
        case Tetris.EMPTY: //0
          blockChar="  ";
          break;
        case Tetris.WALL: // 1
          blockChar="▣";
          color = COLORSET.wall;
          break;
        case Tetris.STAR: //100
          blockChar="☆";
          var colorNum = j%COLORSET.block.length;
          color = COLORSET.block[colorNum];
          break;
        default: // 2~
          blockChar="■";
          color = COLORSET.block[this.data.dataArray[i][j]-2];
          break;
      }
      MAIN.TCS.insertText(this.data.x+j*2,this.data.y+i,blockChar,color);
    }
  }
};
Tetris.prototype.calculate = function(){
  let activeBlock = this.data.activeBlock;
  if(!this.data.gameOver.flag){
    this.updateCeilling();
    this.autoDrop();
    activeBlock.updateActiveBlock();
    if(activeBlock.isInactivate1On()) this.inactivateBlock();
    this.getInput();
  }
};
Tetris.prototype.destroy = function (blockType) {
  MAIN.TCD.removeTask("test");
  if(this.gameOverPopup) this.gameOverPopup.destroy();
  TC.LoopObject.prototype.destroy.call(this);
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
  var newBlock = {
    x: Math.floor(this.colNum/2)-1,
    type: TC.common.isNumber(this.data.nextBlockType)?this.data.nextBlockType:Math.floor(Math.random()*7)
  };

  this.data.activeBlock = new Tetris_ActiveBlock(newBlock, this);
  this.data.activeBlock.updateActiveBlock();
  this.data.nextBlockType = Math.floor(Math.random()*7);
  this.refStatus.drawNextBlock(this.data.nextBlockType);
};
Tetris.prototype.getInput = function(){
  const KEYSET = this.data.KEYSET;
  var activeBlock = this.data.activeBlock;
  if(++this.data.inputSpeedCount > this.data.inputSpeedCountMax){
    this.data.inputSpeedCount = 0;
    if(MAIN.TCI.keyboard.checkKey(KEYSET.RIGHT)){
      activeBlock.move(1,0);
    }
    if(MAIN.TCI.keyboard.checkKey(KEYSET.LEFT)){
      activeBlock.move(-1,0);
    }
    if(MAIN.TCI.keyboard.checkKey(KEYSET.DOWN)){
      activeBlock.moveDown();
    }
    if(MAIN.TCI.keyboard.checkKey(KEYSET.ROTATE)){
      activeBlock.rotate();
    }
    if(MAIN.TCI.keyboard.checkKey(KEYSET.DROP)){
      this.hardDrop();
    }
  }
};
Tetris.prototype.hardDrop = function(){
  var activeBlock = this.data.activeBlock;

  if(activeBlock.moveDown()){
    this.addScore(this.data.level/2);
    this.hardDrop();
  } else {
    activeBlock.forceToInactivate2Ready();
  }
};
Tetris.prototype.autoDrop = function(){
  var activeBlock = this.data.activeBlock;
  if(++this.data.autoDropCount > this.data.autoDropCountMax){
    this.data.autoDropCount = 0;
    activeBlock.moveDown();
  }
};
Tetris.prototype.inactivateBlock = function(){
  let activeBlock = this.data.activeBlock;

  if(activeBlock.checkInactivate2Ready()){
    activeBlock.startInactivate2();
    activeBlock.updateActiveBlock();
    activeBlock.transFormToInactive(activeBlock);
    this.changeFullLinesToStar();
  }
  else if(activeBlock.checkInactivate2Finished()){
    activeBlock.resetInactivateStatus();
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
  this.refStatus.updateBestScore(this.data.score);
  this.refStatus.updateLastScore(this.data.score);
  let i = this.rowNum-2;
  let interval = setInterval(_=>{
    for(let j=1;j<this.colNum-1;j++){
      if(this.data.dataArray[i][j]>0) this.data.dataArray[i][j] = Tetris.GRAY_BLOCK;
    }
    if(--i<0){
      this.showGameOverPopup();
      clearInterval(interval);
    }
  },100);
};
Tetris.prototype.showGameOverPopup = function(){
  this.data.gameOver.popup = true;
  this.gameOverPopup = new GameOverPopup(800,{x:19,y:5,bgColor:"#444",status:this.refStatus,score:this.data.score});
};


function Tetris_ActiveBlock(data,refTetris){
  this.data = {
    type: 0,
    rotation: 0,
    x: 0,
    y: 0,
    inactivate1: {
      flag: false,
      count: 0,
      countMax: 50,
    },
    inactivate2: {
      flag: false,
      count: 0,
      countMax: 10,
    },
  };
  this.refTetris = refTetris;
  TC.Object.call(this, data);
}
Tetris_ActiveBlock.prototype = Object.create(TC.Object.prototype);
Tetris_ActiveBlock.prototype.constructor = Tetris_ActiveBlock;

Tetris_ActiveBlock.prototype.getType = function(){
  return this.data.type;
};
Tetris_ActiveBlock.prototype.isInactivate1On = function(){
  return this.data.inactivate1.flag;
};
Tetris_ActiveBlock.prototype.checkInactivate2Ready = function(){
  var checkStatus = false;
  if(!this.data.inactivate2.flag
  && ++this.data.inactivate1.count > this.data.inactivate1.countMax){
    if(!this.checkMove(this.data.type,this.data.rotation,this.data.x,this.data.y+1)){
      checkStatus = true;
    }
  }
  return checkStatus;
};
Tetris_ActiveBlock.prototype.startInactivate2 = function(){
  this.data.inactivate2.flag = true;
};
Tetris_ActiveBlock.prototype.checkInactivate2Finished = function(){
  var checkStatus = false;
  if(this.data.inactivate2.flag
  && ++this.data.inactivate2.count > this.data.inactivate2.countMax){
    checkStatus = true;
  }
  return checkStatus;
};
Tetris_ActiveBlock.prototype.resetInactivateStatus = function(){
  this.data.inactivate1.count = 0;
  this.data.inactivate2.count = 0;
};
Tetris_ActiveBlock.prototype.checkMove = function(type,rN,xN,yN){
  var dataArray = this.refTetris.data.dataArray;
  for(let i=0;i<4;i++){
    for(let j=0;j<4;j++){
      if(BLOCKS[type][rN][i][j]==1
      && dataArray[yN+i][xN+j] > 0){
        return false;
      }
    }
  }
  return true;
};
Tetris_ActiveBlock.prototype.rotate = function(){
  let rN = (this.data.rotation+1)%4;
  let moved = false;
  if(this.checkMove(this.data.type,rN,this.data.x,this.data.y)){
    this.data.rotation = rN;
    moved = true;
  }
  else if(this.checkMove(this.data.type,rN,this.data.x,this.data.y-1)){
    this.data.rotation = rN;
    this.data.y -= 1;
    moved = true;
  }
  return moved;
};
Tetris_ActiveBlock.prototype.move = function(x,y){
  let xN = this.data.x+x;
  let yN = this.data.y+y;
  let moved = false;
  if(this.checkMove(this.data.type,this.data.rotation,xN,yN)){
    this.data.x = xN;
    this.data.y = yN;
    moved = true;
  }
  return moved;
};
Tetris_ActiveBlock.prototype.moveDown = function(){
  let moved = this.move(0,1);
  if(moved){
    this.data.inactivate1.count = 0;
    if(this.checkMove(this.data.type,this.data.rotation,this.data.x,this.data.y+1)){
      this.data.inactivate1.flag = false;
    }
  }
  else {
    this.data.inactivate1.flag = true;
  }
  return moved;
};
Tetris_ActiveBlock.prototype.forceToInactivate2Ready = function(){
  this.data.inactivate1.count = this.data.inactivate1.countMax;
};
Tetris_ActiveBlock.prototype.updateActiveBlock = function(){
  if(!this.data.inactivate2.flag){
    this.transFormTo(Tetris.EMPTY);

    for(let i=0;i<4;i++){
      for(let j=0;j<4;j++){
        if(BLOCKS[this.data.type][this.data.rotation][i][j]==1)
          this.refTetris.data.dataArray[this.data.y+i][this.data.x+j]=Tetris.ACTIVE_BLOCK;
      }
    }
  }
};
Tetris_ActiveBlock.prototype.transFormTo = function(to){
  for(let i=0;i<this.refTetris.data.dataArray.length;i++){
    for(let j=0;j<this.refTetris.data.dataArray[i].length;j++){
      if(this.refTetris.data.dataArray[i][j]==Tetris.ACTIVE_BLOCK)
        this.refTetris.data.dataArray[i][j]=to;
    }
  }
};
Tetris_ActiveBlock.prototype.transFormToInactive = function(){
  this.transFormTo(this.data.type+2);
};

console.log('tetris-object.js loaded');

var TextObject = function(data, speed, patternFunc){
  this.autoStart = true;
  this.data = {
    x: undefined,
    y: undefined,
    text: '',
    previous: {
      x: undefined,
      y: undefined,
    },
  };
  this.patternFunc = patternFunc;
  TM.ILoopObject.call(this, data, speed, this.autoStart);
};
TextObject.prototype = Object.create(TM.ILoopObject.prototype);
TextObject.prototype.constructor = TextObject;

// TM.ILoopObject functions implementation
TextObject.prototype._init = function(){};
TextObject.prototype._destroy = function(){};
TextObject.prototype._calculate = function(){
  this.patternFunc();
};
TextObject.prototype._draw = function(){
  TMS.deleteText(this.data.previous.x,this.data.previous.y,this.data.text);
  this.data.previous.x = this.data.x;
  this.data.previous.y = this.data.y;
  TMS.insertTextAt(this.data.x,this.data.y,this.data.text);
};

//=============================
// Star
//=============================
// Object Type: TM.ILoopObject
// Description: Create a Blinking star
var Star = function(data, speed){
  this.autoStart = true;
  this.data = {
    x: undefined,
    y: undefined,
    color: undefined,
    blink: 0,
  };
  TM.ILoopObject.call(this, data, speed, this.autoStart);
};
Star.prototype = Object.create(TM.ILoopObject.prototype);
Star.prototype.constructor = Star;

// TM.ILoopObject functions implementation
Star.prototype._init = function(){};
Star.prototype._destroy = function(){
  TMS.insertTextAt(this.data.x,this.data.y,'  ');
};
Star.prototype._calculate = function(){
  this.data.blink = (this.data.blink+1)%2;
};
Star.prototype._draw = function(){
  var text = this.data.blink%2===0?'★':'☆';
  TMS.insertTextAt(this.data.x,this.data.y,text,this.data.color);
};

//=============================
// PausePopup
//=============================
// Object Type: TM.ILoopObject
// Description: Create a Pause Popup box
var PausePopup = function(data, speed){
  this.autoStart = true;
  this.data = {
    x: undefined,
    y: undefined,
    bgColor: undefined,
    blink: 0,
    text: 'Please press <P> to return to game',
  };
  TM.ILoopObject.call(this, data, speed, this.autoStart);
};
PausePopup.prototype = Object.create(TM.ILoopObject.prototype);
PausePopup.prototype.constructor = PausePopup;

// TM.ILoopObject functions implementation
PausePopup.prototype._init = function(){
  this.drawFrame();
};
PausePopup.prototype._destroy = function(){};
PausePopup.prototype._calculate = function(){
  this.data.blink = (this.data.blink+1)%2;
};
PausePopup.prototype._draw = function(){
  var color = this.data.blink%2===0?'#fff':'gray';
  TMS.insertTextAt(this.data.x+3,this.data.y+2,this.data.text,color,this.data.bgColor);
};

// Custom functions
PausePopup.prototype.drawFrame = function(){
  TMS.cursor.move(this.data.x,this.data.y);
  TMS.insertText('┏━━━━━━━━━━━━━━━━━━┓\n','#fff',this.data.bgColor);
  TMS.insertText('┃            [ PAUSED ]              ┃\n','#fff',this.data.bgColor);
  TMS.insertText('┃                                    ┃\n','#fff',this.data.bgColor);
  TMS.insertText('┗━━━━━━━━━━━━━━━━━━┛\n','#fff',this.data.bgColor);
};

//=============================
// GameOverPopup
//=============================
// Object Type: TM.ILoopObject
// Description: Create a Game Over Popup box
var GameOverPopup = function(data, speed){
  this.autoStart = true;
  this.data = {
    x: undefined,
    y: undefined,
    bgColor: undefined,
    blink: 0,
    text: 'Please press <ESC>',
    score: 0,
    scoreText: '',
  };
  TM.ILoopObject.call(this, data, speed, this.autoStart);
};
GameOverPopup.prototype = Object.create(TM.ILoopObject.prototype);
GameOverPopup.prototype.constructor = GameOverPopup;

// TM.ILoopObject functions implementation
GameOverPopup.prototype._init = function(){
  this.data.scoreText = Status.convertScore(this.data.score);
  this.drawFrame();
};
GameOverPopup.prototype._destroy = function(){};
GameOverPopup.prototype._calculate = function(){
  this.data.blink = (this.data.blink+1)%2;
};
GameOverPopup.prototype._draw = function(){
  var color = this.data.blink%2===0?'#fff':'gray';
  TMS.insertTextAt(this.data.x+6,this.data.y+6,this.data.text,color,this.data.bgColor);
};

// Custom functions
GameOverPopup.prototype.drawFrame = function(){
  TMS.cursor.move(this.data.x,this.data.y);
  TMS.insertText('┏━━━━━━━━━━━━━┓\n','#fff',this.data.bgColor)
  TMS.insertText('┃      [ GAME OVER ]       ┃\n','#fff',this.data.bgColor)
  TMS.insertText('┃                          ┃\n','#fff',this.data.bgColor)
  TMS.insertText('┃    YOUR SCORE:           ┃\n','#fff',this.data.bgColor)
  TMS.insertText('┃                          ┃\n','#fff',this.data.bgColor)
  TMS.insertText('┃                          ┃\n','#fff',this.data.bgColor)
  TMS.insertText('┃                          ┃\n','#fff',this.data.bgColor)
  TMS.insertText('┗━━━━━━━━━━━━━┛\n','#fff',this.data.bgColor);
  TMS.insertTextAt(this.data.x+14,this.data.y+4,this.data.scoreText,'#fff',this.data.bgColor);
};

//=============================
// Status
//=============================
// Object Type: TM.IObject
// Description: Display Tetris game status
var Status = function(data){
  this.data = {
    x: undefined,
    y: undefined,
    COLORSET: GAME_SETTINGS.COLORSET,
  };
  TM.IObject.call(this, data);
};
Status.prototype = Object.create(TM.IObject.prototype);
Status.prototype.constructor = Status;

// TM.IObject functions implementation
Status.prototype._init = function(){
  this.drawFrame();
  this.drawLastScore(MAIN.data.scores.lastScore);
  this.drawBestScore(MAIN.data.scores.bestScore);
};
Status.prototype._destroy = function(){};

// Custom functions - Static functions
Status.convertScore = function(score){
  var string = Math.floor(score).toString();
  var formatted = string.replace(/(\d)(?=(\d{3})+$)/g,'$1,');
  var offset = 10 - formatted.length;
  var padding = '';
  for(var i=offset; i>0; i--) padding+=' ';
  return padding+ formatted;
};

// Custom functions
Status.prototype.drawFrame = function(){
  TMS.cursor.move(this.data.x, this.data.y);
  TMS.insertText(' LEVEL :\n');
  TMS.insertText(' GOAL  :\n');
  TMS.insertText('┍ N E X T  ┑\n');
  TMS.insertText('│      │\n');
  TMS.insertText('│      │\n');
  TMS.insertText('│      │\n');
  TMS.insertText('│      │\n');
  TMS.insertText('┕━━━━━━┙\n');
  TMS.insertText(' YOUR SCORE :\n\n');
  TMS.insertText(' LAST SCORE :\n\n');
  TMS.insertText(' BEST SCORE :\n\n\n');
  TMS.insertText('  △   : Shift        SPACE : Hard Drop\n');
  TMS.insertText('◁  ▷ : Left / Right   P   : Pause\n');
  TMS.insertText('  ▽   : Soft Drop     ESC  : Quit\n\n\n');
  TMS.insertText('www.A-MEAN-Blog.com\n');
};
Status.prototype.drawNextBlock = function(blockType){
  var xOffset = (blockType === 0 || blockType === 1)?0:1;
  var color = this.data.COLORSET.BLOCKS[blockType];
  var xAdj = this.data.x+2+xOffset;
  var yAdj = this.data.y+3;
  var width = 6-xOffset;
  var height = 3;
  for(var i=1; i<height; i++){
    for(var j=0; j<width; j++){
      var x = xAdj+j*2;
      var y = yAdj+i;
      if(j>0 && Tetris.BLOCKS[blockType][0][i][j-1]==1) {
        TMS.insertTextAt(x,y,'■', color);
      }
      else {
        TMS.insertTextAt(x,y,'  ');
      }
    }
  }
};
Status.prototype.drawLevel = function(num){
  num = (num>9)?num:' '+num;
  TMS.insertTextAt(this.data.x+9, this.data.y, num);
};
Status.prototype.drawGoal = function(num){
  num = (num>9)?num:' '+num;
  TMS.insertTextAt(this.data.x+9, this.data.y+1, num);
};
Status.prototype.drawScore = function(score){
  TMS.insertTextAt(this.data.x+7, this.data.y+9, Status.convertScore(score));
};
Status.prototype.drawLastScore = function(score){
  TMS.insertTextAt(this.data.x+7, this.data.y+11, Status.convertScore(score));
};
Status.prototype.drawBestScore = function(score){
  TMS.insertTextAt(this.data.x+7, this.data.y+13, Status.convertScore(score));
};
Status.prototype.updateLastScore = function(score){
  MAIN.data.scores.lastScore = score;
  this.drawLastScore(score);
};
Status.prototype.updateBestScore = function(score){
  MAIN.data.scores.bestScore = Math.max(score,MAIN.data.scores.bestScore);
  this.drawBestScore(score);
};

//=============================
// Tetris
//=============================
// Object Type: TM.ILoopObject
// Description: Main Tetris game
var Tetris = function(data){
  this.autoStart = true;
  this.speed = 10;
  this.data = {
    x: undefined,
    y: undefined,
    refStatus: undefined,
    COL_NUM: GAME_SETTINGS.COL_NUM,
    ROW_NUM: GAME_SETTINGS.ROW_NUM,
    COLORSET: GAME_SETTINGS.COLORSET,
    level: 1,
    goalCount: 10,
    goalCountMax: 10,
    score: 0,
    autoDropCountMax: 80,
    autoDropCount: 0,
    dataArray: null,
    activeBlock: null,
    nextBlockType: null,
    gameOver: {
      flag: false,
      count: 0,
      countMax: 30,
      popup: false,
    },
  };
  TM.ILoopObject.call(this, data, this.speed, this.autoStart);
};
Tetris.prototype = Object.create(TM.ILoopObject.prototype);
Tetris.prototype.constructor = Tetris;

// Static properties
Tetris.ACTIVE_BLOCK = -2;
Tetris.CEILING = -1;
Tetris.EMPTY = 0;
Tetris.WALL = 1;
Tetris.STAR = 100;
Tetris.GRAY_BLOCK = 101;
Tetris.BLOCKS = [
  [[[0,0,0,0],[0,1,1,0],[0,1,1,0],[0,0,0,0]],[[0,0,0,0],[0,1,1,0],[0,1,1,0],[0,0,0,0]],[[0,0,0,0],[0,1,1,0],[0,1,1,0],[0,0,0,0]],[[0,0,0,0],[0,1,1,0],[0,1,1,0],[0,0,0,0]]],
  [[[0,0,0,0],[0,0,0,0],[1,1,1,1],[0,0,0,0]],[[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]],[[0,0,0,0],[0,0,0,0],[1,1,1,1],[0,0,0,0]],[[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]]],
  [[[0,0,0,0],[1,1,0,0],[0,1,1,0],[0,0,0,0]],[[0,0,0,0],[0,0,1,0],[0,1,1,0],[0,1,0,0]],[[0,0,0,0],[1,1,0,0],[0,1,1,0],[0,0,0,0]],[[0,0,0,0],[0,0,1,0],[0,1,1,0],[0,1,0,0]]],
  [[[0,0,0,0],[0,1,1,0],[1,1,0,0],[0,0,0,0]],[[0,0,0,0],[1,0,0,0],[1,1,0,0],[0,1,0,0]],[[0,0,0,0],[0,1,1,0],[1,1,0,0],[0,0,0,0]],[[0,0,0,0],[1,0,0,0],[1,1,0,0],[0,1,0,0]]],
  [[[0,0,0,0],[0,0,1,0],[1,1,1,0],[0,0,0,0]],[[0,0,0,0],[1,1,0,0],[0,1,0,0],[0,1,0,0]],[[0,0,0,0],[0,0,0,0],[1,1,1,0],[1,0,0,0]],[[0,0,0,0],[0,1,0,0],[0,1,0,0],[0,1,1,0]]],
  [[[0,0,0,0],[1,0,0,0],[1,1,1,0],[0,0,0,0]],[[0,0,0,0],[0,1,0,0],[0,1,0,0],[1,1,0,0]],[[0,0,0,0],[0,0,0,0],[1,1,1,0],[0,0,1,0]],[[0,0,0,0],[0,1,1,0],[0,1,0,0],[0,1,0,0]]],
  [[[0,0,0,0],[0,1,0,0],[1,1,1,0],[0,0,0,0]],[[0,0,0,0],[0,1,0,0],[0,1,1,0],[0,1,0,0]],[[0,0,0,0],[0,0,0,0],[1,1,1,0],[0,1,0,0]],[[0,0,0,0],[0,1,0,0],[1,1,0,0],[0,1,0,0]]]
];

// TM.ILoopObject functions inheritance
Tetris.prototype._init = function(){
  this.resetDataArray();
  this.createNewBlock();
  this.setSpeed(this.data.level);
  this.data.refStatus.drawLevel(this.data.level);
  this.data.refStatus.drawGoal(this.data.goalCount);
  this.data.refStatus.drawScore(this.data.score);
};
Tetris.prototype._destroy = function(blockType){
  TMD.delete('test');
  if(this.gameOverPopup) this.gameOverPopup.destroy();
};
Tetris.prototype._calculate = function(){
  if(this.data.gameOver.flag) return ;

  var activeBlock = this.data.activeBlock;
  this.updateCeilling();
  this.autoDrop();
  activeBlock.updateOnTetrisDataArray(this.data.dataArray);
  if(activeBlock.isInactivate1On()) this.inactivateBlock();

  var activeBlockData = this.data.activeBlock.data;
  TMD.print('test',{
    'activeBlock.type': activeBlockData.type,
    'activeBlock.rotation': activeBlockData.rotation,
    'activeBlock.x': activeBlockData.x,
    'activeBlock.y': activeBlockData.y,
    'nextBlockType': this.data.nextBlockType,
    'inactivate1.flag': activeBlockData.inactivate1.flag,
    'inactivate1.count': activeBlockData.inactivate1.count,
    'inactivate2.flag': activeBlockData.inactivate2.flag,
    'inactivate2.count': activeBlockData.inactivate2.count,
    'speed': this.data.autoDropCountMax
  });
};
Tetris.prototype._draw = function(){
  var activeBlock = this.data.activeBlock;
  const COLORSET = this.data.COLORSET;

  if(this.data.gameOver.popup) return;

  for(var i=0; i<this.data.ROW_NUM; i++){
    for(var j=0; j<this.data.COL_NUM; j++){
      var blockChar;
      var color;
      switch(this.data.dataArray[i][j]){
        case Tetris.ACTIVE_BLOCK: //-2
          blockChar='□';
          color = COLORSET.BLOCKS[activeBlock.getType()];
          break;
        case Tetris.GRAY_BLOCK: //-2
          blockChar='■';
          color = COLORSET.GAME_OVER_BLOCK;
          break;
        case Tetris.CEILING: // -1
          blockChar='•';
          color = COLORSET.CEILING;
          break;
        case Tetris.EMPTY: //0
          blockChar='  ';
          break;
        case Tetris.WALL: // 1
          blockChar='▣';
          color = COLORSET.WALL;
          break;
        case Tetris.STAR: //100
          blockChar='☆';
          var colorNum = j%COLORSET.BLOCKS.length;
          color = COLORSET.BLOCKS[colorNum];
          break;
        default: // 2~
          blockChar='■';
          color = COLORSET.BLOCKS[this.data.dataArray[i][j]-2];
          break;
      }
      TMS.insertTextAt(this.data.x+j*2,this.data.y+i,blockChar,color);
    }
  }
};

// Custom functions
Tetris.prototype.resetDataArray = function(){
  this.data.dataArray = [];
  for(var i=0; i<this.data.ROW_NUM; i++){
    this.data.dataArray[i] = [];
    for(var j=0; j<this.data.COL_NUM; j++){
      if(i == this.data.ROW_NUM-1){
        this.data.dataArray[i][j] = Tetris.WALL;
      }
      else if(j == 0 || j == this.data.COL_NUM-1){
        this.data.dataArray[i][j] = Tetris.WALL;
      }
      else {
        this.data.dataArray[i][j] = Tetris.EMPTY;
      }
    }
  }
};
Tetris.prototype.updateCeilling = function(){
  for(var j=1; j<this.data.COL_NUM-1; j++){
    if(this.data.dataArray[3][j] <= 0) this.data.dataArray[3][j] = Tetris.CEILING;
  }
};
Tetris.prototype.createNewBlock = function(){
  var newBlock = {
    x: Math.floor(this.data.COL_NUM/2)-1,
    type: TM.common.isNumber(this.data.nextBlockType)?this.data.nextBlockType:Math.floor(Math.random()*7)
  };

  this.data.activeBlock = new Tetris_ActiveBlock(newBlock);
  this.data.activeBlock.updateOnTetrisDataArray(this.data.dataArray);
  this.data.nextBlockType = Math.floor(Math.random()*7);
  this.data.refStatus.drawNextBlock(this.data.nextBlockType);
};
Tetris.prototype.processKeyInput = function(KEYSET, keyInput){
  var activeBlock = this.data.activeBlock;
  switch (keyInput) {
    case KEYSET.RIGHT:
      activeBlock.moveRight(this.data.dataArray);
      break;
    case KEYSET.LEFT:
      activeBlock.moveLeft(this.data.dataArray);
      break;
    case KEYSET.DOWN:
      activeBlock.moveDown(this.data.dataArray);
      break;
    case KEYSET.ROTATE:
      activeBlock.rotate(this.data.dataArray);
      break;
    case KEYSET.DROP:
      this.hardDrop();
      break;
  }
};
Tetris.prototype.hardDrop = function(){
  var activeBlock = this.data.activeBlock;

  if(activeBlock.moveDown(this.data.dataArray)){
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
    activeBlock.moveDown(this.data.dataArray);
  }
};
Tetris.prototype.inactivateBlock = function(){
  var activeBlock = this.data.activeBlock;

  if(activeBlock.checkInactivate2Ready() && !activeBlock.checkMoveDown(this.data.dataArray)){
    activeBlock.startInactivate2();
    activeBlock.updateOnTetrisDataArray(this.data.dataArray);
    activeBlock.transFormToInactiveBlock(this.data.dataArray);
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
  for(var i=this.data.ROW_NUM-2; i>=0; i--){
    var occupiedCount = 0;
    for(var j=1; j<this.data.COL_NUM-1; j++){
      if(this.data.dataArray[i][j]>0) occupiedCount++;
    }
    if(occupiedCount == this.data.COL_NUM-2){
      for(j=1; j<this.data.COL_NUM-1; j++){
        this.data.dataArray[i][j] = Tetris.STAR;
      }
    }
  }
};
Tetris.prototype.removeFullLines = function(){
  var removedLineNum = 0;
  for(var i=this.data.ROW_NUM-2; i>=0; i--){
    var occupiedCount = 0;
    for(var j=1; j<this.data.COL_NUM-1; j++){
      if(removedLineNum){
        if(i<removedLineNum) this.data.dataArray[i][j] = 0;
        else if(i === 0 || this.data.dataArray[i-removedLineNum][j] == Tetris.CEILING) this.data.dataArray[i][j] = Tetris.EMPTY;
        else this.data.dataArray[i][j] = this.data.dataArray[i-removedLineNum][j];
      }
      if(this.data.dataArray[i][j]>0) occupiedCount++;
    }
    if(occupiedCount == this.data.COL_NUM-2){
      i++;
      removedLineNum++;
      this.addScore(100 * this.data.level);

      if(--this.data.goalCount === 0) this.levelUp();
      else this.data.refStatus.drawGoal(this.data.goalCount);
    }
  }
};
Tetris.prototype.addScore = function(score){
  this.data.score += score;
  this.data.refStatus.drawScore(this.data.score);
};
Tetris.prototype.setSpeed = function(level){
  if(level<=GAME_SETTINGS.SPEED_LOOKUP.length){
    this.data.autoDropCountMax = GAME_SETTINGS.SPEED_LOOKUP[this.data.level-1];
  }else{
    this.data.autoDropCountMax = GAME_SETTINGS.SPEED_LOOKUP[GAME_SETTINGS.SPEED_LOOKUP.length-1];
  }
};
Tetris.prototype.levelUp = function(){
  this.data.level++;
  this.data.goalCount = this.data.goalCountMax;
  this.setSpeed(this.data.level);
  this.data.refStatus.drawGoal(this.data.goalCount);
  this.data.refStatus.drawLevel(this.data.level);
};
Tetris.prototype.checkGameOver = function(){
  for(var j=1; j<this.data.COL_NUM-1; j++){
    if(this.data.dataArray[3][j]>0) return true;
  }
};
Tetris.prototype.gameOver = function(){
  this.data.gameOver.flag = true;
  this.data.refStatus.updateBestScore(this.data.score);
  this.data.refStatus.updateLastScore(this.data.score);
  var i = this.data.ROW_NUM-2;
  var _self = this;
  var interval = setInterval(function(){
    for(var j=1; j<_self.data.COL_NUM-1; j++){
      if(_self.data.dataArray[i][j]>0) _self.data.dataArray[i][j] = Tetris.GRAY_BLOCK;
    }
    if(--i<0){
      _self.showGameOverPopup();
      clearInterval(interval);
    }
  },100);
};
Tetris.prototype.showGameOverPopup = function(){
  this.data.gameOver.popup = true;
  this.gameOverPopup = new GameOverPopup({x:19,y:5,bgColor:'#444',score:this.data.score},800);
};

//=============================
// Tetris_ActiveBlock
//=============================
// Object Type: TM.IObject
// Description: Contains active tetris block status and functions to control it
var Tetris_ActiveBlock = function(data){
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
  TM.IObject.call(this, data);
};
Tetris_ActiveBlock.prototype = Object.create(TM.IObject.prototype);
Tetris_ActiveBlock.prototype.constructor = Tetris_ActiveBlock;

// TM.IObject functions implementation
Tetris_ActiveBlock.prototype._init = function(){};
Tetris_ActiveBlock.prototype._destroy = function(){};

// Custom Functions - Getters, Setters
Tetris_ActiveBlock.prototype.getType = function(){
  return this.data.type;
};

// Custom Functions - Update ActiveBlock to dataArray
Tetris_ActiveBlock.prototype.transFormTo = function(dataArray,to){
  for(var i=0; i<dataArray.length; i++){
    for(var j=0; j<dataArray[i].length; j++){
      if(dataArray[i][j]==Tetris.ACTIVE_BLOCK)
        dataArray[i][j]=to;
    }
  }
};
Tetris_ActiveBlock.prototype.transFormToInactiveBlock = function(dataArray){
  this.transFormTo(dataArray,this.data.type+2);
};
Tetris_ActiveBlock.prototype.updateOnTetrisDataArray = function(dataArray){
  if(!this.data.inactivate2.flag){
    this.transFormTo(dataArray, Tetris.EMPTY);

    for(var i=0; i<4; i++){
      for(var j=0; j<4; j++){
        if(Tetris.BLOCKS[this.data.type][this.data.rotation][i][j]==1)
          dataArray[this.data.y+i][this.data.x+j]=Tetris.ACTIVE_BLOCK;
      }
    }
  }
};

// Custom Functions - Check and move ActiveBLock
Tetris_ActiveBlock.prototype.checkMove = function(dataArray,type,rN,xN,yN){
  for(var i=0; i<4; i++){
    for(var j=0; j<4; j++){
      if(Tetris.BLOCKS[type][rN][i][j]==1
      && dataArray[yN+i][xN+j] > 0){
        return false;
      }
    }
  }
  return true;
};
Tetris_ActiveBlock.prototype.checkMoveDown = function(dataArray){
  return this.checkMove(dataArray,this.data.type,this.data.rotation,this.data.x,this.data.y+1);
};
Tetris_ActiveBlock.prototype.move = function(dataArray,x,y){
  var xN = this.data.x+x;
  var yN = this.data.y+y;
  var moved = false;
  if(this.checkMove(dataArray,this.data.type,this.data.rotation,xN,yN)){
    this.data.x = xN;
    this.data.y = yN;
    moved = true;
  }
  return moved;
};
Tetris_ActiveBlock.prototype.moveRight = function(dataArray){
  this.move(dataArray,1,0);
};
Tetris_ActiveBlock.prototype.moveLeft = function(dataArray){
  this.move(dataArray,-1,0);
};
Tetris_ActiveBlock.prototype.moveDown = function(dataArray){
  var moved = this.move(dataArray,0,1);
  if(moved){
    this.data.inactivate1.count = 0;
    if(this.checkMoveDown(dataArray)){
      this.data.inactivate1.flag = false;
    }
  }
  else {
    this.data.inactivate1.flag = true;
  }
  return moved;
};
Tetris_ActiveBlock.prototype.rotate = function(dataArray){
  var rN = (this.data.rotation+1)%4;
  var moved = false;
  if(this.checkMove(dataArray,this.data.type,rN,this.data.x,this.data.y)){
    this.data.rotation = rN;
    moved = true;
  }
  else if(this.checkMove(dataArray,this.data.type,rN,this.data.x,this.data.y-1)){
    this.data.rotation = rN;
    this.data.y -= 1;
    moved = true;
  }
  return moved;
};

// Custom functions - Inactivation
Tetris_ActiveBlock.prototype.isInactivate1On = function(){
  return this.data.inactivate1.flag;
};
Tetris_ActiveBlock.prototype.checkInactivate2Ready = function(){
  var checkStatus = false;
  if(!this.data.inactivate2.flag
  && ++this.data.inactivate1.count > this.data.inactivate1.countMax){
    checkStatus = true;
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
Tetris_ActiveBlock.prototype.forceToInactivate2Ready = function(){
  this.data.inactivate1.count = this.data.inactivate1.countMax;
};

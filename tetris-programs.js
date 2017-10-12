console.log("tetris-programs.js loaded");

/******************************/
/* Program_Intro              */
/******************************/
// Object Type: TM.IProgram
// Description: Display intro screen and move to Tetris game when any key entered
var Program_Intro = function(speed, data){
  this.data = {
    x: undefined,
    y: undefined,
  };
  TM.IProgram.call(this, data, speed);
};
Program_Intro.prototype = Object.create(TM.IProgram.prototype);
Program_Intro.prototype.constructor = Program_Intro;

// TM.IProgram functions implementation
Program_Intro.prototype._init = function(){
  MAIN.TMI.keyboard.clearKey();
};
Program_Intro.prototype._destroy = function(){
  MAIN.TMS.clearScreen();
};
Program_Intro.prototype._calculate = function(){};
Program_Intro.prototype._draw = function(){};
Program_Intro.prototype._timeline = function(){
  if(this.loopCount ==  10) MAIN.TMS.insertText(this.data.x,    this.data.y+0, "■□□□■■■□□■■□□■■","#fff");
  if(this.loopCount ==  20) MAIN.TMS.insertText(this.data.x,    this.data.y+1, "■■■□ ■□□  ■■□□■","#eee");
  if(this.loopCount ==  30) MAIN.TMS.insertText(this.data.x,    this.data.y+2, "□□□■       □■ ■","#ddd");
  if(this.loopCount ==  40) MAIN.TMS.insertText(this.data.x,    this.data.y+3, "■■□■■ □ ■ □□■□□","#ccc");
  if(this.loopCount ==  50) MAIN.TMS.insertText(this.data.x,    this.data.y+4, "■■ ■□□□■■■□■■□□","#bbb");
  if(this.loopCount ==  60) MAIN.TMS.insertText(this.data.x,    this.data.y+5, "           www.A-MEAN-Blog.com","#aaa");
  if(this.loopCount ==  70) MAIN.TMS.insertText(this.data.x+10, this.data.y+2, "T E T R I S","#fff");
  if(this.loopCount ==  70){
    this.addToObjects(new Star({x:this.data.x+8,y:this.data.y+1},500));
    this.addToObjects(new Star({x:this.data.x+26,y:this.data.y+2},700));
    MAIN.TMS.insertText(this.data.x,this.data.y+7, "Please Enter Any Key to Start..","#fff");
    MAIN.TMS.insertText(this.data.x,this.data.y+9, "  △   : Shift","#fff");
    MAIN.TMS.insertText(this.data.x,this.data.y+10,"◁  ▷ : Left / Right","#eee");
    MAIN.TMS.insertText(this.data.x,this.data.y+11,"  ▽   : Soft Drop","#ddd");
    MAIN.TMS.insertText(this.data.x,this.data.y+12," SPACE : Hard Drop","#ccc");
    MAIN.TMS.insertText(this.data.x,this.data.y+13,"   P   : Pause","#bbb");
    MAIN.TMS.insertText(this.data.x,this.data.y+14,"  ESC  : Quit","#aaa");
    MAIN.TMS.insertText(this.data.x,this.data.y+16,"BONUS FOR HARD DROPS / COMBOS","#aaa");
  }
};
Program_Intro.prototype._getInput = function(){
  if(!MAIN.TMI.keyboard.checkKey(MAIN.SETTINGS.KEYSET.QUIT) &&  MAIN.TMI.keyboard.checkKeyAny()){
    MAIN.changeProgram(MAIN.programs.game);
  }
};

/******************************/
/* Program_Game              */
/******************************/
// Object Type: TM.IProgram
// Description: control Tetris Games
var Program_Game = function(speed, data){
  this.data = {
    isPaused: false,
  };
  this.uniqueObjects = {
    status : null,
    player1Game : null,
    pausePopup: null,
  };
  TM.IProgram.call(this, data, speed);
};
Program_Game.prototype = Object.create(TM.IProgram.prototype);
Program_Game.prototype.constructor = Program_Game;

// TM.IProgram functions implementation
Program_Game.prototype._init = function(){
  MAIN.TMI.keyboard.clearKey();
  this.data.isPaused = false;
  this.uniqueObjects.status = new Status({x:28,y:3});
  this.uniqueObjects.player1Game = new Tetris({x:3,y:1,refStatus:this.uniqueObjects.status});
};
Program_Game.prototype._destroy = function(){
  MAIN.TMS.clearScreen();
};
Program_Game.prototype._calculate = function(){};
Program_Game.prototype._draw = function(){};
Program_Game.prototype._timeline = function(){};
Program_Game.prototype._getInput = function(){
  if(MAIN.TMI.keyboard.checkKey(MAIN.SETTINGS.KEYSET.QUIT)){
    MAIN.changeProgram(MAIN.programs.intro);
  }
  if(MAIN.TMI.keyboard.checkKey(MAIN.SETTINGS.KEYSET.PAUSE)){
    if(this.data.isPaused){
      this.data.isPaused = false;
      this.uniqueObjects.player1Game.interval.start();
      this.uniqueObjects.pausePopup.destroy();
      MAIN.TMS.pasteScreen(this.data.pausedScreen);
      MAIN.TMI.keyboard.clearKey();
    }
    else {
      this.data.isPaused = true;
      this.uniqueObjects.player1Game.interval.stop();
      this.data.pausedScreen = MAIN.TMS.copyScreen();
      MAIN.TMS.fillScreen(" ", null, "rgba(0,0,0,0.4)");
      this.uniqueObjects.pausePopup = new PausePopup({x:15,y:11,bgColor:"#444"},800);
    }
  }

  if(!this.data.isPaused){
    this.checkTetrisInput(this.uniqueObjects.player1Game, MAIN.SETTINGS.PLAYER1.KEYSET);
  }
};

// Custom functions
Program_Game.prototype.checkTetrisInput = function(tetrisGame, KEYSET){
  if(MAIN.TMI.keyboard.checkKey(KEYSET.RIGHT)){
    tetrisGame.processKeyInput(KEYSET, KEYSET.RIGHT);
  }
  if(MAIN.TMI.keyboard.checkKey(KEYSET.LEFT)){
    tetrisGame.processKeyInput(KEYSET, KEYSET.LEFT);
  }
  if(MAIN.TMI.keyboard.checkKey(KEYSET.DOWN)){
    tetrisGame.processKeyInput(KEYSET, KEYSET.DOWN);
  }
  if(MAIN.TMI.keyboard.checkKey(KEYSET.ROTATE)){
    tetrisGame.processKeyInput(KEYSET, KEYSET.ROTATE);
  }
  if(MAIN.TMI.keyboard.checkKey(KEYSET.DROP)){
    tetrisGame.processKeyInput(KEYSET, KEYSET.DROP);
  }
};

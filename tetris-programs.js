console.log("tetris-programs.js loaded");

//=============================
// Program_Intro
//=============================
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
  TMI.keyboard.clearKey();
};
Program_Intro.prototype._destroy = function(){
  TMS.clearScreen();
};
Program_Intro.prototype._calculate = function(){};
Program_Intro.prototype._draw = function(){};
Program_Intro.prototype._timeline = function(){
  if(this.loopCount ==  10) TMS.insertTextAt(this.data.x, this.data.y+0, "■□□□■■■□□■■□□■■","#fff");
  if(this.loopCount ==  20) TMS.insertTextAt(this.data.x, this.data.y+1, "■■■□ ■□□  ■■□□■","#eee");
  if(this.loopCount ==  30) TMS.insertTextAt(this.data.x, this.data.y+2, "□□□■       □■ ■","#ddd");
  if(this.loopCount ==  40) TMS.insertTextAt(this.data.x, this.data.y+3, "■■□■■ □ ■ □□■□□","#ccc");
  if(this.loopCount ==  50) TMS.insertTextAt(this.data.x, this.data.y+4, "■■ ■□□□■■■□■■□□","#bbb");
  if(this.loopCount ==  60) TMS.insertTextAt(this.data.x+11, this.data.y+5, "www.A-MEAN-Blog.com","#aaa");
  if(this.loopCount ==  70){
    this.addToObjects(new Star({x:this.data.x+8,y:this.data.y+1},500));
    this.addToObjects(new Star({x:this.data.x+26,y:this.data.y+2},700));
  }
  if(this.loopCount ==  80) TMS.insertTextAt(this.data.x+10, this.data.y+2, "T E T R I S","#fff");
  if(this.loopCount ==  90){
    TMS.cursor.move(this.data.x,this.data.y+7);
    TMS.insertText("Please Enter Any Key to Start..\n\n","#fff");
    TMS.insertText("  △   : Shift\n","#fff");
    TMS.insertText("◁  ▷ : Left / Right\n","#eee");
    TMS.insertText("  ▽   : Soft Drop\n","#ddd");
    TMS.insertText(" SPACE : Hard Drop\n","#ccc");
    TMS.insertText("   P   : Pause\n","#bbb");
    TMS.insertText("  ESC  : Quit\n\n","#aaa");
    TMS.insertText("BONUS FOR HARD DROPS / COMBOS\n","#aaa");
  }
};
Program_Intro.prototype._getInput = function(){
  if(!TMI.keyboard.checkKey(GAME_SETTINGS.KEYSET.QUIT) &&  TMI.keyboard.checkKeyAny()){
    MAIN.changeProgram(MAIN.programs.game);
  }
};

//=============================
// Program_Game
//=============================
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
  TMI.keyboard.clearKey();
  this.data.isPaused = false;
  this.uniqueObjects.status = new Status({x:28,y:3});
  this.uniqueObjects.player1Game = new Tetris({x:3,y:1,refStatus:this.uniqueObjects.status});
};
Program_Game.prototype._destroy = function(){
  TMS.clearScreen();
};
Program_Game.prototype._calculate = function(){};
Program_Game.prototype._draw = function(){};
Program_Game.prototype._timeline = function(){};
Program_Game.prototype._getInput = function(){
  if(TMI.keyboard.checkKey(GAME_SETTINGS.KEYSET.QUIT)){
    MAIN.changeProgram(MAIN.programs.intro);
  }
  if(TMI.keyboard.checkKey(GAME_SETTINGS.KEYSET.PAUSE)){
    if(this.data.isPaused){
      this.data.isPaused = false;
      this.uniqueObjects.player1Game.interval.start();
      this.uniqueObjects.pausePopup.destroy();
      TMS.pasteScreen(this.data.pausedScreen);
      TMI.keyboard.clearKey();
    }
    else {
      this.data.isPaused = true;
      this.uniqueObjects.player1Game.interval.stop();
      this.data.pausedScreen = TMS.copyScreen();
      TMS.fillScreen(" ", null, "rgba(0,0,0,0.4)");
      this.uniqueObjects.pausePopup = new PausePopup({x:15,y:11,bgColor:"#444"},800);
    }
  }

  if(!this.data.isPaused){
    this.checkTetrisInput(this.uniqueObjects.player1Game, GAME_SETTINGS.PLAYER1.KEYSET);
  }
};

// Custom functions
Program_Game.prototype.checkTetrisInput = function(tetrisGame, KEYSET){
  if(TMI.keyboard.checkKey(KEYSET.RIGHT)){
    tetrisGame.processKeyInput(KEYSET, KEYSET.RIGHT);
  }
  if(TMI.keyboard.checkKey(KEYSET.LEFT)){
    tetrisGame.processKeyInput(KEYSET, KEYSET.LEFT);
  }
  if(TMI.keyboard.checkKey(KEYSET.DOWN)){
    tetrisGame.processKeyInput(KEYSET, KEYSET.DOWN);
  }
  if(TMI.keyboard.checkKey(KEYSET.ROTATE)){
    tetrisGame.processKeyInput(KEYSET, KEYSET.ROTATE);
  }
  if(TMI.keyboard.checkKey(KEYSET.DROP)){
    tetrisGame.processKeyInput(KEYSET, KEYSET.DROP);
  }
};

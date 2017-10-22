console.log("tetris-programs.js loaded");

//=============================
// Program_Intro
//=============================
// Object Type: TM.IProgram
// Description: Display intro screen and move to Tetris game when any key entered
var Program_Intro = function(){
  var speed = 10;
  this.data = {
    x: 5,
    y: 3,
  };
  this.objects = {
    stars:[],
  };
  TM.IProgram.call(this, speed);
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
Program_Intro.prototype._timeline = function(loopCount){
  if(loopCount ==  10) TMS.insertTextAt(this.data.x, this.data.y+0, "■□□□■■■□□■■□□■■","#fff");
  if(loopCount ==  20) TMS.insertTextAt(this.data.x, this.data.y+1, "■■■□ ■□□  ■■□□■","#eee");
  if(loopCount ==  30) TMS.insertTextAt(this.data.x, this.data.y+2, "□□□■       □■ ■","#ddd");
  if(loopCount ==  40) TMS.insertTextAt(this.data.x, this.data.y+3, "■■□■■ □ ■ □□■□□","#ccc");
  if(loopCount ==  50) TMS.insertTextAt(this.data.x, this.data.y+4, "■■ ■□□□■■■□■■□□","#bbb");
  if(loopCount ==  60) TMS.insertTextAt(this.data.x+11, this.data.y+5, "www.A-MEAN-Blog.com","#aaa");
  if(loopCount ==  70){
    this.objects.stars.push(new Star(500,{x:this.data.x+8, y:this.data.y+1,refContainer:this.objects.stars}));
    this.objects.stars.push(new Star(700,{x:this.data.x+26,y:this.data.y+2,refContainer:this.objects.stars}));
  }
  if(loopCount ==  80) TMS.insertTextAt(this.data.x+10, this.data.y+2, "T E T R I S","#fff");
  if(loopCount ==  90){
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
var Program_Game = function(){
  var speed = 100;
  this.objects = {
    status : null,
    player1Game : null,
    pausePopup: null,
    gameOverPopup: null,
  };
  TM.IProgram.call(this, speed);
};
Program_Game.prototype = Object.create(TM.IProgram.prototype);
Program_Game.prototype.constructor = Program_Game;

// TM.IProgram functions implementation
Program_Game.prototype._init = function(){
  TMI.keyboard.clearKey();
  this.objects.status = new Status({x:28,y:3});
  this.objects.player1Game = new Tetris({x:3,y:1,refStatus:this.objects.status});
  this.objects.pausePopup = null;
  this.objects.gameOverPopup = null;
};
Program_Game.prototype._destroy = function(){};
Program_Game.prototype._calculate = function(){
  if(this.objects.player1Game.data.isGameOverFinished && !this.objects.gameOverPopup){
    var player1GameData = this.objects.player1Game.data;
    this.objects.gameOverPopup = new GameOverPopup(800,{x:19,y:5,bgColor:'#444',currentScore:player1GameData.currentScore});
  }
};
Program_Game.prototype._draw = function(){};
Program_Game.prototype._timeline = function(){};
Program_Game.prototype._getInput = function(){
  if(TMI.keyboard.checkKey(GAME_SETTINGS.KEYSET.QUIT)){
    MAIN.changeProgram(MAIN.programs.intro);
  }
  if(TMI.keyboard.checkKey(GAME_SETTINGS.KEYSET.PAUSE) && !this.objects.gameOverPopup){
    if(this.objects.pausePopup){
      this.objects.pausePopup.destroy();
      this.objects.pausePopup = null;
      TMS.clearScreen();
      this.objects.status.refresh();
      this.objects.player1Game.draw();
      this.objects.player1Game.interval.init();
    }
    else {
      this.objects.player1Game.interval.destroy();
      TMS.fillScreen(" ", null, "rgba(0,0,0,0.4)");
      this.objects.pausePopup = new PausePopup(800,{x:15,y:11,bgColor:"#444"});
    }
    TMI.keyboard.clearKey();
  }

  if(!this.data.isPaused){
    this.checkTetrisInput(this.objects.player1Game, GAME_SETTINGS.PLAYER1.KEYSET);
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

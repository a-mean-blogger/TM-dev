console.log("tetris-programs.js loaded");

/******************************/
/* Program_Intro              */
/******************************/
// Object Type: TC.Program
// Description: Display intro screen and move to tetris game when any key entered
var Program_Intro = function(speed, data){
  this.data = {
    x: undefined,
    y: undefined,
  };
  TC.Program.call(this, data, speed);
};
Program_Intro.prototype = Object.create(TC.Program.prototype);
Program_Intro.prototype.constructor = Program_Intro;

// TC.Program functions inheritance
Program_Intro.prototype.init = function(){TC.Program.prototype.init.call(this);};
Program_Intro.prototype.destroy = function(){TC.Program.prototype.destroy.call(this);};
Program_Intro.prototype.calculate = function(){TC.Program.prototype.calculate.call(this);};

// TC.Program functions implementation
Program_Intro.prototype.timeline = function(){
  if(this.count ==  10) MAIN.TCS.insertText(this.data.x,    this.data.y+0, "■□□□■■■□□■■□□■■","#fff");
  if(this.count ==  20) MAIN.TCS.insertText(this.data.x,    this.data.y+1, "■■■□ ■□□  ■■□□■","#eee");
  if(this.count ==  30) MAIN.TCS.insertText(this.data.x,    this.data.y+2, "□□□■       □■ ■","#ddd");
  if(this.count ==  40) MAIN.TCS.insertText(this.data.x,    this.data.y+3, "■■□■■ □ ■ □□■□□","#ccc");
  if(this.count ==  50) MAIN.TCS.insertText(this.data.x,    this.data.y+4, "■■ ■□□□■■■□■■□□","#bbb");
  if(this.count ==  60) MAIN.TCS.insertText(this.data.x,    this.data.y+5, "           www.A-MEAN-Blog.com","#aaa");
  if(this.count ==  70) MAIN.TCS.insertText(this.data.x+10, this.data.y+2, "T E T R I S","#fff");
  if(this.count ==  70){
    this.addToObjects(new Star({x:this.data.x+8,y:this.data.y+1},500));
    this.addToObjects(new Star({x:this.data.x+26,y:this.data.y+2},700));
    MAIN.TCS.insertText(this.data.x,this.data.y+7, "Please Enter Any Key to Start..","#fff");
    MAIN.TCS.insertText(this.data.x,this.data.y+9, "  △   : Shift","#fff");
    MAIN.TCS.insertText(this.data.x,this.data.y+10,"◁  ▷ : Left / Right","#eee");
    MAIN.TCS.insertText(this.data.x,this.data.y+11,"  ▽   : Soft Drop","#ddd");
    MAIN.TCS.insertText(this.data.x,this.data.y+12," SPACE : Hard Drop","#ccc");
    MAIN.TCS.insertText(this.data.x,this.data.y+13,"   P   : Pause","#bbb");
    MAIN.TCS.insertText(this.data.x,this.data.y+14,"  ESC  : Quit","#aaa");
    MAIN.TCS.insertText(this.data.x,this.data.y+16,"BONUS FOR HARD DROPS / COMBOS","#aaa");
  }
};
Program_Intro.prototype.getInput = function(){
  if(!MAIN.TCI.keyboard.checkKey(MAIN.SETTINGS.KEYSET.QUIT) &&  MAIN.TCI.keyboard.checkKeyAny()){
    MAIN.changeProgram(MAIN.programs.game);
  }
};

/******************************/
/* Program_Game              */
/******************************/
// Object Type: TC.Program
// Description: control Tetris Games
var Program_Game = function(speed, data){
  this.data = {
    isPaused: false,
  };
  this.uniqueObjects = {
    status : undefined,
    player1Game : undefined,
    pausePopup: undefined,
  };
  TC.Program.call(this, data, speed);
};
Program_Game.prototype = Object.create(TC.Program.prototype);
Program_Game.prototype.constructor = Program_Game;

// TC.Program functions inheritance
Program_Game.prototype.init = function(){
  this.data.isPaused = false;
  this.uniqueObjects.status = new Status({x:28,y:3});
  this.uniqueObjects.player1Game = new Tetris({x:3,y:1,refStatus:this.uniqueObjects.status});
  TC.Program.prototype.init.call(this);
};
Program_Game.prototype.destroy = function(){TC.Program.prototype.destroy.call(this);};
Program_Game.prototype.calculate = function(){TC.Program.prototype.calculate.call(this);};

// TC.Program functions implementation
Program_Game.prototype.timeline = function(){};
Program_Game.prototype.getInput = function(){
  if(MAIN.TCI.keyboard.checkKey(MAIN.SETTINGS.KEYSET.QUIT)){
    MAIN.changeProgram(MAIN.programs.intro);
  }
  if(MAIN.TCI.keyboard.checkKey(MAIN.SETTINGS.KEYSET.PAUSE)){
    if(this.data.isPaused){
      this.data.isPaused = false;
      this.uniqueObjects.player1Game.interval.start();
      this.uniqueObjects.pausePopup.destroy();
      MAIN.TCS.pasteScreen(this.data.pausedScreen);
      MAIN.TCI.keyboard.clearKey();
    }
    else {
      this.data.isPaused = true;
      this.uniqueObjects.player1Game.interval.stop();
      this.data.pausedScreen = MAIN.TCS.copyScreen();
      MAIN.TCS.fillScreen(" ", null, "rgba(0,0,0,0.4)");
      this.uniqueObjects.pausePopup = new PausePopup({x:15,y:11,bgColor:"#444"},800);
    }
  }

  if(!this.data.isPaused){
    this.checkTetrisInput(this.uniqueObjects.player1Game, MAIN.SETTINGS.PLAYER1.KEYSET);
  }
};

// Custom functions
Program_Game.prototype.checkTetrisInput = function(tetrisGame, KEYSET){
  if(MAIN.TCI.keyboard.checkKey(KEYSET.RIGHT)){
    tetrisGame.processKeyInput(KEYSET, KEYSET.RIGHT);
  }
  if(MAIN.TCI.keyboard.checkKey(KEYSET.LEFT)){
    tetrisGame.processKeyInput(KEYSET, KEYSET.LEFT);
  }
  if(MAIN.TCI.keyboard.checkKey(KEYSET.DOWN)){
    tetrisGame.processKeyInput(KEYSET, KEYSET.DOWN);
  }
  if(MAIN.TCI.keyboard.checkKey(KEYSET.ROTATE)){
    tetrisGame.processKeyInput(KEYSET, KEYSET.ROTATE);
  }
  if(MAIN.TCI.keyboard.checkKey(KEYSET.DROP)){
    tetrisGame.processKeyInput(KEYSET, KEYSET.DROP);
  }
};

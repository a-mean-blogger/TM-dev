console.log("tetris-programs.js loaded");

var Program_Intro = function(speed, data){
  this.data = {
    x: undefined,
    y: undefined,
    KEYSET: undefined,
  };
  TC.Program.call(this, speed, data);
};
Program_Intro.prototype = Object.create(TC.Program.prototype);
Program_Intro.prototype.constructor = Program_Intro;

Program_Intro.prototype.timeline = function(){
  if(this.count ==  10) MAIN.TCS.insertText(this.data.x,    this.data.y+0, "■□□□■■■□□■■□□■■","#fff");
  if(this.count ==  20) MAIN.TCS.insertText(this.data.x,    this.data.y+1, "■■■□ ■□□  ■■□□■","#eee");
  if(this.count ==  30) MAIN.TCS.insertText(this.data.x,    this.data.y+2, "□□□■       □■ ■","#ddd");
  if(this.count ==  40) MAIN.TCS.insertText(this.data.x,    this.data.y+3, "■■□■■ □ ■ □□■□□","#ccc");
  if(this.count ==  50) MAIN.TCS.insertText(this.data.x,    this.data.y+4, "■■ ■□□□■■■□■■□□","#bbb");
  if(this.count ==  60) MAIN.TCS.insertText(this.data.x,    this.data.y+5, "           www.A-MEAN-Blog.com","#aaa");
  if(this.count ==  70) MAIN.TCS.insertText(this.data.x+10, this.data.y+2, "T E T R I S","#fff");
  if(this.count ==  70){
    this.addToObjects(new Star(500,{x:this.data.x+8,y:this.data.y+1}));
    this.addToObjects(new Star(700,{x:this.data.x+26,y:this.data.y+2}));
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
  const KEYSET = this.data.KEYSET;
  if(!MAIN.TCI.keyboard.checkKey(KEYSET.QUIT) &&  MAIN.TCI.keyboard.checkKeyAny()){
    MAIN.changeProgram(MAIN.programs.game);
  }
};


var Program_Game = function(speed, data){
  this.data = {
    KEYSET: undefined,
    isPaused: false,
  };
  this.uniqueObjects = {
    status : undefined,
    player1Game : undefined,
    pausePopup: undefined,
  };
  TC.Program.call(this, speed, data);
};
Program_Game.prototype = Object.create(TC.Program.prototype);
Program_Game.prototype.constructor = Program_Game;

Program_Game.prototype.init = function(){
  this.uniqueObjects.status = new Status({
    x:28,y:3,
    COLORSET:MAIN.settings.colorset,
  }, MAIN.data.scores);
  this.uniqueObjects.player1Game = new Tetris({
    x:3,y:1,
    KEYSET:MAIN.settings.tetris1.keyset,
    COLORSET:MAIN.settings.colorset
  }, this.uniqueObjects.status);
  TC.Program.prototype.init.call(this);
};

Program_Game.prototype.getInput = function(){
  const KEYSET = this.data.KEYSET;
  if(MAIN.TCI.keyboard.checkKey(KEYSET.QUIT)){
    MAIN.changeProgram(MAIN.programs.intro);
  }
  if(MAIN.TCI.keyboard.checkKey(KEYSET.PAUSE)){
    if(this.data.isPaused){
      this.uniqueObjects.player1Game.interval.start();
      this.data.isPaused = false;
      MAIN.TCS.pasteScreen(this.data.pausedScreen);
      this.uniqueObjects.pausePopup.destroy();
    }
    else {
      this.uniqueObjects.player1Game.interval.stop();
      this.data.isPaused = true;
      this.data.pausedScreen = MAIN.TCS.copyScreen();
      MAIN.TCS.fillScreen(" ", null, "rgba(0,0,0,0.4)");
      this.uniqueObjects.pausePopup = new PausePopup(800,{x:15,y:11,bgColor:"#444"});
    }
  }
};

console.log("Main.js loaded");

var screenSetting = {
  zoom: 0.6,
  column: 70,
  row: 25,
  fontFamily:'Nanum Gothic Coding',
  fontSource:"https://fonts.googleapis.com/earlyaccess/nanumgothiccoding.css"
};

var charGroups = {
  fullwidth:{//■     □     ★     ☆     △     ▷     ▽     ◁     ▣    •
    regex:"\u2500-\u2BFF\u2022\u2008",
    isFullwidth:true,
    sizeAdj:1.2,
    xAdj:-0.05,
    yAdj:0.03,
  },
  brackets:{//[,],(,)
    regex:"\\[\\](){}",
    isFullwidth:false,
    sizeAdj:0.95,
    xAdj:0,
    yAdj:0,
  }
};

var gameSettings ={
  keyset:{
    QUIT:27, // esc key
    PAUSE:80, // "p";
  },
  colorset: {
    wall: "#F5F7FA",
    ceiling: "#656D78",
    block: ["#48CFAD","#FFCE54","#FC6E51","#EC87C0","#AC92EC","#4FC1E9","#A0D468"],
    grayBlock: "#AAB2BD",
    star: "#FFCE54",
  },
  tetris1:{
    keyset:{
      RIGHT:39,
      LEFT:37,
      ROTATE:38,
      DOWN:40,
      DROP:32, //space key
    }
  },
};

var TetrisProgramManager = function(){
  this.createWithOutInit = true;
  this.TCS = new TC.ScreenManager(screenSetting, charGroups);
  this.TCD = new TC.DebugManager();
  this.TCI = new TC.InputManager();
  this.settings = gameSettings;
  this.programs = {
    intro: undefined,
    tetris: undefined,
  };
  this.data = {
    scores:{
      lastScore: 0,
      bestScore: 0,
    }
  };
  TC.Object.prototype.init.call(this, this.createWithOutInit);
};
TetrisProgramManager.prototype = Object.create(TC.Object.prototype);
TetrisProgramManager.prototype.constructor = TetrisProgramManager;

TetrisProgramManager.prototype.init = function(){
  this.programs.intro = new Program_Intro(10,{x:5,y:3,KEYSET:this.settings.keyset});
  this.programs.tetris = new Program_Tetris(100,{KEYSET:Main.settings.keyset,isPaused:false});
  this.destroyAllPrograms();
  this.programs.intro.init();
  TC.Object.prototype.init.call(this);
};

TetrisProgramManager.prototype.destroy = function(){
  this.destroyAllPrograms();
  TC.Object.prototype.init.call(this);
};

TetrisProgramManager.prototype.destroyAllPrograms = function(){
  this.TCS.clearScreen();
  this.TCI.keyboard.clearKey();
  for(let i in this.programs){
    let program = this.programs[i];
    program.destroy();
  }
};
TetrisProgramManager.prototype.changeProgram = function(program){
  this.destroy();
  program.init();
};

var Main = new TetrisProgramManager();


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
  if(this.count ==  10) Main.TCS.insertText(this.data.x,    this.data.y+0, "■□□□■■■□□■■□□■■","#fff");
  if(this.count ==  20) Main.TCS.insertText(this.data.x,    this.data.y+1, "■■■□ ■□□  ■■□□■","#eee");
  if(this.count ==  30) Main.TCS.insertText(this.data.x,    this.data.y+2, "□□□■       □■ ■","#ddd");
  if(this.count ==  40) Main.TCS.insertText(this.data.x,    this.data.y+3, "■■□■■ □ ■ □□■□□","#ccc");
  if(this.count ==  50) Main.TCS.insertText(this.data.x,    this.data.y+4, "■■ ■□□□■■■□■■□□","#bbb");
  if(this.count ==  60) Main.TCS.insertText(this.data.x,    this.data.y+5, "           www.A-MEAN-Blog.com","#aaa");
  if(this.count ==  70) Main.TCS.insertText(this.data.x+10, this.data.y+2, "T E T R I S","#fff");
  if(this.count ==  70){
    this.addToObjects(new Star(500,{x:this.data.x+8,y:this.data.y+1}));
    this.addToObjects(new Star(700,{x:this.data.x+26,y:this.data.y+2}));
    Main.TCS.insertText(this.data.x,this.data.y+7, "Please Enter Any Key to Start..","#fff");
    Main.TCS.insertText(this.data.x,this.data.y+9, "  △   : Shift","#fff");
    Main.TCS.insertText(this.data.x,this.data.y+10,"◁  ▷ : Left / Right","#eee");
    Main.TCS.insertText(this.data.x,this.data.y+11,"  ▽   : Soft Drop","#ddd");
    Main.TCS.insertText(this.data.x,this.data.y+12," SPACE : Hard Drop","#ccc");
    Main.TCS.insertText(this.data.x,this.data.y+13,"   P   : Pause","#bbb");
    Main.TCS.insertText(this.data.x,this.data.y+14,"  ESC  : Quit","#aaa");
    Main.TCS.insertText(this.data.x,this.data.y+16,"BONUS FOR HARD DROPS / COMBOS","#aaa");
  }
};
Program_Intro.prototype.getInput = function(){
  const KEYSET = this.data.KEYSET;
  if(!Main.TCI.keyboard.checkKey(KEYSET.QUIT) &&  Main.TCI.keyboard.checkKeyAny()){
    Main.changeProgram(Main.programs.tetris);
  }
};


var Program_Tetris = function(speed, data){
  this.data = {
    KEYSET: undefined,
    isPaused: false,
  };
  this.uniqueObjects = {
    status : undefined,
    player1Game : undefined,
    pause: undefined,
  };
  TC.Program.call(this, speed, data);
};
Program_Tetris.prototype = Object.create(TC.Program.prototype);
Program_Tetris.prototype.constructor = Program_Tetris;

Program_Tetris.prototype.init = function(){
  this.uniqueObjects.status = new Status({
    x:28,y:3,
    COLORSET:Main.settings.colorset,
    scores:Main.data.scores
  });
  this.uniqueObjects.player1Game = new Tetris({
    x:3,y:1,
    KEYSET:Main.settings.tetris1.keyset,
    COLORSET:Main.settings.colorset
  }, this.uniqueObjects.status);
  TC.Program.prototype.init.call(this);
};

Program_Tetris.prototype.getInput = function(){
  const KEYSET = this.data.KEYSET;
  if(Main.TCI.keyboard.checkKey(KEYSET.QUIT)){
    Main.changeProgram(Main.programs.intro);
  }
  if(Main.TCI.keyboard.checkKey(KEYSET.PAUSE)){
    if(this.data.isPaused){
      this.uniqueObjects.player1Game.interval.start();
      this.data.isPaused = false;
      Main.TCS.pasteScreen(this.data.pausedScreen);
      this.uniqueObjects.pause.destroy();
    }
    else {
      this.uniqueObjects.player1Game.interval.stop();
      this.data.isPaused = true;
      this.data.pausedScreen = Main.TCS.copyScreen();
      Main.TCS.fillScreen(" ", null, "rgba(0,0,0,0.4)");
      this.uniqueObjects.pause = new Pause(800,{x:15,y:11,bgColor:"#444"});
    }
  }
};

Main.init();

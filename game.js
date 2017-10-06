console.log("game.js loaded");

var gameSetting={
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

var game = {
  TCS: new TC.Screen(
    // ScreenSetting
    {
      zoom: 0.6,
      column: 70,
      row: 25,
      fontFamily:'Nanum Gothic Coding',
      fontSource:"https://fonts.googleapis.com/earlyaccess/nanumgothiccoding.css"
    },
    // Char Group Setting
    {
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
    }
  ),
  TCD: new TC.DevTaskMgr(),
  programs: {},
  data: {
    scores:{
      lastScore: 0,
      bestScore: 0,
    },
  },
  init: function(){
    this.destroy();
    this.programs.intro.init();
  },
  destroy: function(){
    for(let i in this.programs){
      let program = this.programs[i];
      program.destroy();
    }
  },
  changeProgram: function(program){
    this.destroy();
    program.init();
  }
};

game.programs.intro = new TC.Program(10,{x:5,y:3});
game.programs.intro.timeline = function(){
  if(this.count ==  10) game.TCS.insertText(this.data.x,    this.data.y+0, "■□□□■■■□□■■□□■■","#fff");
  if(this.count ==  20) game.TCS.insertText(this.data.x,    this.data.y+1, "■■■□ ■□□  ■■□□■","#eee");
  if(this.count ==  30) game.TCS.insertText(this.data.x,    this.data.y+2, "□□□■       □■ ■","#ddd");
  if(this.count ==  40) game.TCS.insertText(this.data.x,    this.data.y+3, "■■□■■ □ ■ □□■□□","#ccc");
  if(this.count ==  50) game.TCS.insertText(this.data.x,    this.data.y+4, "■■ ■□□□■■■□■■□□","#bbb");
  if(this.count ==  60) game.TCS.insertText(this.data.x,    this.data.y+5, "           www.A-MEAN-Blog.com","#aaa");
  if(this.count ==  70) game.TCS.insertText(this.data.x+10, this.data.y+2, "T E T R I S","#fff");
  if(this.count ==  70){
    this.addToObjects(new Star(500,{x:this.data.x+8,y:this.data.y+1}));
    this.addToObjects(new Star(700,{x:this.data.x+26,y:this.data.y+2}));
    game.TCS.insertText(this.data.x,this.data.y+7, "Please Enter Any Key to Start..","#fff");
    game.TCS.insertText(this.data.x,this.data.y+9, "  △   : Shift","#fff");
    game.TCS.insertText(this.data.x,this.data.y+10,"◁  ▷ : Left / Right","#eee");
    game.TCS.insertText(this.data.x,this.data.y+11,"  ▽   : Soft Drop","#ddd");
    game.TCS.insertText(this.data.x,this.data.y+12," SPACE : Hard Drop","#ccc");
    game.TCS.insertText(this.data.x,this.data.y+13,"   P   : Pause","#bbb");
    game.TCS.insertText(this.data.x,this.data.y+14,"  ESC  : Quit","#aaa");
    game.TCS.insertText(this.data.x,this.data.y+16,"BONUS FOR HARD DROPS / COMBOS","#aaa");
  }
};
game.programs.intro.getInput = function(){
  if(!TC.inputs.keyboard.checkKey(gameSetting.keyset.QUIT) &&  TC.inputs.keyboard.checkKeyAny()){
    game.changeProgram(game.programs.tetris);
  }
};
game.programs.intro._destroy = function(){
  game.TCS.clearScreen();
  TC.inputs.keyboard.clearKey();
};

game.programs.tetris = new TC.Program(10,{isPaused:false});
game.programs.tetris.uniqueObjects = {
  status : undefined,
  player1Game : undefined,
  pause: undefined,
};
game.programs.tetris._init = function(){
  if(!this.uniqueObjects.status) this.uniqueObjects.status = new Status({x:28,y:3,colorset:gameSetting.colorset,scores:game.data.scores});
  this.uniqueObjects.player1Game = new Tetris({x:3,y:1,keyset:gameSetting.tetris1.keyset,colorset:gameSetting.colorset},this.uniqueObjects.status);
};
game.programs.tetris.getInput = function(){
  if(TC.inputs.keyboard.checkKey(gameSetting.keyset.QUIT)){
    game.changeProgram(game.programs.intro);
  }
  if(this.data.isPaused && TC.inputs.keyboard.checkKey(gameSetting.keyset.PAUSE)){
    TC.inputs.keyboard.clearKey(gameSetting.keyset.PAUSE);
    this.uniqueObjects.player1Game.interval.start();
    this.data.isPaused = false;
    game.TCS.pasteScreen(this.data.pausedScreen);
    this.uniqueObjects.pause.destroy();
  }
  if(!this.data.isPaused && TC.inputs.keyboard.checkKey(gameSetting.keyset.PAUSE)){
    TC.inputs.keyboard.clearKey(gameSetting.keyset.PAUSE);
    this.uniqueObjects.player1Game.interval.stop();
    this.data.isPaused = true;
    this.data.pausedScreen = game.TCS.copyScreen();
    game.TCS.fillScreen(" ", null, "rgba(0,0,0,0.4)");
    this.uniqueObjects.pause = new Pause(800,{x:15,y:11,bgColor:"#444"});
  }
};
game.programs.tetris._destroy = function(){
  game.TCS.clearScreen();
  TC.inputs.keyboard.clearKey();
};

game.init();

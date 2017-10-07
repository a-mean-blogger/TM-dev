console.log("tetris-main.js loaded");

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

var MAIN = {
  TCS: new TC.ScreenManager(screenSetting, charGroups),
  TCD: new TC.DebugManager(),
  TCI: new TC.InputManager(),
  settings: gameSettings,
  programs: {
    intro: new Program_Intro(10,{x:5,y:3,KEYSET:gameSettings.keyset}),
    game: new Program_Game(100,{KEYSET:gameSettings.keyset,isPaused:false}),
  },
  data: {
    scores:{
      lastScore: 0,
      bestScore: 0,
    }
  },
  init: function(){
    this.destroy();
    this.programs.intro.init();
  },
  destroy: function(){
    this.TCS.clearScreen();
    this.TCI.keyboard.clearKey();
    for(let i in this.programs){
      let program = this.programs[i];
      program.destroy();
    }
  },
  changeProgram: function(program){
    this.destroy();
    program.init();
  },
};

MAIN.init();

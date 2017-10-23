console.log('tetris-main.js loaded');

var screenSetting = {
  fontSize: 30,
  zoom: 0.6,
  column: 70,
  row: 25,
  fontFamily: 'Nanum Gothic Coding',
  fontSource: 'https://fonts.googleapis.com/earlyaccess/nanumgothiccoding.css',
};

var charGroups = {
  fullwidth: {//■     □     ★     ☆     △     ▷     ▽     ◁     ▣    •
    regex: '\u2500-\u2BFF\u2022\u2008',
    isFullwidth: true,
    sizeAdj: 1.2,
    xAdj: -0.05,
    yAdj: 0.03,
  },
  brackets: {//[,],(,)
    regex: '\\[\\](){}',
    isFullwidth: false,
    sizeAdj: 0.95,
    xAdj: 0,
    yAdj: 0,
  },
};

var debug = {
  devMode: true,
};

var TMS = new TM.ScreenManager(screenSetting, charGroups),
    TMD = new TM.DebugManager(debug),
    TMI = new TM.InputManager(null, debug.devMode);

var GAME_SETTINGS = {
  COL_NUM: 11,
  ROW_NUM: 23,
  SPEED_LOOKUP: [80, 60, 40, 20, 10, 8, 4, 2, 1, 0],
  KEYSET: {
    QUIT: 27, // esc key
    PAUSE: 80, // 'p';
  },
  COLORSET: {
    WALL: '#F5F7FA',
    CEILING: '#656D78',
    BLOCKS: ['#48CFAD', '#FFCE54', '#FC6E51', '#EC87C0', '#AC92EC', '#4FC1E9', '#A0D468'],
    GAME_OVER_BLOCK: '#AAB2BD',
  },
  PLAYER1: {
    KEYSET: {
      RIGHT: 39,
      LEFT: 37,
      ROTATE: 38,
      DOWN: 40,
      DROP: 32, //space key
    }
  },
};

var MAIN = {
  programs: {
    intro: new Program_Intro(),
    game: new Program_Game(),
  },
  data: {
    scores: {
      lastScore: 0,
      bestScore: 0,
    }
  },
  init: function(){
    TMS.cursor.hide();
    this.inactivate();
    this.programs.intro.init();
  },
  inactivate: function(){
    for(var i in this.programs){
      var program = this.programs[i];
      program.inactivate();
    }
  },
  changeProgram: function(program){
    this.inactivate();
    program.init();
  },
};

TMS.onReady(function(){
  MAIN.init();
});

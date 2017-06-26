console.log("setting.js loaded");

var setting = {};


setting.env={
  canvasId:"game",
  fontSize:16,
  frameSpeed:20,
  devMode:true,
};

setting.font={
  source:"https://fonts.googleapis.com/earlyaccess/nanumgothiccoding.css",
  fontFamily:'Nanum Gothic Coding',
  adjustment:{
    group1:{//ㄱ     -힝
      regex:"\u3131-\uD79D",
      isFullwidth:true,
      sizeAdj:1,
      xAdj:0,
      yAdj:0,
    },
    group2:{//■     □     ★     ☆     △     ▷     ▽     ◁     ▣
      regex:"\u25a0\u25a1\u2605\u2606\u25b3\u25b7\u25bd\u25c1\u25a3",
      isFullwidth:true,
      sizeAdj:1.2,
      xAdj:0,
      yAdj:0,
    },
    group3:{//[,],(,)
      regex:"\\[\\](){}",
      isFullwidth:false,
      sizeAdj:0.95,
      xAdj:0,
      yAdj:0,
    },
  }
};

setting.screen={
  column: 70, //120,
  row: 25, //40,
  backgroundColor:"#000",
  defalutFontColor:"#fff",
};

setting.game={
  tetris1:{
    keyset:{
      RIGHT:39,
      LEFT:37,
      ROTATE:38,
      DOWN:40,
      DROP:32
    }
  }
};

console.log("setting.js loaded");

var setting = {};


setting.env={
  canvasId:"game",
  fontSize:16,
  fps:60,
};

setting.charSets={
  //group1: ■     □
  group1:"\u25a0\u25a1",
  //group2: ㄱ     -힝     ★     ☆     △     ▷     ▽     ◁     ▣
  group2:"\u3131-\uD79D\u2605\u2606\u25b3\u25b7\u25bd\u25c1\u25a3",
  //group2: [,],(,)
  group3:"[\]()",
};

setting.screen={
  column: 70, //120,
  row: 25, //40,
  backgroundColor:"#000",
  defalutFont:"monospace",
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

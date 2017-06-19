console.log("setting.js loaded");

var setting = {};


setting.env={
  canvasId:"game",
  fontSize:15,
  fps:100,
};

setting.game={
  frame:{
    column: 60, //120,
    row: 25, //40,
    backgroundColor:"#000",
    defalutFont:"monospace",
    defalutFontColor:"#fff",
  },
//charGroup1: ■     □
  charGroup1:"\u25a0\u25a1",
//charGroup2: ㄱ     -힝     ★     ☆     △     ▷     ▽     ◁
  charGroup2:"\u3131-\uD79D\u2605\u2606\u25b3\u25b7\u25bd\u25c1",
};

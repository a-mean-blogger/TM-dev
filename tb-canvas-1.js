console.log("tb-canvas-1.js loaded");


var tbCanvas = {};

tbCanvas.setting = {};
tbCanvas.setting.screen={
  canvasId:"tb-canvas",
  fontSize: 30,
  frameSpeed: 10,
  zoom: 0.6,
  column: 70, //120,
  row: 25, //40,
  backgroundColor:"#000",
  defalutFontColor:"#fff",
  fontFamily:'Nanum Gothic Coding',
  fontSource:"https://fonts.googleapis.com/earlyaccess/nanumgothiccoding.css",
};

tbCanvas.setting.devMode={
  isActive: true,
  outputDomId: "devOutput",
  frameSpeed: 10,
};

tbCanvas.setting.charGroups={
  group1:{//ㄱ     -힝
    regex:"\u3131-\uD79D",
    isFullwidth:true,
    sizeAdj:1,
    xAdj:0,
    yAdj:0,
  },
  group2:{//■     □     ★     ☆     △     ▷     ▽     ◁     ▣    •
    regex:"\u25a0\u25a1\u2605\u2606\u25b3\u25b7\u25bd\u25c1\u25a3\u2022",
    isFullwidth:true,
    sizeAdj:1.2,
    xAdj:-0.05,
    yAdj:0.03,
  },
  group3:{//[,],(,)
    regex:"\\[\\](){}",
    isFullwidth:false,
    sizeAdj:0.95,
    xAdj:0,
    yAdj:0,
  },
};

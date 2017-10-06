console.log("text-canvas-1.js loaded");

// Declare TC and TC default settings

var TC = {};

TC.defaultSettings = {};

TC.defaultSettings.screen={
  canvasId:"text-canvas",
  fontSize: 30,
  frameSpeed: 10,
  zoom: 0.6,
  column: 70, //120,
  row: 25, //40,
  backgroundColor:"#151617",
  defalutFontColor:"#F5F7FA",
  fontFamily:'Nanum Gothic Coding',
  fontSource:"https://fonts.googleapis.com/earlyaccess/nanumgothiccoding.css",
};

TC.defaultSettings.devMode={
  isActive: false,
  outputDomId: "devOutput",
  frameSpeed: 10,
};

TC.defaultSettings.charGroups={
  group1:{//ㄱ     -힝
    regex:"\u3131-\uD79D",
    isFullwidth:true,
    sizeAdj:1,
    xAdj:0,
    yAdj:0,
  },
  group2:{//■     □     ★     ☆     △     ▷     ▽     ◁     ▣    •
    regex:"\u2500-\u2BFF\u2022\u2008",
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

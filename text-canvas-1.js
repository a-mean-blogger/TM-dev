console.log("text-canvas-1.js loaded");

// Declare TC and TC default settings

var TC = {};

TC.defaultSettings = {};

TC.defaultSettings.screen={
  canvasId:"text-canvas",
  fontSize: 15,
  frameSpeed: 10,
  zoom: 1,
  column: 60,
  row: 20,
  backgroundColor:"#151617",
  defalutFontColor:"#F5F7FA",
  fontFamily:'monospace',
  fontSource:null,
};

TC.defaultSettings.charGroups={
  korean:{//ㄱ     -힝
    regex:"\u3131-\uD79D",
    isFullwidth:true,
    sizeAdj:1,
    xAdj:0,
    yAdj:0,
  },
};

TC.defaultSettings.devMode={
  isActive: true,
  outputDomId: "devOutput",
  frameSpeed: 10,
};

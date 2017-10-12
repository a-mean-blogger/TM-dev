console.log('TM.defaultSettings loaded');

var TM = {};

TM.defaultSettings = {
  screen: {
    canvasId: 'tm-canvas',
    fontSize: 15,
    frameSpeed: 10,
    zoom: 1,
    column: 60,
    row: 20,
    backgroundColor: '#151617',
    defalutFontColor: '#F5F7FA',
    fontFamily: 'monospace',
    fontSource: null,
  },
  charGroups: {
    korean: {//ㄱ     -힝
      regex: '\u3131-\uD79D',
      isFullwidth: true,
      sizeAdj: 1,
      xAdj: 0,
      yAdj: 0,
    },
  },
  debug: {
    devMode: false,
    outputDomId: 'tm-debug-output',
  }
};

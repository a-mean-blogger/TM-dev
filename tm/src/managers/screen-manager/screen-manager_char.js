console.log('TM.ScreenManager_Char loaded');

/******************************/
/* TM.ScreenManager_Char      */
/******************************/
// Description: Contains char block information of screen.
TM.ScreenManager_Char = function(screen, char, isFullwidth, color, backgroundColor){
  this.char = char;
  this.isFullwidth = isFullwidth;
  this.color = color?color:screen.defalutFontColor;
  this.backgroundColor = backgroundColor?backgroundColor:screen.backgroundColor;
  this.font = screen.fontFamily;
  this.isNew = true;
};

console.log('TM.ScreenManager_Char loaded');

//=============================
// TM.ScreenManager_Char
//=============================
// Description: Contains char block information of screen.
TM.ScreenManager_Char = function(screenSetting, char, isFullwidth, color, backgroundColor){
  this.char = char;
  this.isFullwidth = isFullwidth;
  this.color = color?color:screenSetting.defalutFontColor;
  this.backgroundColor = backgroundColor?backgroundColor:screenSetting.backgroundColor;
  this.font = screenSetting.fontFamily;
  this.isNew = true;
};

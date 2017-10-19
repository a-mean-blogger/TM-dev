//=============================
// TM.ScreenManager_Char
//=============================
TM.ScreenManager_Char = function(screenSetting, char, isFullwidth, color, backgroundColor){
  this.char = char;
  this.isFullwidth = isFullwidth;
  this.color = color?color:screenSetting.defaultFontColor;
  this.backgroundColor = backgroundColor?backgroundColor:screenSetting.backgroundColor;
  this.font = screenSetting.fontFamily;
  this.isNew = true;
};

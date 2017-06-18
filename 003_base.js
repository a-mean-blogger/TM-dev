console.log("base.js loaded");

var base = {};


base.frame = {
  init:function(){
    var $dom = $("#"+setting.env.domId);
    $dom.css("width", common.getBlockWidth(setting.env.fontSize) * setting.game.frame.column + "px");
    $dom.css("height", common.getBlockHeight(setting.env.fontSize) * setting.game.frame.row + "px");
    $dom.css("lineHeight", common.getBlockHeight(setting.env.fontSize) + "px");
    $dom.css("backgroundColor", setting.game.frame.backgroundColor);
    $dom.css("color", setting.game.frame.fontColor);
    $dom.css("borderRadius", "5px");
  },
};

base.screen = {
  data: [],
  interval: new common.Interval(),
  loop: function(){
    this.display();
  },
  init: function(char){
    this.data = [];
    for(var i = 0; i <setting.game.frame.row; i++){
      this.data[i]=[];
      for(var j = 0; j<setting.game.frame.column; j++){
        this.data[i][j]=char;
      }
    }
    this.interval.init(setting.env.fts, _=>this.loop());
  },
  display: function() {
    var $dom = $("#"+setting.env.domId);
    var text = "";
    for(var i = 0; i <setting.game.frame.row; i++){
      var row = "";
      for(var j = 0; j<setting.game.frame.column; j++){
        row += this.data[i][j];
      }
      text += row +"\n";
    }
    $dom.text(text);
  },
  insertChar : function(x,y,char){
    if(char.constructor != String) return console.error(char+" is invalid");
    if(y<this.data.length && x<this.data[y].length){
      this.data[y][x] = char[0];
    }
  },
  deleteChar : function(x,y){
    if(char.constructor != String) return console.error(char+" is invalid");
    this.insertChar(x,y," ");
  },
  insertText : function(x,y,text){
    if(text.constructor != String) return console.error(text+" is invalid");
    if(y<0 || y>=this.data.length) return;
    for(var i = 0; i<text.length; i++){
      if(x+i>=0 && x+i <setting.game.frame.column)
      this.insertChar(x+i,y,text[i]);
    }
  },
  deleteText : function(x,y,text){
    if(text.constructor != String) return console.error(text+" is invalid");
    this.insertText(x,y,text.replace(/./g," "));
  },
};

base.frame.init();
base.screen.init(" ");

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

const KEY_UP = 38;
const KEY_DOWN = 40;
const KEY_RIGHT = 39;
const KEY_LEFT = 37;
const KEY_SPACE = 32;
base.inputs = {
  isAllowed: true,
  keyboard:{
    isAllowed: true,
    keystate:{},
    eventHandlers:{
      keydown: function(e){
        if(base.inputs.isAllowed && base.inputs.keyboard.isAllowed){
          base.inputs.keyboard.keystate[e.keyCode] = true;
        }
      },
      keyup: function(e){
        delete base.inputs.keyboard.keystate[e.keyCode];
      },
    },
    init: function(){
      document.addEventListener("keydown", this.eventHandlers.keydown);
      document.addEventListener("keyup", this.eventHandlers.keyup);
    },
  },
  init: function(){
    this.keyboard.init();
  }
};

base.frame.init();
base.screen.init(" ");
base.inputs.init();

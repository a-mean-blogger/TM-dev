console.log("base.js loaded");

var base = {};

base.canvas = {
  canvas: undefined,
  ctx: undefined,
  width: common.getBlockWidth(setting.env.fontSize) * setting.screen.column,
  height: common.getBlockHeight(setting.env.fontSize) * setting.screen.row,
  backgroundColor: setting.screen.backgroundColor,
  font: {
    size: setting.env.fontSize,
    width: common.getBlockWidth(setting.env.fontSize),
    height: common.getBlockHeight(setting.env.fontSize),
  },
  data: [],
  count: 0,
  countMax: 6,
  loop: function(){
    if(--this.count<=0){
      this.count = this.countMax;
      this.draw();
    }
  },
  init: function(){
    var link = document.createElement('link');
    link.href = setting.font.source;
    link.rel = "stylesheet";
    document.getElementsByTagName('head')[0].appendChild(link);

    this.canvas = document.querySelector("#"+setting.env.canvasId);
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.canvas.style.border = this.backgroundColor+" 1px solid";
    this.canvas.style.borderRadius = "5px";
    this.ctx = this.canvas.getContext("2d");

    this.clear();
  },
  fillChar: function(char){
    if(typeof char != "string") char = " ";
    this.data = [];
    for(var i = 0; i <setting.screen.row; i++){
      this.data[i]=[];
      for(var j = 0; j<setting.screen.column; j++){
        this.data[i][j]=new common.Char(char);
      }
    }
  },
  clear: function(){
    this.fillChar(" ");
  },
  draw: function() {
    var ctx = this.ctx;
    ctx.fillStyle = this.backgroundColor;
    ctx.fillRect(0,0,this.width,this.height);
    ctx.textBaseline = "buttom";

    for(var i = 0; i <setting.screen.row; i++){
      for(var j = 0; j<setting.screen.column; j++){
        var x = this.font.width*j;
        var y = this.font.height*i;
        ctx.fillStyle = this.data[i][j].backgroundColor;
        ctx.fillRect(x,y,this.font.width+1,this.font.height+1);
      }
    }

    for(var i = 0; i <setting.screen.row; i++){
      for(var j = 0; j<setting.screen.column; j++){
        var x = this.font.width*j;
        var y = this.font.height*i+this.font.height*0.8; // y adjustment

        var charset = common.getCharGroup(this.data[i][j].char);
        if(charset){
          ctx.font = this.font.size*charset.sizeAdj+"px "+this.data[i][j].font;
          x = x+this.font.width*charset.xAdj;
          y = y+this.font.height*charset.yAdj;
        }
        else {
          ctx.font = this.font.size+"px "+this.data[i][j].font;
        }
        ctx.fillStyle = this.data[i][j].color;
        ctx.fillText(this.data[i][j].char,x,y);
      }
    }
  },
  insertChar : function(x,y,char,color,backgroundColor){
    if(char.constructor != String) return console.error(char+" is invalid");

    if(y<this.data.length && x<this.data[y].length){
      this.data[y][x] = new common.Char(char[0],color,backgroundColor);
    }
  },
  deleteChar : function(x,y){
    if(char.constructor != String) return console.error(char+" is invalid");
    this.insertChar(x,y," ");
  },
  insertText : function(x,y,text,color,backgroundColor){
    var regex = common.getFullwidthRegex();
    text = text.replace(regex,"$1 ");
    if(text.constructor != String) return console.error(text+" is invalid");
    if(y<0 || y>=this.data.length) return;
    for(var i = 0; i<text.length; i++){
      if(x+i>=0 && x+i <setting.screen.column)
      this.insertChar(x+i,y,text[i],color,backgroundColor);
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
const KEY_ESC = 27;
const KEY_P = 80;
base.inputs = {
  isAllowed: true,
  keyboard:{
    isAllowed: true,
    keystate:{},
    eventHandlers:{
      keydown: function(e){
        e.preventDefault();
        if(base.inputs.isAllowed && base.inputs.keyboard.isAllowed){
          base.inputs.keyboard.keystate[e.keyCode] = true;
          // console.log("e.keyCode: ", e.keyCode);
        }
      },
      keyup: function(e){
        e.preventDefault();
        delete base.inputs.keyboard.keystate[e.keyCode];
      },
    },
    init: function(){
      document.addEventListener("keydown", this.eventHandlers.keydown);
      document.addEventListener("keyup", this.eventHandlers.keyup);
    },
    check: function(keyCode){
      // console.log("keyCode: ", keyCode);
      // console.log("this.keystate: ", this.keystate);
      if(this.keystate[keyCode]) {
        // delete base.inputs.keyboard.keystate[keyCode];
        return true;
      }
      else return false;
    },
    checkAny: function(){
      if(Object.keys(this.keystate).length) return true;
      else return false;
    },
  },
  init: function(){
    this.keyboard.init();
  }
};

base.main = {
  interval: new common.Interval(),
  init: function(){
    this.interval.init(10, _=> {
      this.loop();
      base.canvas.loop();
    });
  },
  loop: function(){}
}

base.canvas.init();
base.inputs.init();
base.main.init();

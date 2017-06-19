console.log("base.js loaded");

var base = {};


base.frame = {
  ctx: undefined,
  width: common.getBlockWidth(setting.env.fontSize) * setting.game.frame.column,
  height: common.getBlockHeight(setting.env.fontSize) * setting.game.frame.row,
  backgroundColor: setting.game.frame.backgroundColor,
  init:function(){
    var canvas = document.querySelector("#"+setting.env.canvasId);
    canvas.width = this.width;
    canvas.height = this.height;
    canvas.style.border = this.backgroundColor+" 1px solid";
    canvas.style.borderRadius = "5px";
    this.ctx = canvas.getContext("2d");
  },
};

base.screen = {
  data: [],
  font: {
    size: setting.env.fontSize,
    width: common.getBlockWidth(setting.env.fontSize),
    height: common.getBlockHeight(setting.env.fontSize),
  },
  interval: new common.Interval(),
  loop: function(){
    this.draw();
  },
  init: function(){
    this.clear();
    this.interval.init(setting.env.fts, _=>this.loop());
  },
  fill: function(char){
    if(typeof char != "string") char = " ";
    this.data = [];
    for(var i = 0; i <setting.game.frame.row; i++){
      this.data[i]=[];
      for(var j = 0; j<setting.game.frame.column; j++){
        this.data[i][j]=new common.Block(char);
      }
    }
  },
  clear: function(){
    this.fill(" ");
  },
  draw: function() {
    var ctx = base.frame.ctx;
    ctx.fillStyle = base.frame.backgroundColor;
    ctx.fillRect(0,0,base.frame.width,base.frame.height);
    ctx.textBaseline = "buttom";

    for(var i = 0; i <setting.game.frame.row; i++){
      for(var j = 0; j<setting.game.frame.column; j++){
        var x = this.font.width*j;
        var y = this.font.height*i;
        ctx.fillStyle = this.data[i][j].backgroundColor;
        ctx.fillRect(x,y,this.font.width+1,this.font.height+1);
      }
    }

    for(var i = 0; i <setting.game.frame.row; i++){
      for(var j = 0; j<setting.game.frame.column; j++){
        var x = this.font.width*j;
        var y = this.font.height*i+this.font.height*0.8; // y adjustment
        if(common.isCharGroup1(this.data[i][j].char)){
          ctx.font = this.font.size*2.25+"px "+this.data[i][j].font;
          y = y +this.font.height*0.4;
          // console.log(this.data[i][j].char, "symbol");
        }
        else if(common.isCharGroup2(this.data[i][j].char)){
          ctx.font = this.font.size+"px "+this.data[i][j].font;
          x = x+this.font.width*0.3;
          y = y+this.font.height*0.05;
          // console.log(this.data[i][j].char,"korean");
        }
        else if(/[[\]()]/.test(this.data[i][j].char)){
          ctx.font = this.font.size+"px "+this.data[i][j].font;
          y = y-this.font.height*0.1;
          // console.log(this.data[i][j].char,"base");
        } else {
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
      this.data[y][x] = new common.Block(char[0],color,backgroundColor);
    }
  },
  deleteChar : function(x,y){
    if(char.constructor != String) return console.error(char+" is invalid");
    this.insertChar(x,y," ");
  },
  insertText : function(x,y,text,color,backgroundColor){
    var regex = new RegExp("(["+setting.game.charGroup1+setting.game.charGroup2+"])","g");
    text = text.replace(regex,"$1 ");
    if(text.constructor != String) return console.error(text+" is invalid");
    if(y<0 || y>=this.data.length) return;
    for(var i = 0; i<text.length; i++){
      if(x+i>=0 && x+i <setting.game.frame.column)
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
    check: function(keyCode){
      if(this.keystate[keyCode]) return true;
      else return false;
    },
  },
  init: function(){
    this.keyboard.init();
  }
};

base.frame.init();
base.screen.init();
base.inputs.init();

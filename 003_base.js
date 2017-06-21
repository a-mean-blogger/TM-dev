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
  interval: new common.Interval(),
  loop: function(){
    this.draw();
  },
  init: function(){
    this.canvas = document.querySelector("#"+setting.env.canvasId);
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.canvas.style.border = this.backgroundColor+" 1px solid";
    this.canvas.style.borderRadius = "5px";
    this.ctx = this.canvas.getContext("2d");

    this.clear();
    this.interval.init(setting.env.fps, _=>this.loop());
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

        switch(common.getCharGroup(this.data[i][j].char)){
          case "group1":
            ctx.font = this.font.size*2.25+"px "+this.data[i][j].font;
            y = y +this.font.height*0.4;
            break;
          case "group2":
            ctx.font = this.font.size+"px "+this.data[i][j].font;
            x = x+this.font.width*0.3;
            y = y+this.font.height*0.05;
            break;
          case "group3":
            ctx.font = this.font.size+"px "+this.data[i][j].font;
            y = y-this.font.height*0.1;
            break;
          default:
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
    var regex = new RegExp("(["+setting.charSets.group1+setting.charSets.group2+"])","g");
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
      if(this.keystate[keyCode]) return true;
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

// base.canvas.init();
base.canvas.init();
base.inputs.init();

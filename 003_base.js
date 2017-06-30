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
  previousData: [],
  count: 0,
  countMax: 1,
  loop: function(){
    if(--this.count<=0){
      this.count = this.countMax;
      this.draw();
    }
    this.dev.adjustDrawSpeed();
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
    this.canvas.style.backgroundColor = this.backgroundColor;
    this.ctx = this.canvas.getContext("2d");

    this.data = [];
    this.previousData = [];
    for(let i = 0; i <setting.screen.row; i++){
      this.data[i]=[];
      this.previousData[i]=[];
      for(let j = 0; j<setting.screen.column; j++){
        this.data[i][j]=new common.Char(" ");
        this.previousData[i][j]=new common.Char(" ");
      }
    }
  },
  fillChar: function(char){
    if(typeof char != "string") char = " ";
    this.data = [];
    for(let i = 0; i <setting.screen.row; i++){
      this.data[i]=[];
      for(let j = 0; j<setting.screen.column; j++){
        this.data[i][j]=new common.Char(char);
      }
    }
  },
  clear: function(){
    this.fillChar(" ");
  },
  draw: function() {
    let ctx = this.ctx;
    ctx.textBaseline = "buttom";
    for(let i = 0; i <setting.screen.row; i++){
      for(let j = 0; j<setting.screen.column; j++){
        let x = this.font.width*j-1;
        let y = this.font.height*i;

        if(this.previousData[i][j].isFullwidth
        && (!this.data[i][j].isFullwidth || this.data[i][j+1].char!=" ")){
          let width = this.font.width*2+1;
          let height = this.font.height+1;
          ctx.fillStyle = this.backgroundColor;
          ctx.fillRect(x,y,width,height);
        }
        else if(this.data[i][j].backgroundColor != this.previousData[i][j].backgroundColor
        || this.data[i][j].char != this.previousData[i][j].char){
          let width = (this.data[i][j].isFullwidth?this.font.width*2:this.font.width)+1;
          let height = this.font.height+1;
          ctx.fillStyle = this.data[i][j].backgroundColor;
          ctx.fillRect(x,y,width,height);
        }
      }
    }
    for(let i = 0; i <setting.screen.row; i++){
      for(let j = 0; j<setting.screen.column; j++){
        if(this.data[i][j].char != this.previousData[i][j].char
        || this.data[i][j].color != this.previousData[i][j].color
        || this.data[i][j].backgroundColor != this.previousData[i][j].backgroundColor){
          let x = this.font.width*j;
          let y = this.font.height*i+this.font.height*0.8; // y adjustment

          let charset = common.getCharGroup(this.data[i][j].char);
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
    }
    for(let i = 0; i <setting.screen.row; i++){
      for(let j = 0; j<setting.screen.column; j++){
        this.previousData[i][j].char = this.data[i][j].char;
        this.previousData[i][j].isFullwidth = this.data[i][j].isFullwidth;
        this.previousData[i][j].color = this.data[i][j].color;
        this.previousData[i][j].backgroundColor = this.data[i][j].backgroundColor;
      }
    }
  },
  insertChar : function(x,y,char,color,backgroundColor){
    if(char.constructor != String) return console.error(char+" is invalid");

    var regex = common.getFullwidthRegex();
    var fullwidth = regex.test(char);

    if(y<this.data.length && x<this.data[y].length){
      this.data[y][x] = new common.Char(char[0],fullwidth,color,backgroundColor);
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
    for(let i = 0; i<text.length; i++){
      if(x+i>=0 && x+i <setting.screen.column)
      this.insertChar(x+i,y,text[i],color,backgroundColor);
    }
  },
  deleteText : function(x,y,text){
    if(text.constructor != String) return console.error(text+" is invalid");
    this.insertText(x,y,text.replace(/./g," "));
  },
};

base.canvas.dev = {};
base.canvas.dev.adjustDrawSpeed = function(){
    var now = Date.now();
    if(--this.adjustDrawSpeed.count<0){
      this.adjustDrawSpeed.count = this.adjustDrawSpeed.countMax;
      var drawSpeed = (now-this.adjustDrawSpeed.time)/this.adjustDrawSpeed.countMax;
      var fps = this.adjustDrawSpeed.countMax/(now-this.adjustDrawSpeed.time)/(base.canvas.countMax+1)*1000;
      var text = "";
      if(setting.env.devMode){
        text = "FPS: "+ fps.toFixed(2)
        + " Draw Speed: " + drawSpeed.toFixed(2)
        + " canvas.countMax: " + base.canvas.countMax
        + " balance: " + this.adjustDrawSpeed.balance
        + "    ";
      }
      else {
        text="frame speed: "+ drawSpeed.toFixed(2) + "  ";
      }
      base.canvas.insertText(0,0,text);
      document.querySelector("#fps").innerText=text;

      this.adjustDrawSpeed.time = now;

      // console.log(drawSpeed, setting.env.frameSpeed*1.1);
      var offset = this.adjustDrawSpeed.balanceMaxOffset;
      if(drawSpeed > setting.env.frameSpeed*1.15 && ++this.adjustDrawSpeed.balance >= offset){
        this.adjustDrawSpeed.balance = offset;
        if(drawSpeed/setting.env.frameSpeed > 2) base.canvas.countMax += 20;
        else if(drawSpeed/setting.env.frameSpeed > 1.5) base.canvas.countMax += base.canvas.countMax*2<20?base.canvas.countMax*2:20;
        else if(drawSpeed/setting.env.frameSpeed > 1.3) base.canvas.countMax += base.canvas.countMax*2<10?base.canvas.countMax*2:10;
        else base.canvas.countMax += 1;
      }
      else if(drawSpeed < setting.env.frameSpeed*1.15 && base.canvas.countMax > 0 && --this.adjustDrawSpeed.balance <= -offset){
        this.adjustDrawSpeed.balance = -offset;
        base.canvas.countMax -= 1;
      }
    }
};
base.canvas.dev.adjustDrawSpeed.time = Date.now();
base.canvas.dev.adjustDrawSpeed.count = 0;
base.canvas.dev.adjustDrawSpeed.countMax = 10;
base.canvas.dev.adjustDrawSpeed.balance = 3;
base.canvas.dev.adjustDrawSpeed.balanceMaxOffset = 3;


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
    this.interval.init(setting.env.frameSpeed, _=> {
      this.loop();
      base.canvas.loop();
    });
  },
  loop: function(){}
};

base.canvas.init();
base.inputs.init();
base.main.init();

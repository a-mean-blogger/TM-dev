console.log("base.js loaded");

var base = {};

base.canvas = {
  canvas: undefined,
  ctx: undefined,
  width: common.getBlockWidth(setting.env.fontSize) * setting.env.column,
  height: common.getBlockHeight(setting.env.fontSize) * setting.env.row,
  backgroundColor: setting.env.backgroundColor,
  font: {
    size: setting.env.fontSize,
    width: common.getBlockWidth(setting.env.fontSize),
    height: common.getBlockHeight(setting.env.fontSize),
    isLoaded: false,
    checkLoaded: function(func){
      if(document.fonts.check("1em "+setting.font.fontFamily)){
        this.isLoaded = true;
        func();
      }
    },
  },
  screen: {
    data: [],
    count: 0,
    countMax: 3,
    init:function(){
      this.data = [];
      for(let i = 0; i <setting.env.row; i++){
        this.data[i]=[];
        for(let j = 0; j<setting.env.column; j++){
          this.data[i][j]=new common.Char(" ");
        }
      }
    },
    refresh:function(){
      for(let i = 0; i <this.data.length; i++){
        for(let j = 0; j<this.data[i].length; j++){
          this.data[i][j].draw = true;
        }
      }
    },
  },
  loop: function(){
    if(--this.screen.count<=0){
      this.screen.count = this.screen.countMax;
      if(!this.font.isLoaded) this.font.checkLoaded(_=>this.screen.refresh());
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
    this.canvas.style.backgroundColor = this.backgroundColor;
    this.canvas.style.width = this.width*(setting.env.zoom?setting.env.zoom:1)+"px";
    this.canvas.style.height = this.height*(setting.env.zoom?setting.env.zoom:1)+"px";
    this.ctx = this.canvas.getContext("2d");

    this.screen.init();
  },
  fillChar: function(char){
    if(typeof char != "string") char = " ";
    this.screen.data = [];
    for(let i = 0; i <setting.env.row; i++){
      this.screen.data[i]=[];
      for(let j = 0; j<setting.env.column; j++){
        this.screen.data[i][j]=new common.Char(char);
      }
    }
  },
  clear: function(){
    this.fillChar(" ");
  },
  draw: function() {
    let ctx = this.ctx;
    ctx.textBaseline = "buttom";
    for(let i = 0; i <setting.env.row; i++){
      for(let j = 0; j<setting.env.column; j++){
        if(this.screen.data[i][j].char[0] != "$"
          && this.screen.data[i][j].draw === true
        ){
          //draw backgroundColor
          let bgX = this.font.width*j-this.font.width*0.05;
          let bgY = this.font.height*i;
          let width = (this.screen.data[i][j].isFullwidth?this.font.width*2:this.font.width)+this.font.width*0.05;
          let height = this.font.height;
          ctx.fillStyle = this.screen.data[i][j].backgroundColor;
          ctx.fillRect(bgX,bgY,width,height);

          //draw char
          let chX = this.font.width*j;
          let chY = this.font.height*i+this.font.height*0.8; // y adjustment
          let charset = common.getCharGroup(this.screen.data[i][j].char);
          if(charset){
            ctx.font = this.font.size*charset.sizeAdj+"px "+this.screen.data[i][j].font;
            chX = chX+this.font.width*charset.xAdj;
            chY = chY+this.font.height*charset.yAdj;
          }
          else {
            ctx.font = this.font.size+"px "+this.screen.data[i][j].font;
          }
          ctx.fillStyle = this.screen.data[i][j].color;
          ctx.fillText(this.screen.data[i][j].char,chX,chY);

          //do not draw once it already drew for the better performance
          this.screen.data[i][j].draw = false;
        }
      }
    }
  },
  isInCanvas: function(x,y){
    if(x>=0 && y>=0 && y<this.screen.data.length && x<this.screen.data[y].length) return true;
    else return false;
  },
  insertChar: function(x,y,char,color,backgroundColor){
    if(char.constructor != String) return console.error(char+" is invalid");

    color = color?color:setting.env.defalutFontColor;
    backgroundColor = backgroundColor?backgroundColor:setting.env.backgroundColor;

    if(this.isInCanvas(x,y)
      && (this.screen.data[y][x].char != char
        || this.screen.data[y][x].color != color
        || this.screen.data[y][x].backgroundColor != backgroundColor)){
      let regex = common.getFullwidthRegex();
      let fullwidth = regex.test(char);

      this.screen.data[y][x] = new common.Char(char,fullwidth,color,backgroundColor);

      // to clean background outliner
      if(this.isInCanvas(x-1,y)) this.screen.data[y][x-1].draw = true;
      if(this.isInCanvas(x+(fullwidth?2:1),y)) this.screen.data[y][x+(fullwidth?2:1)].draw = true;
    }
  },
  deleteChar : function(x,y){
    if(char.constructor != String) return console.error(char+" is invalid");
    this.insertChar(x,y," ");
  },
  insertText : function(x,y,text,color,backgroundColor){
    let regex = common.getFullwidthRegex();
    text = text.replace(regex,"$1 ");
    if(text.constructor != String) return console.error(text+" is invalid");
    if(y<0 || y>=this.screen.data.length) return;
    for(let i = 0; i<text.length; i++){
      if(x+i>=0 && x+i <setting.env.column){
        this.insertChar(x+i,y,text[i],color,backgroundColor);

        let regex = common.getFullwidthRegex();
        let fullwidth = regex.test(text[i]);
        if(fullwidth){
          i++;
          this.insertChar(x+i,y,"$fullwidthFiller");
        }
      }
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
    this.interval.init(setting.env.frameSpeed, _=> {
      this.loop();
      base.canvas.loop();
      if(setting.devMode.isActive) base.devMode.loop();
    });
  },
  loop: function(){},
};

base.devMode = {
  dom: document.querySelector("#"+setting.devMode.outputDomId),
  tasks:{},
  loop:function(){
    for(let key in this.tasks){
      this.tasks[key].loop();
    }
  }
};

base.devMode.tasks.showFps = {
  output: '',
  domId: 'showFps',
  data:{
    time: Date.now(),
    count: 0,
    countMax: 10,
  },
  loop: function(){
    let now = Date.now();
    if(--this.data.count<0){
      this.data.count = this.data.countMax;
      let drawSpeed = (now-this.data.time)/this.data.countMax;
      let fps = (this.data.countMax/(now-this.data.time))*1000;
      this.data.time = now;

      this.output = `FPS: ${fps.toFixed(2)} `
      + `Screen Refresh Speed(actual/setting): ${drawSpeed.toFixed(2)}/${setting.env.frameSpeed} `;
      this.display();
    }
  },
  display: function(){
    let dom = document.querySelector("#"+this.domId);
    if(!dom){
      dom = document.createElement("div");
      dom.id = this.domId;
      base.devMode.dom.appendChild(dom);
    }
    dom.innerText = this.output;
  }
};


base.canvas.init();
base.inputs.init();
base.main.init();

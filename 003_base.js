console.log("base.js loaded");

var base = {};


base.Interval = function(){
  this.id = undefined;
  this.func = undefined;
  this.speed = undefined;
};
base.Interval.prototype.stop = function () {
  window.clearInterval(this.id);
  this.id = null;
};
base.Interval.prototype.start = function () {
  this.stop();
  this.func();
  this.id = window.setInterval(_=>this.func(), this.speed);
};
base.Interval.prototype.setSpeed = function (speed) {
  this.speed = speed;
  this.start();
};
base.Interval.prototype.init = function (speed,func) {
  this.speed = speed;
  this.func = func;
  this.start();
};


base.LoopObject = function(speed){
  this.isActive = true;
  this.speed = speed;
  this.interval = new base.Interval();
  this.init();
};
base.LoopObject.prototype.init = function (){
  if(this.speed) this.initInterval();
};
base.LoopObject.prototype.initInterval = function(){
  this.isActive = true;
  this.interval.init(this.speed, _=> {
    if(this.isActive) this.calculate();
    if(this.isActive) this.draw();
  });
};
base.LoopObject.prototype.destroy = function(){
  this.interval.stop();
  this.isActive = false;
  this.erase();
};
base.LoopObject.prototype.calculate = function(){};
base.LoopObject.prototype.draw = function(){};
base.LoopObject.prototype.erase = function(){};


base.Canvas_Char = function(char,isFullwidth,color,backgroundColor){
  this.char = char;
  this.isFullwidth = isFullwidth;
  this.color = color?color:setting.screen.defalutFontColor;
  this.backgroundColor = backgroundColor?backgroundColor:setting.screen.backgroundColor;
  this.font = setting.font.fontFamily;
  this.draw = true;
};


base.Canvas = function(settingScreen,settingFont){
  var width = common.getBlockWidth(settingScreen.fontSize) * settingScreen.column;
  var height = common.getBlockHeight(settingScreen.fontSize) * settingScreen.row;

  this.backgroundColor = settingScreen.backgroundColor;
  this.canvas = document.querySelector("#"+settingScreen.canvasId);
  this.canvas.width = width;
  this.canvas.height = height;
  this.canvas.style.border = this.backgroundColor+" 1px solid";
  this.canvas.style.borderRadius = "5px";
  this.canvas.style.backgroundColor = this.backgroundColor;
  this.canvas.style.width = width*(settingScreen.zoom?settingScreen.zoom:1)+"px";
  this.canvas.style.height = height*(settingScreen.zoom?settingScreen.zoom:1)+"px";
  this.ctx = this.canvas.getContext("2d");
  this.font = {
    defaultColor: settingScreen.defalutFontColor,
    size: settingScreen.fontSize,
    width: common.getBlockWidth(settingScreen.fontSize),
    height: common.getBlockHeight(settingScreen.fontSize),
    isLoaded: false,
    checkLoaded: function(func){
      if(document.fonts.check("1em "+settingFont.fontFamily)){
        this.isLoaded = true;
        func();
      }
    },
  };
  this.screen = {
    data: [],
    row: settingScreen.row,
    column: settingScreen.column,
    init:function(){
      this.data = [];
      for(let i = 0; i <settingScreen.row; i++){
        this.data[i]=[];
        for(let j = 0; j<settingScreen.column; j++){
          this.data[i][j]=new base.Canvas_Char(" ");
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
  };

  this.screen.init();

  if(!document.querySelector(`link[href='${settingFont.source}'][rel='stylesheet']`)){
    var link = document.createElement('link');
    link.href = settingFont.source;
    link.rel = "stylesheet";
    document.getElementsByTagName('head')[0].appendChild(link);
  }
  base.LoopObject.call(this, settingScreen.frameSpeed);
};
base.Canvas.prototype = Object.create(base.LoopObject.prototype);
base.Canvas.prototype.constructor = base.Canvas;

base.Canvas.prototype.calculate = function() {
  if(!this.font.isLoaded) this.font.checkLoaded(_=>{
    this.screen.refresh();
  });
};
base.Canvas.prototype.draw = function() {
  let ctx = this.ctx;
  ctx.textBaseline = "buttom";
  for(let i = 0; i <this.screen.row; i++){
    for(let j = 0; j<this.screen.column; j++){
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
};
base.Canvas.prototype.fillChar = function(char){
  if(typeof char != "string") char = " ";
  this.screen.data = [];
  for(let i = 0; i <this.screen.row; i++){
    this.screen.data[i]=[];
    for(let j = 0; j<this.screen.column; j++){
      this.screen.data[i][j]=new base.Canvas_Char(char);
    }
  }
};
base.Canvas.prototype.clear = function(){
  this.fillChar(" ");
};
base.Canvas.prototype.isInCanvas = function(x,y){
  if(x>=0 && y>=0 && y<this.screen.data.length && x<this.screen.data[y].length) return true;
  else return false;
};
base.Canvas.prototype.insertChar = function(x,y,char,color,backgroundColor){
  if(char.constructor != String) return console.error(char+" is invalid");

  color = color?color:this.font.defaultColor;
  backgroundColor = backgroundColor?backgroundColor:this.backgroundColor;

  if(this.isInCanvas(x,y)
    && (this.screen.data[y][x].char != char
      || this.screen.data[y][x].color != color
      || this.screen.data[y][x].backgroundColor != backgroundColor)){
    let regex = common.getFullwidthRegex();
    let fullwidth = regex.test(char);

    this.screen.data[y][x] = new base.Canvas_Char(char,fullwidth,color,backgroundColor);

    // to clean background outliner
    if(this.isInCanvas(x-1,y)) this.screen.data[y][x-1].draw = true;
    if(this.isInCanvas(x+(fullwidth?2:1),y)) this.screen.data[y][x+(fullwidth?2:1)].draw = true;
  }
};
base.Canvas.prototype.deleteChar = function(x,y){
  if(char.constructor != String) return console.error(char+" is invalid");
  this.insertChar(x,y," ");
};
base.Canvas.prototype.insertText = function(x,y,text,color,backgroundColor){
  let regex = common.getFullwidthRegex();
  text = text.replace(regex,"$1 ");
  if(text.constructor != String) return console.error(text+" is invalid");
  if(y<0 || y>=this.screen.data.length) return;
  for(let i = 0; i<text.length; i++){
    if(x+i>=0 && x+i <this.screen.column){
      this.insertChar(x+i,y,text[i],color,backgroundColor);

      let regex = common.getFullwidthRegex();
      let fullwidth = regex.test(text[i]);
      if(fullwidth){
        i++;
        this.insertChar(x+i,y,"$fullwidthFiller");
      }
    }
  }
};
base.Canvas.prototype.deleteText = function(x,y,text){
  if(text.constructor != String) return console.error(text+" is invalid");
  this.insertText(x,y,text.replace(/./g," "));
};



base.DevTask = function(domId, data, calculate){
  this.outputDom = document.querySelector("#"+setting.devMode.outputDomId);
  this.output = '';
  this.domId = domId;
  this.data = data;
  this.calculate = calculate;
  base.LoopObject.call(this, setting.screen.frameSpeed);
};
base.DevTask.prototype = Object.create(base.LoopObject.prototype);
base.DevTask.prototype.constructor = base.DevTask;

base.DevTask.prototype.calculate = function(){
  // get this from constructor
};
base.DevTask.prototype.draw = function(){
  let dom = document.querySelector("#"+this.domId);
  if(!dom){
    dom = document.createElement("div");
    dom.id = this.domId;
    this.outputDom.appendChild(dom);
  }
  dom.innerText = this.output;
};
base.DevTask.prototype.stop = function(){
  let dom = document.querySelector("#"+this.domId);
  dom.remove();
  this.isActive = false;
};
base.DevTask.prototype.restart = function(){
  this.isActive = true;
};
base.DevTask.prototype.destroy = function(){
  if(Array.isArray(this.container)){
    let i = this.container.indexOf(this);
    if (i >= 0) this.container.splice(i,1);
  }
  let dom = document.querySelector("#"+this.domId);
  dom.remove();
};


base.canvas = new base.Canvas(setting.screen, setting.font);

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

base.inputs.init();

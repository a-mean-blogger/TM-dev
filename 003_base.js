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
  // if(this.speed) this.initInterval();
};
base.LoopObject.prototype.initInterval = function(){
  this.isActive = true;
  this.interval.init(this.speed, _=> {
    if(this.isActive) this.calculate();
    if(this.isActive) this.draw();
  });
};
base.LoopObject.prototype.calculate = function(){};
base.LoopObject.prototype.draw = function(){};
base.LoopObject.prototype.destroy = function(){
  this.interval.stop();
  this.isActive = false;
  this.erase();
};
base.LoopObject.prototype.erase = function(){};


base.Program = function(speed,properties){
  if(properties){
    this.x = properties.x;
    this.y = properties.y;
  }
  this.objects = [];
  this.uniqueObjects = {};
  this.count = 0;
  base.LoopObject.call(this, speed);
};
base.Program.prototype = Object.create(base.LoopObject.prototype);
base.Program.prototype.constructor = base.Program;

base.Program.prototype.timeline = function(){};
base.Program.prototype.getInput = function(){};
base.Program.prototype.calculate = function(){
  this.count++;
  this.timeline();
  this.getInput();
};
base.Program.prototype.init = function(){
  this.objects = [];
  this.uniqueObjects = {};
  this.count = 0;
  this.initInterval();
};
base.Program.prototype.destroy = function(){
  base.LoopObject.prototype.destroy.call(this);
  this.count = 0;
  for(let i = this.objects.length-1;i>=0;i--){
    this.objects[i].destroy();
  }
  for(let key in this.uniqueObjects){
    if(this.uniqueObjects[key])this.uniqueObjects[key].destroy();
  }
};
base.Program.prototype.addToObjects = function(object){
  this.objects = game.programs.intro.objects.filter(object => object.isActive);
  this.objects.push(object);
};


base.Canvas_Char = function(screen, char, isFullwidth, color, backgroundColor){
  this.char = char;
  this.isFullwidth = isFullwidth;
  this.color = color?color:screen.defalutFontColor;
  this.backgroundColor = backgroundColor?backgroundColor:screen.backgroundColor;
  this.font = screen.fontFamily;
  this.isNew = true;
};


base.Canvas = function(screenInput){
  this.screen = setting.screen;
  if(screenInput){
    for(let p in this.screen){
      if(screenInput[p]!==undefined) this.screen[p] = screenInput[p];
    }
  }

  this.isFontLoaded = false;
  this.screenData = [];
  this.blockWidth = common.getBlockWidth(this.screen.fontSize);
  this.blockHeight = common.getBlockHeight(this.screen.fontSize);

  this.canvas = document.querySelector("#"+this.screen.canvasId);
  this.canvas.width = this.blockWidth * this.screen.column;
  this.canvas.height = this.blockHeight * this.screen.row;
  this.canvas.style.border = this.screen.backgroundColor+" 1px solid";
  this.canvas.style.borderRadius = "5px";
  this.canvas.style.backgroundColor = this.screen.backgroundColor;
  this.canvas.style.width = this.canvas.width * this.screen.zoom + "px";
  this.canvas.style.height = this.canvas.height * this.screen.zoom + "px";
  this.ctx = this.canvas.getContext("2d");

  base.LoopObject.call(this, this.screen.frameSpeed);
};
base.Canvas.prototype = Object.create(base.LoopObject.prototype);
base.Canvas.prototype.constructor = base.Canvas;

base.Canvas.prototype.init = function () {
  this.initScreenData();
  if(!document.querySelector(`link[href='${this.screen.fontSource}'][rel='stylesheet']`)){
    var link = document.createElement('link');
    link.href = this.screen.fontSource;
    link.rel = "stylesheet";
    document.getElementsByTagName('head')[0].appendChild(link);
  }
  this.initInterval();
};
base.Canvas.prototype.calculate = function() {
  if(!this.isFontLoaded) this.checkFontLoaded();
};
base.Canvas.prototype.draw = function() {
  let ctx = this.ctx;
  ctx.textBaseline = "buttom";
  for(let i = 0; i <this.screen.row; i++){
    for(let j = 0; j<this.screen.column; j++){
      if(this.screenData[i][j].char[0] != "$"
        && this.screenData[i][j].isNew === true
      ){
        //draw backgroundColor
        let bgX = this.blockWidth*j-this.blockWidth*0.05;
        let bgY = this.blockHeight*i;
        let width = (this.screenData[i][j].isFullwidth?this.blockWidth*2:this.blockWidth)+this.blockWidth*0.05;
        let height = this.blockHeight;
        ctx.fillStyle = this.screenData[i][j].backgroundColor;
        ctx.fillRect(bgX,bgY,width,height);

        //draw char
        let chX = this.blockWidth*j;
        let chY = this.blockHeight*i+this.blockHeight*0.8; // y adjustment
        let charset = common.getCharGroup(this.screenData[i][j].char);
        if(charset){
          ctx.font = this.screen.fontSize*charset.sizeAdj+"px "+this.screenData[i][j].font;
          chX = chX+this.blockWidth*charset.xAdj;
          chY = chY+this.blockHeight*charset.yAdj;
        }
        else {
          ctx.font = this.screen.fontSize+"px "+this.screenData[i][j].font;
        }
        ctx.fillStyle = this.screenData[i][j].color;
        ctx.fillText(this.screenData[i][j].char,chX,chY);

        //do not draw once it already drew for the better performance
        this.screenData[i][j].isNew = false;
      }
    }
  }
};
base.Canvas.prototype.checkFontLoaded= function(){
  if(document.fonts.check("1em "+this.screen.fontFamily)){
    this.isFontLoaded = true;
    this.refreshScreen();
  }
};
base.Canvas.prototype.isInCanvas = function(x,y){
  if(x>=0 && y>=0 && y<this.screenData.length && x<this.screenData[y].length) return true;
  else return false;
};
base.Canvas.prototype.initScreenData = function(){
  this.screenData = [];
  for(let i = 0; i <this.screen.row; i++){
    this.screenData[i]=[];
    for(let j = 0; j<this.screen.column; j++){
      this.screenData[i][j]=new base.Canvas_Char(this.screen, " ");
    }
  }
};
base.Canvas.prototype.refreshScreen = function(){
  for(let i = 0; i <this.screenData.length; i++){
    for(let j = 0; j<this.screenData[i].length; j++){
      this.screenData[i][j].isNew = true;
    }
  }
};
base.Canvas.prototype.fillScreen = function(char){
  if(typeof char != "string") char = " ";
  this.screenData = [];
  for(let i = 0; i <this.screen.row; i++){
    this.screenData[i]=[];
    for(let j = 0; j<this.screen.column; j++){
      this.screenData[i][j]=new base.Canvas_Char(this.screen, char);
    }
  }
};
base.Canvas.prototype.clearScreen = function(){
  this.fillScreen(" ");
};
base.Canvas.prototype.insertChar = function(x,y,char,color,backgroundColor){
  if(char.constructor != String) return console.error(char+" is invalid");

  if(this.isInCanvas(x,y)
    && (this.screenData[y][x].char != char
      || this.screenData[y][x].color != color
      || this.screenData[y][x].backgroundColor != backgroundColor)){
    let regex = common.getFullwidthRegex();
    let fullwidth = regex.test(char);

    this.screenData[y][x] = new base.Canvas_Char(this.screen, char,fullwidth,color,backgroundColor);

    // to clean background outliner
    if(this.isInCanvas(x-1,y)) this.screenData[y][x-1].draw = true;
    if(this.isInCanvas(x+(fullwidth?2:1),y)) this.screenData[y][x+(fullwidth?2:1)].draw = true;
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
  if(y<0 || y>=this.screenData.length) return;
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
  base.LoopObject.call(this, 10);
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



base.canvas = new base.Canvas();

console.log("game.js loaded");

var game = {};

game = {
  programs:{},
  init: function(){
    this.destroy();
    this.programs.intro.init();
  },
  destroy: function(){
    for(let i in this.programs){
      var program = this.programs[i];
      program.destroy();
    }
  }
};

function Program(properties){
  this.x = properties.x;
  this.y = properties.y;
  this.speed = properties.speed;
  this.objects = [];
  this.uniqueObjects = {};
  this.count = 0;
}
Program.prototype.timeline = function(){};
Program.prototype.calculate = function(){};
Program.prototype.getInput = function(){};
Program.prototype.uniqueObjectsLoop = function(){};
Program.prototype.loop = function(){
  this.getInput();
  this.timeline();
  this.count++;
  this.objects.forEach(object => object.loop());
  this.uniqueObjectsLoop();
  this.calculate();
  if(setting.env.devMode){
    this.dev.displaySpeed();
  }
};
Program.prototype.init = function(){
  this.objects = [];
  this.count = 0;
  base.canvas.clear();
  base.main.loop = _=>this.loop();
};
Program.prototype.destroy = function(){
  this.objects = [];
};
Program.prototype.dev = {};
Program.prototype.dev.savedTime = undefined
Program.prototype.dev.displaySpeed = function(){
    var now = Date.now();
    if(this.savedTime){
      var d = now-this.savedTime;
      base.canvas.insertText(0,0,"speed: "+ d+"   ");
    }
    this.savedTime = now;
}

game.programs.intro = new Program({x:5,y:3,speed:10});
game.programs.intro.timeline = function(){
  if(this.count ==  10) base.canvas.insertText(this.x,this.y+0, "■□□□■■■□□■■□□■■");
  if(this.count ==  20) base.canvas.insertText(this.x,this.y+1, "■■■□  ■□□    ■■□□■");
  if(this.count ==  30) base.canvas.insertText(this.x,this.y+2, "□□□■              □■  ■");
  if(this.count ==  40) base.canvas.insertText(this.x,this.y+3, "■■□■■  □  ■  □□■□□");
  if(this.count ==  50) base.canvas.insertText(this.x,this.y+4, "■■  ■□□□■■■□■■□□");
  if(this.count ==  60) base.canvas.insertText(this.x,this.y+5, "           www.A-MEAN-Blog.com");
  if(this.count ==  70) base.canvas.insertText(this.x+10,this.y+2, "T E T R I S");
  if(this.count ==  70){
    this.objects.push(new Star(this.objects,{x:this.x+8,y:this.y+1,speed:60}));
    this.objects.push(new Star(this.objects,{x:this.x+26,y:this.y+2,speed:90}));
    base.canvas.insertText(this.x,this.y+7, "Please Enter Any Key to Start..");
    base.canvas.insertText(this.x,this.y+9, "  △   : Shift");
    base.canvas.insertText(this.x,this.y+10,"◁  ▷ : Left / Right");
    base.canvas.insertText(this.x,this.y+11,"  ▽   : Soft Drop");
    base.canvas.insertText(this.x,this.y+12," SPACE : Hard Drop");
    base.canvas.insertText(this.x,this.y+13,"   P   : Pause");
    base.canvas.insertText(this.x,this.y+14,"  ESC  : Quit");
    base.canvas.insertText(this.x,this.y+16,"BONUS FOR HARD DROPS / COMBOS");
  }
};
game.programs.intro.getInput = function(){
  if(this.count>10 && base.inputs.keyboard.checkAny()){
    this.destroy();
    game.programs.tetris.init();
  }
};

game.programs.tetris = new Program({speed:10});
game.programs.tetris.uniqueObjects = {
  tatus : undefined,
  player1Game : undefined
};
game.programs.tetris.init = function(){
  Program.prototype.init.call(this);
  this.uniqueObjects.status = new Status({x:28,y:3});
  this.uniqueObjects.status.drawFrame();
  this.uniqueObjects.player1Game = new Tetris({x:3,y:1,keyset:setting.game.tetris1.keyset},this.uniqueObjects.status);
};
game.programs.tetris.uniqueObjectsLoop = function(){
  if(this.uniqueObjects.player1Game)this.uniqueObjects.player1Game.loop();
};
game.programs.tetris.getInput = function(){
  if(base.inputs.keyboard.check(KEY_ESC)){
    this.destroy();
    game.programs.intro.init();
  }
};

game.init();

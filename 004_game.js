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
      let program = this.programs[i];
      program.destroy();
    }
  },
  changeProgram: function(program){
    this.destroy();
    program.init();
  }
};

game.programs.intro = new base.Program(10,{x:5,y:3});
game.programs.intro.timeline = function(){
  if(this.count ==  10) base.canvas.insertText(this.x,this.y+0, "■□□□■■■□□■■□□■■");
  if(this.count ==  20) base.canvas.insertText(this.x,this.y+1, "■■■□  ■□□    ■■□□■");
  if(this.count ==  30) base.canvas.insertText(this.x,this.y+2, "□□□■              □■  ■");
  if(this.count ==  40) base.canvas.insertText(this.x,this.y+3, "■■□■■  □  ■  □□■□□");
  if(this.count ==  50) base.canvas.insertText(this.x,this.y+4, "■■  ■□□□■■■□■■□□");
  if(this.count ==  60) base.canvas.insertText(this.x,this.y+5, "           www.A-MEAN-Blog.com");
  if(this.count ==  70) base.canvas.insertText(this.x+10,this.y+2, "T E T R I S");
  if(this.count ==  70){
    this.addToObjects(new Star(500,{x:this.x+8,y:this.y+1}));
    this.addToObjects(new Star(700,{x:this.x+26,y:this.y+2}));
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
  if(!base.inputs.keyboard.check(setting.game.keyset.QUIT) &&  base.inputs.keyboard.checkAny()){
    game.changeProgram(game.programs.tetris);
  }
};
game.programs.intro.erase = function(){
  base.canvas.clearScreen();
};

game.programs.tetris = new base.Program(10,{x:0,y:0});
game.programs.tetris.uniqueObjects = {
  status : undefined,
  player1Game : undefined
};
game.programs.tetris.init = function(){
  base.Program.prototype.init.call(this);
  this.uniqueObjects.status = new Status({x:28,y:3});
  this.uniqueObjects.player1Game = new Tetris({x:3,y:1,keyset:setting.game.tetris1.keyset},this.uniqueObjects.status);
  this.initInterval();
};
game.programs.tetris.getInput = function(){
  if(base.inputs.keyboard.check(setting.game.keyset.QUIT)){
    game.changeProgram(game.programs.intro);
  }
};
game.programs.tetris.erase = function(){
  base.canvas.clearScreen();
};

// game.init();
